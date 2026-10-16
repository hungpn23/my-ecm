import _ from "lodash";

export function deepMerge<TTarget, TSource extends TTarget>(
  target: TTarget,
  source?: TSource,
): TTarget {
  if (!source) return target;

  return _.mergeWith({}, target, source, (targetValue, sourceValue): unknown[] | undefined => {
    return Array.isArray(targetValue) ? targetValue.concat(sourceValue) : undefined;
  });
}
