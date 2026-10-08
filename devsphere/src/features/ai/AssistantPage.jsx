import { useEffect, useRef, useState } from 'react';
import { askAssistant } from '../../services/ai/aiService';

const SUGGESTIONS = ['Explain useReducer vs useState', 'Review my Firestore data model idea', 'How do I debounce an input in React?'];

export default function AssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy]);

  const send = async (text, history = messages) => {
    if (!text.trim() || busy) return;
    const next = [...history, { role: 'user', content: text.trim() }];
    setMessages(next); setInput(''); setError(''); setBusy(true);
    try {
      const reply = await askAssistant(next);
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <section className="chat">
      <h1>AI Developer Assistant</h1>
      <div className="card messages" aria-live="polite">
        {!messages.length && <div><p className="muted">Ask anything about code, architecture or debugging.</p><div className="row wrap">{SUGGESTIONS.map((s) => <button key={s} className="chip btnchip" onClick={() => send(s)}>{s}</button>)}</div></div>}
        {messages.map((m, i) => <div key={i} className={`msg ${m.role}`}><pre>{m.content}</pre></div>)}
        {busy && <div className="msg assistant"><span className="spinner small" /> Thinking…</div>}
        {error && <div className="err" role="alert">{error} <button className="btn" onClick={() => send(messages[messages.length - 1].content, messages.slice(0, -1))}>Retry</button></div>}
        <div ref={endRef} />
      </div>
      <form className="row" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the assistant…" aria-label="Message" />
        <button className="btn primary" disabled={busy}>Send</button>
      </form>
    </section>
  );
}
