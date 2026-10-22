import { Inject } from "@nestjs/common";

import type { MicroserviceClient } from "./microservice.schema";

export const InjectMicroserviceClient = (client: MicroserviceClient) => Inject(client);
