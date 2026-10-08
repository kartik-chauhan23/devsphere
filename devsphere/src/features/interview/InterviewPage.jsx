import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { EmptyState } from '../../components/ui/States';
import { QUESTIONS } from './questions';

const CATS = [...new Set(QUESTIONS.map((q) => q[0]))];

export default function InterviewPage() {
  const { user } = useAuth();
  const [known, setKnown] = useLocalStorage(`ds-interview-${user.uid}`, []);
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const dq = useDebounce(q).toLowerCase();
  const [open, setOpen] = useState(null);

  const list = useMemo(() => QUESTIONS.map((x, i) => ({ i, cat: x[0], q: x[1], a: x[2] }))
    .filter((x) => (!cat || x.cat === cat) && (!dq || x.q.toLowerCase().includes(dq) || x.a.toLowerCase().includes(dq))), [cat, dq]);
  const toggle = (i) => setKnown((k) => (k.includes(i) ? k.filter((x) => x !== i) : [...k, i]));
  const pct = Math.round((known.length / QUESTIONS.length) * 100);

  return (
    <section>
      <h1>Interview preparation</h1>
      <div className="card"><div className="bar"><i style={{ width: `${pct}%` }} /></div><p className="muted">{known.length} of {QUESTIONS.length} mastered ({pct}%)</p></div>
      <div className="row wrap toolbar">
        <input className="input" type="search" placeholder="Search questions…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category"><option value="">All topics</option>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      {!list.length ? <EmptyState title="No questions found" text="Try another search or topic." /> : list.map((x) => (
        <article key={x.i} className="card item">
          <div className="row between"><div><span className="chip">{x.cat}</span><h3>{x.q}</h3></div>
            <label className="row"><input type="checkbox" checked={known.includes(x.i)} onChange={() => toggle(x.i)} /> Mastered</label></div>
          <button className="btn" onClick={() => setOpen(open === x.i ? null : x.i)} aria-expanded={open === x.i}>{open === x.i ? 'Hide answer' : 'Show answer'}</button>
          {open === x.i && <p>{x.a}</p>}
        </article>))}
    </section>
  );
}
