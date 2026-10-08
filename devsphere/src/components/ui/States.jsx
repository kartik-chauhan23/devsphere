export function Skeletons({ n = 3 }) {
  return <div className="grid" aria-busy="true" aria-label="Loading">{Array.from({ length: n }, (_, i) => <div key={i} className="card skeleton" />)}</div>;
}
export const PageLoader = () => <div className="center" aria-busy="true"><div className="spinner" role="status" aria-label="Loading" /></div>;
export const EmptyState = ({ title, text, action }) => (
  <div className="card state"><h3>{title}</h3><p className="muted">{text}</p>{action}</div>
);
export const ErrorState = ({ message, onRetry }) => (
  <div className="card state" role="alert"><h3>Something went wrong</h3><p className="muted">{message}</p>{onRetry && <button className="btn" onClick={onRetry}>Try again</button>}</div>
);
