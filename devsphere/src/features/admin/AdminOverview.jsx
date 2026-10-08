import { useFetch } from '../../hooks/useFetch';
import { count } from '../../services/firebase/db';
import { ErrorState } from '../../components/ui/States';

const KEYS = [['users', '👥'], ['projects', '📁'], ['tasks', '✅'], ['notes', '📝'], ['resources', '🔖'], ['logs', '🧾']];

export default function AdminOverview() {
  const { data, error, retry } = useFetch('admin:totals', async () => Object.fromEntries(await Promise.all(KEYS.map(async ([k]) => [k, await count(k)]))), { ttl: 15000 });
  return (
    <section>
      <h1>Admin overview</h1>
      {error ? <ErrorState message={error} onRetry={retry} /> : (
        <div className="grid stats">{KEYS.map(([k, icon]) => (
          <div key={k} className="card stat"><span>{icon}</span><strong>{data ? data[k] : '…'}</strong><small className="muted">Total {k}</small></div>))}</div>)}
    </section>
  );
}
