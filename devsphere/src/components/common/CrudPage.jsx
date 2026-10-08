import { memo, useCallback, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCollection } from '../../hooks/useCollection';
import { useDebounce } from '../../hooks/useDebounce';
import { crud } from '../../services/firebase/db';
import { fmtDate } from '../../utils/format';
import Modal from '../ui/Modal';
import { EmptyState, ErrorState, Skeletons } from '../ui/States';

const Item = memo(function Item({ cfg, item, onEdit, onDelete }) {
  return (
    <article className="card item">
      <div className="row between"><h3>{item[cfg.titleKey]}</h3>
        <span className="row">
          <button className="btn ghost" onClick={() => onEdit(item)} aria-label="Edit">✏️</button>
          <button className="btn ghost" onClick={() => onDelete(item)} aria-label="Delete">🗑️</button>
        </span>
      </div>
      <div className="row wrap">
        {cfg.fields.filter((f) => f.type === 'select' && item[f.key]).map((f) => <span key={f.key} className={`chip ${f.key}-${item[f.key]}`}>{item[f.key]}</span>)}
        {cfg.fields.filter((f) => f.type === 'date' && item[f.key]).map((f) => <span key={f.key} className="chip">📅 {fmtDate(item[f.key])}</span>)}
      </div>
      {cfg.fields.filter((f) => f.type === 'textarea' && item[f.key]).map((f) => <p key={f.key} className="muted clamp">{item[f.key]}</p>)}
      {cfg.fields.filter((f) => f.type === 'url' && item[f.key]).map((f) => (
        <a key={f.key} href={item[f.key]} target="_blank" rel="noopener noreferrer" className="link">{item[f.key]}</a>
      ))}
    </article>
  );
});

function FormModal({ cfg, initial, saving, onSave, onClose }) {
  const [form, setForm] = useState(() => Object.fromEntries(cfg.fields.map((f) => [f.key, initial[f.key] ?? f.default ?? ''])));
  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
  return (
    <Modal title={`${initial.id ? 'Edit' : 'New'} ${cfg.label}`} onClose={onClose}>
      <form className="form" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        {cfg.fields.map((f, i) => (
          <label key={f.key}>{f.label}
            {f.type === 'textarea' ? <textarea className="input" rows="4" value={form[f.key]} onChange={set(f.key)} required={f.required} autoFocus={i === 0} />
              : f.type === 'select' ? <select className="input" value={form[f.key]} onChange={set(f.key)}>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
              : <input className="input" type={f.type || 'text'} value={form[f.key]} onChange={set(f.key)} required={f.required} autoFocus={i === 0} />}
          </label>
        ))}
        <button className="btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </form>
    </Modal>
  );
}

/** Config-driven CRUD screen shared by projects, tasks, notes, resources and admin notifications. */
export default function CrudPage({ cfg }) {
  const { user } = useAuth();
  const toast = useToast();
  const { items, loading, error, hasMore, loadMore, retry } = useCollection(cfg.name, { ownerId: cfg.scope === 'all' ? null : user.uid });
  const api = useMemo(() => crud(cfg.name), [cfg.name]);
  const [q, setQ] = useState('');
  const dq = useDebounce(q).trim().toLowerCase();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const visible = useMemo(() => {
    let list = items.filter((i) => (!filter || i[cfg.filter.key] === filter)
      && (!dq || cfg.fields.some((f) => String(i[f.key] ?? '').toLowerCase().includes(dq))));
    if (sort === 'oldest') list = [...list].reverse();
    if (sort === 'az') list = [...list].sort((a, b) => String(a[cfg.titleKey]).localeCompare(String(b[cfg.titleKey])));
    if (sort === 'due') list = [...list].sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
    return list;
  }, [items, dq, filter, sort, cfg]);

  const onEdit = useCallback((i) => setEditing(i), []);
  const onDelete = useCallback(async (i) => {
    if (!window.confirm(`Delete "${i[cfg.titleKey]}"?`)) return;
    try { await api.remove(user, i.id); toast('Deleted'); } catch (e) { toast(e.message, 'error'); }
  }, [api, cfg.titleKey, toast, user]);
  const close = useCallback(() => setEditing(null), []);
  const onSave = async (form) => {
    setSaving(true);
    try {
      const data = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
      if (editing.id) await api.update(user, editing.id, data); else await api.create(user, data);
      toast('Saved'); setEditing(null);
    } catch (e) { toast(e.message, 'error'); } finally { setSaving(false); }
  };
  const addBtn = <button className="btn primary" onClick={() => setEditing({})}>+ New {cfg.label}</button>;

  return (
    <section>
      <div className="row between wrap"><h1>{cfg.title}</h1>{addBtn}</div>
      <div className="row wrap toolbar">
        <input className="input" type="search" placeholder={`Search ${cfg.title.toLowerCase()}…`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        {cfg.filter && <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter">
          <option value="">All {cfg.filter.label}</option>{cfg.filter.options.map((o) => <option key={o}>{o}</option>)}</select>}
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="newest">Newest</option><option value="oldest">Oldest</option><option value="az">A → Z</option>
          {cfg.fields.some((f) => f.key === 'dueDate') && <option value="due">Due date</option>}
        </select>
      </div>
      {error ? <ErrorState message={error} onRetry={retry} />
        : loading && !items.length ? <Skeletons />
        : !visible.length ? <EmptyState title={items.length ? 'No matches' : `No ${cfg.title.toLowerCase()} yet`} text={items.length ? 'Try a different search or filter.' : `Create your first ${cfg.label.toLowerCase()} to get started.`} action={!items.length && addBtn} />
        : <div className="grid">{visible.map((i) => <Item key={i.id} cfg={cfg} item={i} onEdit={onEdit} onDelete={onDelete} />)}</div>}
      {hasMore && !loading && <div className="center-x"><button className="btn" onClick={loadMore}>Load more</button></div>}
      {editing && <FormModal cfg={cfg} initial={editing} saving={saving} onSave={onSave} onClose={close} />}
    </section>
  );
}
