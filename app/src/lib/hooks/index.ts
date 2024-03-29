type Result<T, E> = { failed: true; error: E } | { failed: false; data: T };

export async function useAwait<T, E = unknown>(fn: () => T | Promise<T>): Promise<Result<T, E>> {
	try {
		const data = await fn();
		return { failed: false, data };
	} catch (error) {
		return { failed: true, error: error as E };
	}
}

export function useCatch<T, E>(fn: () => T): Result<T, E> {
	try {
		const data = fn();
		return { failed: false, data };
	} catch (error) {
		return { failed: true, error: error as E };
	}
}

export { default as useAPI } from "./useAPI";
export { default as useAsideLayout } from "./useAsideLayout";
export { default as useChatRoom } from "./useChatRoom";
export { default as useComposeDialog } from "./useComposeDialog";
export { default as useInfiniteScrolling } from "./useInfiniteScrolling";
export { default as usePageDialog } from "./usePageDialog";
export { default as useWarningDialog } from "./useWarningDialog";
