import { useCallback, useEffect, useState } from 'react';
import { watch } from '../services/firebase/db';

/** Realtime paginated collection. ownerId=null reads all docs (admin only — enforced by Security Rules). */
export function useCollection(name, { ownerId = null, pageSize = 20 } = {}) {
  const [state, setState] = useState({ items: [], loading: true, error: null });
  const [max, setMax] = useState(pageSize);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    return watch(name, { ownerId, max },
      (items) => setState({ items, loading: false, error: null }),
      (error) => setState({ items: [], loading: false, error }));
  }, [name, ownerId, max, tick]);

  const loadMore = useCallback(() => setMax((m) => m + pageSize), [pageSize]);
  const retry = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, hasMore: state.items.length >= max, loadMore, retry };
}
