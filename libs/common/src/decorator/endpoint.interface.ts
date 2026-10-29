import type { AnyRecord } from "@libs/contract";

export interface EndpointParams {
  path: string | string[];
  public: boolean;
  request: typeof AnyRecord;
  response: typeof AnyRecord;
  query: typeof AnyRecord;
  params: typeof AnyRecord;
  headers: [string, string][];
}
