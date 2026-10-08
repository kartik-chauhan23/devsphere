import { auth } from '../firebase/config';
import { request } from '../api/http';

const ENDPOINT = import.meta.env.VITE_AI_ENDPOINT || '/api/ai';

/** Sends the chat to the server-side proxy; the AI key never reaches the browser. */
export async function askAssistant(messages) {
  const token = await auth.currentUser.getIdToken();
  const r = await request(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ messages }),
  });
  if (!r.ok) throw new Error(r.data?.error || (r.status === 404 ? 'AI endpoint not found. Use `npm run dev` or deploy /api/ai.' : `AI error ${r.status}`));
  return r.data.reply;
}
