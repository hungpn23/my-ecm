import { Module } from "@nestjs/common";

import { PaymentConsumer } from "./payment.consumer";
import { PaymentRpcService } from "./payment.rpc-service";

@Module({
  controllers: [PaymentConsumer],
  providers: [PaymentRpcService],
})
export class PaymentModule {}
