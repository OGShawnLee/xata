type Result<T, E> = { failed: true; error: E } | { failed: false; data: T };

export async function useAwait<T, E = unknown>(
  fn: () => T | Promise<T>
): Promise<Result<T, E>> {
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
