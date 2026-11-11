import {
  CommitStock,
  CreateStock,
  GetReservationByCheckoutId,
  type NullableReservation,
  type ProductStockResponse,
  type Reservation,
  ReserveStock,
} from "@libs/contract";
import type { MicroserviceCommand } from "@libs/core";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { StockRpcService } from "./stock.rpc-service";

@Controller()
export class StockConsumer {
  constructor(private readonly stock: StockRpcService) {}

  @MessagePattern<MicroserviceCommand>("create.stock")
  async create(@Payload({ schema: CreateStock }) payload: CreateStock): Promise<ProductStockResponse> {
    return await this.stock.create(payload);
  }

  @MessagePattern<MicroserviceCommand>("get.reservation.by-checkout-id")
  async findReservation(
    @Payload({ schema: GetReservationByCheckoutId }) payload: GetReservationByCheckoutId,
  ): Promise<NullableReservation> {
    return await this.stock.findReservation(payload);
  }

  @MessagePattern<MicroserviceCommand>("reserve.stock")
  async reserve(@Payload({ schema: ReserveStock }) payload: ReserveStock): Promise<Reservation> {
    return await this.stock.reserve(payload);
  }

  @MessagePattern<MicroserviceCommand>("commit.stock")
  async commit(@Payload({ schema: CommitStock }) payload: CommitStock): Promise<Reservation> {
    return await this.stock.commit(payload);
  }
}
