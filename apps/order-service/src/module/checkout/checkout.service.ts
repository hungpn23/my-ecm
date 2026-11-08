import {
  type Checkout,
  type ConfirmCheckout,
  type CreateCheckout,
  NonNegativeDecimal,
  type Order,
  type PayCheckoutResponse,
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

  async create({ productId, addressId, quantity, paymentMethod }: CreateCheckout): Promise<Checkout> {
    const userId = this.authContext.requireUser().id;
    const [products, address] = await Promise.all([
      this.product.send("get.products.by-ids", { ids: [productId] }),
      this.identity.send("get.address.by-id", { addressId, userId }),
    ]);

    const [product] = products;
    if (product?.status !== "ACTIVE") throw new NotFoundException("Product not found");
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

  async findOne(id: Uuid): Promise<Checkout> {
    return await this.em.transactional(async (em) => {
      const checkout = await em.findOneOrFail(CheckoutEntity, { id, userId: this.authContext.requireUser().id });

      return checkout.toResponse();
    });
  }

  async pay(id: Uuid): Promise<PayCheckoutResponse> {
    const userId = this.authContext.requireUser().id;
    const openCheckout = await this.em.transactional(async (em) => {
      const checkout = await em.findOneOrFail(CheckoutEntity, { id, userId });
      if (checkout.status !== "OPEN") throw new ConflictException("Checkout is not open");

      return checkout.toResponse();
    });

    const reservation = await this.inventory.send("reserve.stock", {
      checkoutId: openCheckout.id,
      productId: openCheckout.productId,
      shopId: openCheckout.shopId,
      quantity: openCheckout.quantity,
    });

    const pendingCheckout = await this.em.transactional(async (em) => {
      const checkout = await em.findOneOrFail(CheckoutEntity, { id, userId });
      if (checkout.status !== "OPEN") throw new ConflictException("Checkout is not open");

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

  async confirm(id: Uuid, { paymentId }: ConfirmCheckout): Promise<Order> {
    const userId = this.authContext.requireUser().id;

    await this.em.transactional(async (em) => {
      const checkout = await em.findOneOrFail(CheckoutEntity, { id, userId });
      if (checkout.status !== "PAYMENT_PENDING") throw new ConflictException("Checkout is not awaiting payment");
    });

    await this.payment.send("confirm.payment", { checkoutId: id, paymentId });
    await this.inventory.send("commit.stock", { checkoutId: id, paymentId });

    return await this.em.transactional(async (em) => {
      const checkout = await em.findOneOrFail(CheckoutEntity, { id, userId }, { lockMode: LockMode.PESSIMISTIC_WRITE });
      if (checkout.status !== "PAYMENT_PENDING") throw new ConflictException("Checkout is not awaiting payment");

      checkout.status = "ORDER_CREATED";
      const order = em.create(OrderEntity, { checkout, status: "READY_TO_SHIP" });
      await em.flush();

      return order.toResponse();
    });
  }
}
