import { useFetch } from '../../hooks/useFetch';
import { count } from '../../services/firebase/db';
import { ErrorState, PageLoader } from '../../components/ui/States';

const GROUPS = [
  ['Users by role', 'users', 'role', ['user', 'admin']],
  ['Tasks by status', 'tasks', 'status', ['todo', 'in-progress', 'done']],
  ['Tasks by priority', 'tasks', 'priority', ['low', 'medium', 'high']],
  ['Projects by status', 'projects', 'status', ['Planning', 'Active', 'On hold', 'Completed']],
];

export default function ReportsPage() {
  const { data, error, retry } = useFetch('admin:reports', () => Promise.all(GROUPS.map(([, col, field, vals]) =>
    Promise.all(vals.map((v) => count(col, [[field, '==', v]]))))), { ttl: 30000 });
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!data) return <PageLoader />;
  return (
    <section>
      <h1>Reports</h1>
      <div className="grid two">{GROUPS.map(([title, , , vals], gi) => {
        const max = Math.max(1, ...data[gi]);
        return (
          <div key={title} className="card"><h3>{title}</h3>
            {vals.map((v, i) => (
              <div key={v} className="metric"><span>{v}</span><div className="bar"><i style={{ width: `${(data[gi][i] / max) * 100}%` }} /></div><b>{data[gi][i]}</b></div>))}
          </div>);
      })}</div>
    </section>
  );
}
