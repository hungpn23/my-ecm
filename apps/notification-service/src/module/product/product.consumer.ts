import { Controller } from "@nestjs/common";

@Controller()
export class ProductConsumer {
  // @KafkaMessage("product.created")
  // handleProductCreated(@Payload() data: unknown) {}
}
