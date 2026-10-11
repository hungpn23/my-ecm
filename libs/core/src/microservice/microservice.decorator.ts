import { Inject } from "@nestjs/common";
import type { MicroserviceClient } from "./microservice.constant";

export const InjectMicroserviceClient = (client: MicroserviceClient) => Inject(client);
