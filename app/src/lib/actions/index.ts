import type { Action } from "svelte/action";
import { isNullish } from "malachite-ui/predicate";

export interface HTMLExpandableTextArea extends HTMLTextAreaElement {
	baseScrollHeight: number;
}

// Yair Evan Or https://codepen.io/vsync/pen/bGgQzL
// I have no idea how this works, why it works and why my modifications fixed bugs
export function handleExpandableArea(this: HTMLExpandableTextArea) {
	if (this.value.length >= this.maxLength - 4) return;

	const minimum = this.getAttribute("data-minimum-rows");
	const finalMinimum = minimum ? +minimum : 3;
	let rows: number;

	if (isNullish(this.baseScrollHeight)) setScrollHeight(this);

	this.rows = finalMinimum;
	rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 28);
	this.rows = finalMinimum + rows;
}

export const hideScrollbar: Action = () => {
	const body = document.body;
	const initialOverflow = body.style.overflow;
	body.style.overflow = "hidden";
	return {
		destroy: () => (body.style.overflow = initialOverflow)
	};
};

function setScrollHeight(element: HTMLExpandableTextArea) {
	const value = element.value;
	element.value = "";
	element.baseScrollHeight = element.scrollHeight;
	element.value = value;
}
