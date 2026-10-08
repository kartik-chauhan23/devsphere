import { request } from './http';

async function gh(path, signal) {
  const r = await request(`https://api.github.com${path}`, { signal, headers: { Accept: 'application/vnd.github+json' } });
  if (r.status === 404) throw new Error('GitHub user not found.');
  if (r.status === 403 || r.status === 429) throw new Error('GitHub rate limit reached. Please try again in a few minutes.');
  if (!r.ok) throw new Error(`GitHub error ${r.status}`);
  return r.data;
}

export async function fetchGithubProfile(username, signal) {
  const u = encodeURIComponent(username);
  const [user, repos] = await Promise.all([gh(`/users/${u}`, signal), gh(`/users/${u}/repos?per_page=100&sort=updated`, signal)]);
  return { user, repos };
}
