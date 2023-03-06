export function getCharCountColour(charCount: number) {
	if (charCount === 0) return "text-rose-500";
	if (charCount < 160) return "text-emerald-500";
	if (charCount >= 160 && charCount < 280) return "text-orange-500";
	return "text-red-500";
}
