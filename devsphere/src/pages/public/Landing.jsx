import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/common/ThemeToggle';

const FEATURES = [
  ['📁', 'Projects & tasks', 'Track projects, priorities, statuses and due dates in realtime.'],
  ['📝', 'Notes & resources', 'Keep snippets, learnings and bookmarks searchable and organised.'],
  ['🐙', 'GitHub insights', 'Look up any profile and browse top repositories instantly.'],
  ['🔌', 'API Explorer', 'Send REST requests, inspect status, timing and JSON responses.'],
  ['🎯', 'Interview prep', 'Practice core React, JS and web questions and track mastery.'],
  ['🤖', 'AI assistant', 'Ask coding questions through a secure server-side AI proxy.'],
];
const STEPS = [['Sign up', 'Create a free account with email or Google.'], ['Organise', 'Add projects, tasks, notes and resources.'], ['Ship faster', 'Use GitHub, API and AI tools without leaving your workspace.']];
const FAQ = [
  ['Is my data private?', 'Yes. Every record belongs to your account and Firestore Security Rules block anyone else from reading it.'],
  ['Is DevSphere free?', 'You can run it on the Firebase free tier. Costs only appear if you enable the AI assistant.'],
  ['How is the AI key protected?', 'It lives only on the server. The browser talks to a signed-in-only API endpoint, never to the AI provider directly.'],
  ['Who can see the admin area?', 'Only accounts with the admin role, verified by Security Rules — not just hidden in the UI.'],
];

export default function Landing() {
  return (
    <>
      <header className="nav">
        <span className="brand">{'</>'} DevSphere</span>
        <nav className="row" aria-label="Site">
          <a href="#features" className="hide-sm">Features</a><a href="#faq" className="hide-sm">FAQ</a>
          <ThemeToggle /><Link className="btn" to="/login">Log in</Link><Link className="btn primary" to="/register">Get started</Link>
        </nav>
      </header>
      <main>
        <section className="hero fade">
          <span className="chip">Built for developers</span>
          <h1>One workspace for everything you build.</h1>
          <p className="lead">Projects, tasks, notes, GitHub, API testing, interview prep and an AI assistant — fast, private and free to start.</p>
          <div className="row center-x"><Link className="btn primary lg" to="/register">Create free account</Link><a className="btn lg" href="#features">See features</a></div>
        </section>
        <section id="features" className="wrap-sec"><h2>Everything in one place</h2>
          <div className="grid">{FEATURES.map(([i, t, d]) => <div key={t} className="card"><span className="big">{i}</span><h3>{t}</h3><p className="muted">{d}</p></div>)}</div></section>
        <section className="wrap-sec"><h2>How it works</h2>
          <div className="grid">{STEPS.map(([t, d], i) => <div key={t} className="card"><span className="step">{i + 1}</span><h3>{t}</h3><p className="muted">{d}</p></div>)}</div></section>
        <section className="wrap-sec cta card"><h2>Ready to focus on code?</h2><p className="muted">Join DevSphere and set up your workspace in a minute.</p><Link className="btn primary lg" to="/register">Get started free</Link></section>
        <section id="faq" className="wrap-sec narrow"><h2>FAQ</h2>
          {FAQ.map(([q, a]) => <details key={q} className="card"><summary>{q}</summary><p className="muted">{a}</p></details>)}</section>
      </main>
      <footer className="footer"><span>© {new Date().getFullYear()} DevSphere</span><span className="row"><Link to="/login">Log in</Link><Link to="/register">Register</Link></span></footer>
    </>
  );
}
