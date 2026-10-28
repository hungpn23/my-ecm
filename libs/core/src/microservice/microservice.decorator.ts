import { Inject } from "@nestjs/common";

import type { MicroserviceClient } from "./microservice.rpc-schema";

export const InjectMicroserviceClient = (client: MicroserviceClient): ReturnType<typeof Inject> => Inject(client);
