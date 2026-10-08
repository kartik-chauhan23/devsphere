import { Suspense, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/firebase/auth';
import ThemeToggle from '../common/ThemeToggle';
import { PageLoader } from '../ui/States';
import { initials } from '../../utils/format';

const USER_LINKS = [
  ['/app', '📊', 'Dashboard', true], ['/app/projects', '📁', 'Projects'], ['/app/tasks', '✅', 'Tasks'],
  ['/app/notes', '📝', 'Notes'], ['/app/resources', '🔖', 'Resources'], ['/app/github', '🐙', 'GitHub'],
  ['/app/api-explorer', '🔌', 'API Explorer'], ['/app/interview', '🎯', 'Interview Prep'],
  ['/app/assistant', '🤖', 'AI Assistant'], ['/app/settings', '⚙️', 'Settings'],
];
const ADMIN_LINKS = [
  ['/admin', '📊', 'Overview', true], ['/admin/users', '👥', 'Users'], ['/admin/content', '🗂️', 'Content'],
  ['/admin/reports', '📈', 'Reports'], ['/admin/logs', '🧾', 'Activity logs'],
  ['/admin/notifications', '🔔', 'Notifications'], ['/admin/settings', '⚙️', 'Settings'],
];

export default function Shell({ admin = false }) {
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const links = admin ? ADMIN_LINKS : USER_LINKS;
  const signOut = async () => { await logout(); navigate('/'); };

  return (
    <div className={`shell ${admin ? 'admin' : ''}`}>
      <aside className={`side ${open ? 'open' : ''}`}>
        <div className="brand">{'</>'} DevSphere{admin && <span className="chip">Admin</span>}</div>
        <nav aria-label="Main">
          {links.map(([to, icon, label, end]) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}>{icon} {label}</NavLink>
          ))}
          {!admin && isAdmin && <NavLink to="/admin" className="adminlink">🛡️ Admin panel</NavLink>}
          {admin && <NavLink to="/app">← Back to app</NavLink>}
        </nav>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main">
        <header className="topbar">
          <button className="btn ghost menu" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">☰</button>
          <span className="spacer" />
          <ThemeToggle />
          <span className="avatar" title={user.email}>{initials(user.displayName || user.email)}</span>
          <button className="btn" onClick={signOut}>Log out</button>
        </header>
        <main className="content"><Suspense fallback={<PageLoader />}><Outlet /></Suspense></main>
      </div>
    </div>
  );
}
