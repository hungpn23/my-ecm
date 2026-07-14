import { SetMetadata } from "@nestjs/common";
import { ReflectorMetadataKey } from "../enum/reflector-metadata-key.enum";

export const PublicEndpoint = () => SetMetadata(ReflectorMetadataKey.IS_PUBLIC_ENDPOINT, true);
