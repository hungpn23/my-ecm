import {
  Checkout,
  type ConfirmCheckout,
  NonNegativeDecimal,
  type OpenCheckout,
  type Order,
  type ProcessPaymentResponse,
  type Uuid,
} from "@libs/contract";
import { IdentityClient, InventoryClient, PaymentClient, ProductClient } from "@libs/core";
import { LockMode } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { AuthorizationService } from "@nestjs/authorization";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { CheckoutEntity, OrderEntity } from "#internal/database/entity/index";

import { CheckoutPolicy } from "./checkout.policy";

@Injectable()
export class CheckoutService {
  constructor(
    private readonly em: EntityManager,
    private readonly authContext: AuthenticationContext,
    private readonly authorization: AuthorizationService,
    private readonly identity: IdentityClient,
    private readonly product: ProductClient,
    private readonly inventory: InventoryClient,
    private readonly payment: PaymentClient,
  ) {}

  async open({ productId, addressId, quantity, paymentMethod }: OpenCheckout): Promise<Checkout> {
    const user = this.authContext.requireUser();
    const [[product], address] = await Promise.all([
      this.product.send("get.products.by-ids", { productIds: [productId] }),
      this.identity.send("get.address.by-id", { addressId, userId: user.id }),
    ]);

    if (product?.status !== "ACTIVE") {
      throw new NotFoundException("Product not found or inactive", { errorCode: "PRODUCT_NOT_FOUND_OR_INACTIVE" });
    }

    const canOpenCheckout = await this.authorization.can(CheckoutPolicy, "open", user, product);
    if (!canOpenCheckout) {
      throw new ForbiddenException("User is not allowed to open a checkout", {
        errorCode: "CHECKOUT_NOT_ALLOWED",
      });
    }

    if (!address) throw new NotFoundException("Address not found", { errorCode: "ADDRESS_NOT_FOUND" });

    const total = this._calculateTotal(product.price, quantity);

    return await this.em.transactional(async (em) => {
      const checkout = em.create(CheckoutEntity, {
        userId: user.id,
        shopId: product.shopId,
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity,
        shippingFee: NonNegativeDecimal.assert("0.00"),
        total,
        recipientName: address.recipientName,
        phone: address.phone,
        shippingAddress: address.address,
        paymentMethod,
        status: "OPEN",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      await em.flush();

      return checkout.toResponse();
    });
  }

  async findById(checkoutId: Uuid): Promise<Checkout> {
    return await this.em.transactional(async (em) => {
      const checkout = await em.findOneOrFail(CheckoutEntity, {
        id: checkoutId,
        userId: this.authContext.requireUser().id,
      });

      return checkout.toResponse();
    });
  }

  async processPayment(checkoutId: Uuid): Promise<ProcessPaymentResponse> {
    const userId = this.authContext.requireUser().id;

    const openingCheckout = await this.em.transactional(async (em) => {
      const checkout = await em.findOneOrFail(CheckoutEntity, { id: checkoutId, userId });

      if (!checkout.isOpen) {
        throw new ConflictException("Checkout status is not OPEN", { errorCode: "CHECKOUT_NOT_OPEN" });
      }

      if (checkout.isExpired) {
        throw new ConflictException("Checkout has expired", { errorCode: "CHECKOUT_EXPIRED" });
      }

      return checkout.toResponse();
    });

    const reservation = await this.inventory.send("reserve.stock", {
      checkoutId: openingCheckout.id,
      productId: openingCheckout.productId,
      shopId: openingCheckout.shopId,
      quantity: openingCheckout.quantity,
    });

    const pendingCheckout = await this.em.transactional(async (em) => {
      const checkout = await em.findOneOrFail(CheckoutEntity, { id: checkoutId, userId });

      if (checkout.status !== "OPEN") {
        throw new ConflictException("Checkout status is not OPEN", { errorCode: "CHECKOUT_NOT_OPEN" });
      }

      checkout.status = "PAYMENT_PENDING";
      checkout.expiresAt = reservation.expiresAt;
      await em.flush();

      return checkout.toResponse();
    });

    const payment = await this.payment.send("create.payment", {
      checkoutId: pendingCheckout.id,
      amount: pendingCheckout.total,
      expiresAt: reservation.expiresAt,
    });

    return { checkout: pendingCheckout, payment };
  }

  async confirm(checkoutId: Uuid, { paymentId }: ConfirmCheckout): Promise<Order> {
    const userId = this.authContext.requireUser().id;

    await this.em.transactional(async (em) => {
      const checkout = await em.findOneOrFail(CheckoutEntity, { id: checkoutId, userId });

      if (!checkout.isAwaitingPayment) {
        throw new ConflictException("Checkout status is not PAYMENT_PENDING", {
          errorCode: "CHECKOUT_NOT_PAYMENT_PENDING",
        });
      }
    });

    await this.payment.send("confirm.payment", { checkoutId, paymentId });
    await this.inventory.send("commit.stock", { checkoutId, paymentId });

    return await this.em.transactional(async (em) => {
      const checkout = await em.findOneOrFail(
        CheckoutEntity,
        { id: checkoutId, userId },
        { lockMode: LockMode.PESSIMISTIC_WRITE },
      );

      if (!checkout.isAwaitingPayment) {
        throw new ConflictException("Checkout status is not PAYMENT_PENDING", {
          errorCode: "CHECKOUT_NOT_PAYMENT_PENDING",
        });
      }

      checkout.status = "ORDER_CREATED";
      const order = em.create(OrderEntity, { checkout, status: "READY_TO_SHIP" });
      await em.flush();

      return order.toResponse();
    });
  }

  private _calculateTotal(price: NonNegativeDecimal, quantity: number): NonNegativeDecimal {
    const cents = BigInt(price.replace(".", "")) * BigInt(quantity);
    const totalValue = `${cents / 100n}.${(cents % 100n).toString().padStart(2, "0")}`;

    if (!NonNegativeDecimal.allows(totalValue)) {
      throw new BadRequestException("Checkout total exceeds the maximum", { errorCode: "CHECKOUT_TOTAL_TOO_LARGE" });
    }

    return NonNegativeDecimal.assert(totalValue);
  }
}
