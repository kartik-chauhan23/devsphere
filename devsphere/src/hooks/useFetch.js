import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

const cache = new Map(); // shared in-memory cache avoids duplicate requests across pages
const reducer = (s, a) => {
  switch (a.type) {
    case 'load': return { ...s, status: 'loading', error: null };
    case 'ok': return { status: 'success', data: a.data, error: null };
    case 'err': return { status: 'error', data: null, error: a.error };
    default: return { status: 'idle', data: null, error: null };
  }
};

/** idle → loading → success | error, with TTL cache, abort-on-unmount and retry. key=null keeps it idle. */
export function useFetch(key, fetcher, { ttl = 60000 } = {}) {
  const [s, dispatch] = useReducer(reducer, { status: 'idle', data: null, error: null });
  const [attempt, setAttempt] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!key) { dispatch({ type: 'reset' }); return undefined; }
    const hit = cache.get(key);
    if (attempt === 0 && ttl && hit && Date.now() - hit.t < ttl) { dispatch({ type: 'ok', data: hit.data }); return undefined; }
    const ctrl = new AbortController();
    dispatch({ type: 'load' });
    fetcherRef.current(ctrl.signal)
      .then((data) => { if (ttl) cache.set(key, { data, t: Date.now() }); dispatch({ type: 'ok', data }); })
      .catch((e) => { if (e.name !== 'AbortError') dispatch({ type: 'err', error: e.message }); });
    return () => ctrl.abort();
  }, [key, attempt, ttl]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...s, loading: s.status === 'loading', retry };
}
