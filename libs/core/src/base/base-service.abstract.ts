import type { EntityResponse } from "@libs/common";
import type { Loaded } from "@mikro-orm/postgresql";

export abstract class BaseService<T extends object> {
  protected abstract _toResponse(entity: Loaded<T>): EntityResponse;
}
