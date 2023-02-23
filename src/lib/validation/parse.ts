import { bigint } from "zod";
import { isNullish, isString, isWhitespace } from "malachite-ui/predicate";

export function parseBigint(id: FormDataEntryValue | null):
	| {
			failed: true;
			reason: "EMPTY" | "MISSING" | "INVALID";
	  }
	| { failed: false; data: bigint } {
	if (isNullish(id)) return { failed: true, reason: "MISSING" };
	if (isString(id)) {
		if (isWhitespace(id)) return { failed: true, reason: "EMPTY" };
		try {
			return { failed: false, data: bigint().parse(BigInt(id)) };
		} catch {
			return { failed: true, reason: "INVALID" };
		}
	}
	return { failed: true, reason: "INVALID" };
}
