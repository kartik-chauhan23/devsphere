import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { request } from '../../services/api/http';
import { ErrorState } from '../../components/ui/States';

const PRESETS = [
  ['GitHub Zen', 'GET', 'https://api.github.com/zen'],
  ['JSONPlaceholder posts', 'GET', 'https://jsonplaceholder.typicode.com/posts?_limit=3'],
  ['Public holidays (US)', 'GET', 'https://date.nager.at/api/v3/PublicHolidays/2026/US'],
];

export default function ApiExplorerPage() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState(PRESETS[1][2]);
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [req, setReq] = useState(null);
  const [formError, setFormError] = useState('');

  const res = useFetch(req && `api:${req.id}`, (signal) => request(req.url, { ...req.opts, signal }), { ttl: 0 });

  const send = (e) => {
    e.preventDefault();
    setFormError('');
    let parsed = {};
    try { parsed = headers.trim() ? JSON.parse(headers) : {}; } catch { setFormError('Headers must be valid JSON, e.g. {"Accept":"application/json"}'); return; }
    try { new URL(url); } catch { setFormError('Enter a valid absolute URL (https://…).'); return; }
    setReq({ id: Date.now(), url, opts: { method, headers: parsed, body: method === 'GET' || !body ? undefined : body } });
  };
  const r = res.data;

  return (
    <section>
      <h1>REST API Explorer</h1>
      <div className="row wrap">{PRESETS.map(([n, m, u]) => <button key={n} className="chip btnchip" onClick={() => { setMethod(m); setUrl(u); }}>{n}</button>)}</div>
      <form className="form card" onSubmit={send}>
        <div className="row">
          <select className="input short" value={method} onChange={(e) => setMethod(e.target.value)} aria-label="Method">{['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => <option key={m}>{m}</option>)}</select>
          <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/items" aria-label="URL" required />
          <button className="btn primary" disabled={res.loading}>{res.loading ? 'Sending…' : 'Send'}</button>
        </div>
        <label>Headers (JSON)<textarea className="input mono" rows="2" value={headers} onChange={(e) => setHeaders(e.target.value)} /></label>
        {method !== 'GET' && <label>Body<textarea className="input mono" rows="4" value={body} onChange={(e) => setBody(e.target.value)} /></label>}
        {formError && <p className="err" role="alert">{formError}</p>}
      </form>
      {res.error ? <ErrorState message={res.error} onRetry={res.retry} /> : r ? (
        <div className="card">
          <div className="row gap"><span className={`chip ${r.ok ? 'ok' : 'bad'}`}>{r.status}</span><span className="chip">{r.time} ms</span></div>
          <pre className="code">{typeof r.data === 'string' ? r.data : JSON.stringify(r.data, null, 2)}</pre>
        </div>
      ) : !res.loading && <p className="muted">Send a request to see the response here.</p>}
    </section>
  );
}
