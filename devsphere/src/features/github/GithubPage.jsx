import { useMemo, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useFetch } from '../../hooks/useFetch';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { fetchGithubProfile } from '../../services/api/github';
import { EmptyState, ErrorState, Skeletons } from '../../components/ui/States';

const PAGE = 6;

export default function GithubPage() {
  const [username, setUsername] = useLocalStorage('ds-gh-user', '');
  const [input, setInput] = useState(username);
  const [q, setQ] = useState('');
  const dq = useDebounce(q).toLowerCase();
  const [shown, setShown] = useState(PAGE);
  const { data, loading, error, retry } = useFetch(username ? `gh:${username}` : null, (signal) => fetchGithubProfile(username, signal), { ttl: 300000 });

  const repos = useMemo(() => (data?.repos || [])
    .filter((r) => !dq || r.name.toLowerCase().includes(dq) || (r.description || '').toLowerCase().includes(dq))
    .sort((a, b) => b.stargazers_count - a.stargazers_count), [data, dq]);

  const submit = (e) => { e.preventDefault(); setShown(PAGE); setUsername(input.trim()); };

  return (
    <section>
      <h1>GitHub</h1>
      <form className="row toolbar" onSubmit={submit}>
        <input className="input" placeholder="GitHub username, e.g. torvalds" value={input} onChange={(e) => setInput(e.target.value)} aria-label="GitHub username" required />
        <button className="btn primary">Look up</button>
      </form>
      {!username ? <EmptyState title="Explore any GitHub profile" text="Enter a username to see their profile and top repositories." />
        : error ? <ErrorState message={error} onRetry={retry} />
        : loading || !data ? <Skeletons n={3} />
        : (
          <>
            <div className="card row gap">
              <img src={data.user.avatar_url} alt="" width="72" height="72" loading="lazy" className="avatar big" />
              <div><h2>{data.user.name || data.user.login}</h2><p className="muted">{data.user.bio || 'No bio'}</p>
                <p><span className="chip">{data.user.public_repos} repos</span> <span className="chip">{data.user.followers} followers</span> <a className="link" href={data.user.html_url} target="_blank" rel="noopener noreferrer">Open on GitHub ↗</a></p></div>
            </div>
            <div className="toolbar"><input className="input" type="search" placeholder="Filter repositories…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter repositories" /></div>
            {!repos.length ? <EmptyState title="No repositories" text="Nothing matches this filter." /> : (
              <div className="grid">{repos.slice(0, shown).map((r) => (
                <a key={r.id} className="card item" href={r.html_url} target="_blank" rel="noopener noreferrer">
                  <h3>{r.name}</h3><p className="muted clamp">{r.description || 'No description'}</p>
                  <div className="row wrap"><span className="chip">⭐ {r.stargazers_count}</span><span className="chip">🍴 {r.forks_count}</span>{r.language && <span className="chip">{r.language}</span>}</div>
                </a>))}</div>)}
            {shown < repos.length && <div className="center-x"><button className="btn" onClick={() => setShown((n) => n + PAGE)}>Show more</button></div>}
          </>
        )}
    </section>
  );
}
