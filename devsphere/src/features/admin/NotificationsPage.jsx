import CrudPage from '../../components/common/CrudPage';

const cfg = {
  name: 'notifications', title: 'Notifications', label: 'Notification', titleKey: 'title', scope: 'all',
  fields: [{ key: 'title', label: 'Title', required: true }, { key: 'message', label: 'Message', type: 'textarea', required: true }],
};
export default function NotificationsPage() { return <CrudPage cfg={cfg} />; }
