import CrudPage from '../../components/common/CrudPage';

const TAGS = ['snippet', 'bug', 'idea', 'learning', 'other'];
const cfg = {
  name: 'notes', title: 'Notes', label: 'Note', titleKey: 'title',
  filter: { key: 'tag', label: 'tags', options: TAGS },
  fields: [
    { key: 'title', label: 'Title', required: true },
    { key: 'tag', label: 'Tag', type: 'select', options: TAGS, default: 'other' },
    { key: 'content', label: 'Content', type: 'textarea', required: true },
  ],
};
export default function NotesPage() { return <CrudPage cfg={cfg} />; }
