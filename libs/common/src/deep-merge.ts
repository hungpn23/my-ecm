import { mergeWith } from "lodash";

export function deepMerge<TTarget, TSource>(target: TTarget, source: TSource): TTarget & TSource {
  return mergeWith({}, target, source, (targetValue, sourceValue): unknown[] | undefined => {
    return Array.isArray(targetValue) ? targetValue.concat(sourceValue) : undefined;
  });
}
