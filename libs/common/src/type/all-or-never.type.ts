export type AllOrNever<T, K extends keyof T = keyof T> = Pick<T, K> | { [P in K]?: never };
