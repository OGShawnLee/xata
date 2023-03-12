export function getCharCountColour(charCount: number) {
	if (charCount === 0) return "text-rose-500";
	if (charCount < 160) return "text-emerald-500";
	if (charCount >= 160 && charCount < 280) return "text-orange-500";
	return "text-red-500";
}

// https://natclark.com/tutorials/javascript-relative-time/
export function getRelativeTime(date: Date) {
	const current = new Date().getTime();
	const currentSeconds = Math.floor(current / 1000);
	const old = date.getTime();
	const oldSeconds = Math.floor(old / 1000);
	const difference = currentSeconds - oldSeconds;

	if (difference < 60) {
		return getTimeString(difference, "second");
	} else if (difference < 3600) {
		// Less than an hour has passed:
		return getTimeString(Math.floor(difference / 60), "minute");
	} else if (difference < 86400) {
		// Less than a day has passed:
		return getTimeString(Math.floor(difference / 3600), "hour");
	} else if (difference < 2620800) {
		// Less than a month has passed:
		return getTimeString(Math.floor(difference / 86400), "day");
	} else if (difference < 31449600) {
		// Less than a year has passed:
		return getTimeString(Math.floor(difference / 2620800), "month");
	} else {
		// More than a year has passed:
		return getTimeString(Math.floor(difference / 31449600), "year");
	}
}

function getTimeString(amount: number, word: string) {
	return `${amount} ${plural(amount, word)} ago`;
}

export function plural(count: number, word: string) {
	return count === 1 ? word : word + "s";
}

export function range(length: number) {
	return [...Array(length).keys()];
}
