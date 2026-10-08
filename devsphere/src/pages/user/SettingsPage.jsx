import { useState } from 'react';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { resetPassword, setDisplayName } from '../../services/firebase/auth';
import { updateProfileDoc } from '../../services/firebase/db';

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user.displayName || '');
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await setDisplayName(user, name.trim()); await updateProfileDoc(user.uid, { displayName: name.trim() }); toast('Profile updated'); }
    catch (err) { toast(err.message, 'error'); } finally { setSaving(false); }
  };
  const reset = async () => { try { await resetPassword(user.email); toast('Password reset email sent'); } catch (err) { toast(err.message, 'error'); } };

  return (
    <section>
      <h1>Settings</h1>
      <form className="card form" onSubmit={save}>
        <h3>Profile</h3>
        <label>Display name<input className="input" value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Email<input className="input" value={user.email} disabled /></label>
        <p className="muted">Role: <span className="chip">{profile?.role || 'user'}</span></p>
        <button className="btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
      </form>
      <div className="card row between"><div><h3>Appearance</h3><p className="muted">Switch between dark and light mode.</p></div><ThemeToggle /></div>
      <div className="card row between"><div><h3>Password</h3><p className="muted">We’ll email you a reset link.</p></div><button className="btn" onClick={reset}>Send reset email</button></div>
    </section>
  );
}
