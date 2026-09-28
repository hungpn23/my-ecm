import type { EntityResponse } from "@libs/common";

export abstract class BaseService<T extends object> {
  protected abstract _toResponse(entity: T): EntityResponse;
}
