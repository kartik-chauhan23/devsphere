import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login, loginWithGoogle, register, resetPassword } from '../../services/firebase/auth';
import { authMessage } from '../../utils/format';
import ThemeToggle from '../../components/common/ThemeToggle';
import { PageLoader } from '../../components/ui/States';

export default function AuthPage({ mode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const isRegister = mode === 'register';
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (loading) return <PageLoader />;
  if (user) return <Navigate to={location.state?.from?.pathname || '/app'} replace />;

  const run = async (fn) => {
    setBusy(true); setError(''); setInfo('');
    try { await fn(); } catch (e) { setError(authMessage(e)); } finally { setBusy(false); }
  };
  const submit = (e) => { e.preventDefault(); run(() => (isRegister ? register(form.name.trim(), form.email, form.password) : login(form.email, form.password))); };
  const forgot = () => (!form.email ? setError('Enter your email first.') : run(async () => { await resetPassword(form.email); setInfo('Reset link sent — check your inbox.'); }));

  return (
    <div className="center authwrap">
      <div className="card authcard">
        <div className="row between"><Link to="/" className="brand">{'</>'} DevSphere</Link><ThemeToggle /></div>
        <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
        <button className="btn" onClick={() => run(loginWithGoogle)} disabled={busy}>Continue with Google</button>
        <p className="muted center-x">or</p>
        <form className="form" onSubmit={submit}>
          {isRegister && <label>Name<input className="input" value={form.name} onChange={set('name')} autoComplete="name" required /></label>}
          <label>Email<input className="input" type="email" value={form.email} onChange={set('email')} autoComplete="email" required /></label>
          <label>Password<input className="input" type="password" value={form.password} onChange={set('password')} minLength="6" autoComplete={isRegister ? 'new-password' : 'current-password'} required /></label>
          {error && <p className="err" role="alert">{error}</p>}
          {info && <p className="ok" role="status">{info}</p>}
          <button className="btn primary" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Sign up' : 'Log in'}</button>
        </form>
        {!isRegister && <button className="btn ghost" onClick={forgot}>Forgot password?</button>}
        <p className="muted">{isRegister ? 'Have an account?' : 'New here?'} <Link className="link" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</Link></p>
      </div>
    </div>
  );
}
