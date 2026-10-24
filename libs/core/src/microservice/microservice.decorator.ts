import { Inject } from "@nestjs/common";

import type { MicroserviceClient } from "./microservice.schema";

export const InjectMicroserviceClient = (client: MicroserviceClient): ReturnType<typeof Inject> => Inject(client);
