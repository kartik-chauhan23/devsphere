import { useCollection } from '../../hooks/useCollection';
import { fmtDateTime } from '../../utils/format';
import { EmptyState, ErrorState, Skeletons } from '../../components/ui/States';

export default function LogsPage() {
  const { items, loading, error, hasMore, loadMore, retry } = useCollection('logs', { pageSize: 30 });
  return (
    <section>
      <h1>Activity logs</h1>
      {error ? <ErrorState message={error} onRetry={retry} /> : loading && !items.length ? <Skeletons /> : !items.length ? <EmptyState title="No activity yet" text="Actions performed by users will appear here." /> : (
        <div className="card tablewrap"><table><thead><tr><th>When</th><th>User</th><th>Action</th></tr></thead>
          <tbody>{items.map((l) => <tr key={l.id}><td>{fmtDateTime(l.createdAt)}</td><td>{l.email}</td><td><code>{l.action}</code></td></tr>)}</tbody></table></div>)}
      {hasMore && !loading && <div className="center-x"><button className="btn" onClick={loadMore}>Load more</button></div>}
    </section>
  );
}
