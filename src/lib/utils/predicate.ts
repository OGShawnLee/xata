import { isNullish } from "malachite-ui/predicate";

export function isDate(value: unknown): value is Date {
	return value instanceof Date;
}

export function isDefined<T>(value: T): value is NonNullable<T> {
	return !isNullish(value);
}
