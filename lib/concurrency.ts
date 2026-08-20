// Runs task thunks with a cap on how many execute at once, preserving result order
// and each thunk's own return type (like Promise.all, but throttled). Used to avoid
// bursting many simultaneous connections at the WordPress origin, which runs on
// shared cPanel hosting with a limited concurrent-connection budget.
type UnwrapThunk<T> = T extends () => Promise<infer U> ? U : never;

export async function withConcurrencyLimit<
  T extends readonly (() => Promise<unknown>)[],
>(tasks: readonly [...T], limit: number): Promise<{ [K in keyof T]: UnwrapThunk<T[K]> }> {
  const results: unknown[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const current = nextIndex++;
      results[current] = await tasks[current]();
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results as { [K in keyof T]: UnwrapThunk<T[K]> };
}
