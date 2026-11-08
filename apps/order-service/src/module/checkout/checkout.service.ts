import {
  type Checkout,
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
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";

import { CheckoutEntity, OrderEntity } from "#internal/database/entity/index";

@Injectable()
export class CheckoutService {
  constructor(
    private readonly em: EntityManager,
    private readonly authContext: AuthenticationContext,
    private readonly identity: IdentityClient,
    private readonly product: ProductClient,
    private readonly inventory: InventoryClient,
    private readonly payment: PaymentClient,
  ) {}

  async open({ productId, addressId, quantity, paymentMethod }: OpenCheckout): Promise<Checkout> {
    const userId = this.authContext.requireUser().id;
    const [products, address] = await Promise.all([
      this.product.send("get.products.by-ids", { productIds: [productId] }),
      this.identity.send("get.address.by-id", { addressId, userId }),
    ]);

    const [product] = products;
    if (product?.status !== "ACTIVE") throw new NotFoundException("Product not found or inactive");
    if (!address) throw new NotFoundException("Address not found");

    const cents = BigInt(product.price.replace(".", "")) * BigInt(quantity);
    const totalValue = `${cents / 100n}.${(cents % 100n).toString().padStart(2, "0")}`;
    if (!NonNegativeDecimal.allows(totalValue)) throw new BadRequestException("Checkout total exceeds the maximum");

    return await this.em.transactional(async (em) => {
      const checkout = em.create(CheckoutEntity, {
        userId,
        shopId: product.shopId,
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity,
        shippingFee: NonNegativeDecimal.assert("0.00"),
        total: NonNegativeDecimal.assert(totalValue),
        recipientName: address.recipientName,
        phone: address.phone,
        shippingAddress: address.address,
        paymentMethod,
        status: "OPEN",
        expiresAt: null,
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
      if (!checkout.isOpen) throw new ConflictException("Checkout status is not OPEN");

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
      if (checkout.status !== "OPEN") throw new ConflictException("Checkout status is not OPEN");

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
      if (!checkout.isAwaitingPayment) throw new ConflictException("Checkout status is not PAYMENT_PENDING");
    });

    await this.payment.send("confirm.payment", { checkoutId, paymentId });
    await this.inventory.send("commit.stock", { checkoutId, paymentId });

    return await this.em.transactional(async (em) => {
      const checkout = await em.findOneOrFail(
        CheckoutEntity,
        { id: checkoutId, userId },
        { lockMode: LockMode.PESSIMISTIC_WRITE },
      );
      if (!checkout.isAwaitingPayment) throw new ConflictException("Checkout status is not PAYMENT_PENDING");

      checkout.status = "ORDER_CREATED";
      const order = em.create(OrderEntity, { checkout, status: "READY_TO_SHIP" });
      await em.flush();

      return order.toResponse();
    });
  }
}
