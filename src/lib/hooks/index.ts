export async function use_await<T, E = unknown>(
	fn: () => T | Promise<T>
): Promise<{ failed: true; error: E } | { failed: false; data: T }> {
	try {
		const data = await fn();
		return { failed: false, data };
	} catch (error) {
		return { failed: true, error: error as E };
	}
}
