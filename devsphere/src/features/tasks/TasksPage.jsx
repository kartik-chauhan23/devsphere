import CrudPage from '../../components/common/CrudPage';

const STATUS = ['todo', 'in-progress', 'done'];
const cfg = {
  name: 'tasks', title: 'Tasks', label: 'Task', titleKey: 'title',
  filter: { key: 'status', label: 'statuses', options: STATUS },
  fields: [
    { key: 'title', label: 'Title', required: true },
    { key: 'status', label: 'Status', type: 'select', options: STATUS, default: 'todo' },
    { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high'], default: 'medium' },
    { key: 'dueDate', label: 'Due date', type: 'date' },
    { key: 'description', label: 'Details', type: 'textarea' },
  ],
};
export default function TasksPage() { return <CrudPage cfg={cfg} />; }
