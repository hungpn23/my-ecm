import { Inject, Injectable } from "@nestjs/common";
import type { ClientKafkaProxy } from "@nestjs/microservices";
import type { Observable } from "rxjs";
import { KAFKA_CLIENT } from "./kafka.constant";

@Injectable()
export class KafkaService {
  constructor(@Inject(KAFKA_CLIENT) private readonly client: ClientKafkaProxy) {
    this.client.connect().catch((err) => {
      console.error("Failed to connect to Kafka:", err);
    });
  }

  emit<TPayload>(pattern: string, payload: TPayload): Observable<void> {
    return this.client.emit<void, TPayload>(pattern, payload);
  }
}
