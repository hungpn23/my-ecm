import type { EntityResponse } from "@libs/common";
import type { Loaded } from "@mikro-orm/postgresql";

export abstract class BaseService<T extends object> {
  protected abstract _toResponse(entity: Loaded<T>): EntityResponse;
  protected abstract _toDetailResponse(entity: Loaded<T>): EntityResponse;
}
