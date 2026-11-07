import type {
  CommitStock,
  CreateStock,
  GetReservationByCheckoutId,
  NullableReservation,
  ProductStock,
  Reservation,
  ReserveStock,
} from "@libs/contract";
import { LockMode } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { ConflictException, Injectable } from "@nestjs/common";

import { ReservationEntity, StockEntity } from "#internal/database/entity/index";

@Injectable()
export class StockRpcService {
  constructor(private readonly em: EntityManager) {}

  async create(payload: CreateStock): Promise<ProductStock> {
    const stock = await this.em.transactional((em) => em.create(StockEntity, { ...payload, reserved: 0 }));

    return stock.toProductStockResponse();
  }

  async findReservation({ checkoutId }: GetReservationByCheckoutId): Promise<NullableReservation> {
    return await this.em.transactional(async (em) => {
      const reservation = await em.findOne(ReservationEntity, { checkoutId }, { populate: ["stock"] });

      return reservation?.toResponse() ?? null;
    });
  }

  async reserve({ checkoutId, productId, shopId, quantity }: ReserveStock): Promise<Reservation> {
    return await this.em.transactional(async (em) => {
      const stock = await em.findOneOrFail(StockEntity, { productId, shopId });

      stock.reserved += quantity;

      const reservation = em.create(ReservationEntity, {
        checkoutId,
        stock,
        quantity,
        status: "HELD",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      await em.flush();

      const loadedReservation = await em.populate(reservation, ["stock"]);

      return loadedReservation.toResponse();
    });
  }

  async commit({ checkoutId, paymentId }: CommitStock): Promise<Reservation> {
    return await this.em.transactional(async (em) => {
      const reservation = await em.findOneOrFail(
        ReservationEntity,
        { checkoutId },
        { lockMode: LockMode.PESSIMISTIC_WRITE },
      );

      if (reservation.status === "COMMITTED") {
        if (reservation.committedPaymentId !== paymentId) {
          throw new ConflictException("Reservation was committed with another payment");
        }
      } else {
        if (reservation.status !== "HELD" || reservation.isExpired) {
          throw new ConflictException("Reservation cannot be committed");
        }

        await this.commitHeldReservation(em, reservation, paymentId);
        await em.flush();
      }

      const loadedReservation = await em.populate(reservation, ["stock"]);

      return loadedReservation.toResponse();
    });
  }

  private async commitHeldReservation(
    em: EntityManager,
    reservation: ReservationEntity,
    paymentId: CommitStock["paymentId"],
  ): Promise<void> {
    const stock = await em.findOneOrFail(
      StockEntity,
      { id: reservation.stock.id },
      { lockMode: LockMode.PESSIMISTIC_WRITE },
    );

    stock.onHand -= reservation.quantity;
    stock.reserved -= reservation.quantity;
    reservation.status = "COMMITTED";
    reservation.committedPaymentId = paymentId;
  }
}
