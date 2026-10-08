export const QUESTIONS = [
  ['React', 'What is the virtual DOM and why does React use it?', 'A lightweight in-memory tree of UI elements. React diffs the new tree with the previous one and applies only the minimal real DOM changes, making updates predictable and efficient.'],
  ['React', 'When do useMemo and useCallback help?', 'When a computation is expensive or a stable reference prevents re-renders of memoized children or effect re-runs. Overusing them adds cost without benefit.'],
  ['React', 'Explain the useEffect cleanup function.', 'It runs before the effect re-runs and on unmount. Use it to unsubscribe listeners, clear timers and abort requests to avoid leaks and stale updates.'],
  ['React', 'Why are keys needed in lists?', 'Keys give elements stable identity so React can reorder, add and remove items correctly instead of re-mounting or mixing up state. Avoid array indexes for dynamic lists.'],
  ['JavaScript', 'What is a closure?', 'A function that retains access to variables from its defining scope even after that scope has finished executing.'],
  ['JavaScript', 'Explain the event loop.', 'JS runs one call stack. Async callbacks queue up; the loop runs microtasks (promises) first, then the next macrotask (timers, I/O) whenever the stack is empty.'],
  ['JavaScript', 'Difference between == and ===?', '== coerces types before comparing; === compares value and type with no coercion. Prefer === for predictability.'],
  ['Web', 'What is CORS?', 'A browser mechanism where servers declare, via response headers, which origins may read their responses, relaxing the same-origin policy safely.'],
  ['Web', 'How do you improve page load performance?', 'Code-split and lazy-load routes, compress and size images, cache with immutable hashed assets, minimize blocking JS, and measure with Lighthouse/Web Vitals.'],
  ['Web', 'Authentication vs authorization?', 'Authentication verifies who you are; authorization decides what you may do. Enforce authorization on the server (e.g. security rules), never only in the UI.'],
  ['Databases', 'Why use indexes in a database?', 'They speed up reads by avoiding full scans, at the cost of extra storage and slower writes. Firestore requires composite indexes for multi-field ordered queries.'],
  ['Git', 'Merge vs rebase?', 'Merge preserves history with a merge commit; rebase rewrites your commits on top of another branch for a linear history. Never rebase shared branches.'],
];
