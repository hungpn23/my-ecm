import { MicroserviceModule } from "@libs/core";
import { Module } from "@nestjs/common";

import { CheckoutController } from "./checkout.controller";
import { CheckoutService } from "./checkout.service";

@Module({
  imports: [
    MicroserviceModule.registerAsync("IDENTITY_SERVICE", "PRODUCT_SERVICE", "INVENTORY_SERVICE", "PAYMENT_SERVICE"),
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
