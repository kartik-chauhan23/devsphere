import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useFetch } from '../../hooks/useFetch';
import { count, getSettings } from '../../services/firebase/db';
import { ErrorState } from '../../components/ui/States';
import { fmtDate } from '../../utils/format';

const CARDS = [['projects', '📁', 'Projects'], ['tasks', '✅', 'Tasks'], ['notes', '📝', 'Notes'], ['resources', '🔖', 'Resources']];

export default function DashboardPage() {
  const { user } = useAuth();
  const owner = [['ownerId', '==', user.uid]];
  const stats = useFetch(`counts:${user.uid}`, async () => {
    const [projects, tasks, notes, resources, done] = await Promise.all([
      ...CARDS.map(([n]) => count(n, owner)), count('tasks', [...owner, ['status', '==', 'done']]),
    ]);
    return { projects, tasks, notes, resources, done };
  }, { ttl: 15000 });
  const settings = useFetch('settings', getSettings, { ttl: 60000 });
  const news = useCollection('notifications', { pageSize: 3 });
  const s = stats.data;
  const pct = s?.tasks ? Math.round((s.done / s.tasks) * 100) : 0;

  return (
    <section>
      <h1>Welcome back, {user.displayName?.split(' ')[0] || 'developer'} 👋</h1>
      {settings.data?.banner && <div className="banner">📣 {settings.data.banner}</div>}
      {stats.error ? <ErrorState message={stats.error} onRetry={stats.retry} /> : (
        <div className="grid stats">
          {CARDS.map(([k, icon, label]) => (
            <Link key={k} to={`/app/${k}`} className="card stat">
              <span>{icon}</span><strong>{s ? s[k] : '…'}</strong><small className="muted">{label}</small>
            </Link>
          ))}
        </div>
      )}
      <div className="grid two">
        <div className="card">
          <h3>Task completion</h3>
          <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"><i style={{ width: `${pct}%` }} /></div>
          <p className="muted">{s ? `${s.done} of ${s.tasks} tasks done (${pct}%)` : 'Loading…'}</p>
        </div>
        <div className="card">
          <h3>Announcements</h3>
          {news.error ? <p className="muted">{news.error}</p> : !news.items.length ? <p className="muted">{news.loading ? 'Loading…' : 'No announcements yet.'}</p>
            : news.items.map((n) => <p key={n.id}><strong>{n.title}</strong> <small className="muted">{fmtDate(n.createdAt)}</small><br />{n.message}</p>)}
        </div>
      </div>
    </section>
  );
}
