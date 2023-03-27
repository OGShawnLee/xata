import type { Hashtags } from "@types";
import sanitize from "sanitize-html";
import { isNullish } from "malachite-ui/predicate";

const HASHTAG_REGEX = /#[A-Za-z0-9]+/gm;

export function fromTweetTextToHTML(text: string) {
	const hashtags = getRawHashTags(text);
	let HTML = sanitize(text, { allowedTags: [], disallowedTagsMode: "escape" });
	if (isNullish(hashtags)) return HTML;
	return hashtags.reduce((HTML, hashtag) => {
		const href = "/hashtag/" + hashtag.substring(1);
		return HTML.replace(hashtag, link(href, hashtag));
	}, HTML);
}

export function getCharCountColour(charCount: number) {
	if (charCount === 0) return "text-rose-500";
	if (charCount < 160) return "text-emerald-500";
	if (charCount >= 160 && charCount < 280) return "text-orange-500";
	return "text-red-500";
}

function getRawHashTags(text: string, transform?: (hashtag: string) => string): Hashtags {
	const matches = text.match(HASHTAG_REGEX);
	if (isNullish(matches)) return;
	const hashtags = new Set<string>();
	if (transform) {
		for (const match of matches) hashtags.add(transform(match));
	} else for (const match of matches) hashtags.add(match);
	return Array.from(hashtags);
}

export function getHashtags(text: string): Hashtags {
	return getRawHashTags(text, (hashtag) => hashtag.toLowerCase());
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

function link(href: string, text: string) {
	return `<a class='text-cyan-500 hover:(text-cyan-400 underline) focus:(text-cyan-400 underline)' href='${href}'>${text}</a>`;
}

export function plural(count: number, word: string) {
	return count === 1 ? word : word + "s";
}

export function range(length: number) {
	return [...Array(length).keys()];
}
