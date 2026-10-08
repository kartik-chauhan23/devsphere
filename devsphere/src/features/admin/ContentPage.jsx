import { useState } from 'react';
import CrudPage from '../../components/common/CrudPage';
import { cfg as projects } from '../projects/ProjectsPage';
import { cfg as resources } from '../resources/ResourcesPage';

export default function ContentPage() {
  const [tab, setTab] = useState('projects');
  const cfg = { ...(tab === 'projects' ? projects : resources), scope: 'all', title: tab === 'projects' ? 'All projects' : 'All resources' };
  return (
    <>
      <div className="row tabs" role="tablist">
        {['projects', 'resources'].map((t) => <button key={t} role="tab" aria-selected={tab === t} className={`btn ${tab === t ? 'primary' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      <CrudPage key={tab} cfg={cfg} />
    </>
  );
}
