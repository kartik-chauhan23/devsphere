import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getSettings, saveSettings } from '../../services/firebase/db';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [banner, setBanner] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => { getSettings().then((s) => setBanner(s.banner || '')).catch((e) => toast(e.message, 'error')).finally(() => setReady(true)); }, [toast]);

  const save = async (e) => {
    e.preventDefault();
    try { await saveSettings(user, { banner: banner.trim() }); toast('Settings saved'); } catch (err) { toast(err.message, 'error'); }
  };
  return (
    <section>
      <h1>Platform settings</h1>
      <form className="card form" onSubmit={save}>
        <label>Dashboard banner (shown to all users, leave empty to hide)
          <input className="input" value={banner} onChange={(e) => setBanner(e.target.value)} disabled={!ready} maxLength="200" /></label>
        <button className="btn primary" disabled={!ready}>Save</button>
      </form>
    </section>
  );
}
