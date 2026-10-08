import { Link } from 'react-router-dom';

export default function NotFound() {
  return <div className="center"><div className="card state"><h1>404</h1><p className="muted">This page doesn’t exist.</p><Link className="btn primary" to="/">Back home</Link></div></div>;
}
