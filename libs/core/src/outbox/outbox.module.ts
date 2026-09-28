import { Outbox } from "#internal/database/entity/index";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Global, Module } from "@nestjs/common";
import { OutboxService } from "./outbox.service";

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([Outbox])],
  providers: [OutboxService],
  exports: [OutboxService],
})
export class OutboxModule {}
