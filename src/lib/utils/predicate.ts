import { isNullish } from "malachite-ui/predicate";

export function isDefined<T>(value: T): value is NonNullable<T> {
	return !isNullish(value);
}
