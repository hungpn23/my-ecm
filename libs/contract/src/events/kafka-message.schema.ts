import { type } from "arktype";
import { AnyRecord } from "../shared/common.schema";

export const KafkaMessageIn = type({
  "key?": AnyRecord.pipe((k) => JSON.stringify(k)),
  value: AnyRecord.pipe((v) => JSON.stringify(v)),
  "headers?": AnyRecord.pipe((h) => {
    const result: Record<string, string> = {};

    for (const [k, v] of Object.entries(h)) {
      result[k] = JSON.stringify(v);
    }

    return result;
  }),
});
export type KafkaMessageIn = typeof KafkaMessageIn.inferIn;
export type KafkaMessageOut = typeof KafkaMessageIn.infer;
