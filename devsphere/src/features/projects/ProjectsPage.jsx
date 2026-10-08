import CrudPage from '../../components/common/CrudPage';

const STATUS = ['Planning', 'Active', 'On hold', 'Completed'];
export const cfg = {
  name: 'projects', title: 'Projects', label: 'Project', titleKey: 'name',
  filter: { key: 'status', label: 'statuses', options: STATUS },
  fields: [
    { key: 'name', label: 'Name', required: true },
    { key: 'status', label: 'Status', type: 'select', options: STATUS, default: 'Planning' },
    { key: 'repoUrl', label: 'Repository URL', type: 'url' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ],
};
export default function ProjectsPage() { return <CrudPage cfg={cfg} />; }
