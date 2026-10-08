import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCollection } from '../../hooks/useCollection';
import { useDebounce } from '../../hooks/useDebounce';
import { setUserRole } from '../../services/firebase/db';
import { fmtDate } from '../../utils/format';
import { EmptyState, ErrorState, Skeletons } from '../../components/ui/States';

export default function UsersPage() {
  const { user } = useAuth();
  const toast = useToast();
  const { items, loading, error, hasMore, loadMore, retry } = useCollection('users', { pageSize: 25 });
  const [q, setQ] = useState('');
  const dq = useDebounce(q).toLowerCase();
  const list = useMemo(() => items.filter((u) => !dq || `${u.displayName} ${u.email}`.toLowerCase().includes(dq)), [items, dq]);

  const change = async (u, role) => {
    try { await setUserRole(user, u.uid, role); toast(`${u.email} is now ${role}`); } catch (e) { toast(e.message, 'error'); }
  };
  return (
    <section>
      <h1>Users</h1>
      <div className="toolbar"><input className="input" type="search" placeholder="Search name or email…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search users" /></div>
      {error ? <ErrorState message={error} onRetry={retry} /> : loading && !items.length ? <Skeletons /> : !list.length ? <EmptyState title="No users found" text="Nobody matches this search." /> : (
        <div className="card tablewrap"><table>
          <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Role</th></tr></thead>
          <tbody>{list.map((u) => (
            <tr key={u.uid}><td>{u.displayName}</td><td>{u.email}</td><td>{fmtDate(u.createdAt)}</td>
              <td><select className="input" value={u.role} disabled={u.uid === user.uid} onChange={(e) => change(u, e.target.value)} aria-label={`Role for ${u.email}`}><option>user</option><option>admin</option></select></td></tr>))}
          </tbody></table></div>)}
      {hasMore && !loading && <div className="center-x"><button className="btn" onClick={loadMore}>Load more</button></div>}
    </section>
  );
}
