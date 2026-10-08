/** Minimal fetch wrapper: timing, JSON parsing, uniform errors. */
export async function request(url, { method = 'GET', headers, body, signal } = {}) {
  const start = performance.now();
  let res;
  try {
    res = await fetch(url, { method, headers, body, signal });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new Error('Request failed — network error or the server blocks cross-origin (CORS) requests.');
  }
  const text = await res.text();
  let data = text;
  try { data = JSON.parse(text); } catch { /* plain-text response */ }
  return { status: res.status, ok: res.ok, time: Math.round(performance.now() - start), data, headers: Object.fromEntries(res.headers) };
}
