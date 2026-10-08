import CrudPage from '../../components/common/CrudPage';

const CATS = ['docs', 'article', 'video', 'tool', 'course'];
export const cfg = {
  name: 'resources', title: 'Resources', label: 'Resource', titleKey: 'title',
  filter: { key: 'category', label: 'categories', options: CATS },
  fields: [
    { key: 'title', label: 'Title', required: true },
    { key: 'url', label: 'URL', type: 'url', required: true },
    { key: 'category', label: 'Category', type: 'select', options: CATS, default: 'docs' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
};
export default function ResourcesPage() { return <CrudPage cfg={cfg} />; }
