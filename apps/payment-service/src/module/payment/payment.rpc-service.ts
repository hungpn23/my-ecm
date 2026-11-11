import type { ConfirmPayment, CreatePayment, Payment } from "@libs/contract";
import { LockMode } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { ConflictException, Injectable } from "@nestjs/common";

import { PaymentEntity } from "#internal/database/entity/index";

@Injectable()
export class PaymentRpcService {
  constructor(private readonly em: EntityManager) {}

  async create(payload: CreatePayment): Promise<Payment> {
    return await this.em.transactional(async (em) => {
      const payment = em.create(PaymentEntity, { ...payload, status: "INITIATED" });

      await em.flush();

      return payment.toResponse();
    });
  }

  async confirm({ paymentId, checkoutId }: ConfirmPayment): Promise<Payment> {
    return await this.em.transactional(async (em) => {
      const payment = await em.findOneOrFail(
        PaymentEntity,
        { id: paymentId, checkoutId },
        { lockMode: LockMode.PESSIMISTIC_WRITE },
      );

      if (payment.isSucceeded) return payment.toResponse();

      if (!payment.isInitiated || payment.isExpired) {
        throw new ConflictException("Payment status is not initiated or expired", {
          errorCode: "PAYMENT_NOT_INITIATED_OR_EXPIRED",
        });
      }

      payment.status = "SUCCEEDED";
      await em.flush();

      return payment.toResponse();
    });
  }
}
