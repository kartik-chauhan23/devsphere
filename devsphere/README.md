# DevSphere

Developer productivity SaaS: public site, user dashboard and role-protected admin panel.
React 18 + Vite · React Router · Firebase Auth + Firestore · GitHub API · AI via a server-side proxy.

## Quick start
```bash
npm install
cp .env.example .env     # fill in Firebase web-app keys (+ ANTHROPIC_API_KEY for the AI page)
npm run dev
```

## Firebase setup
1. Create a project → enable **Authentication** (Email/Password + Google) and **Firestore**.
2. Copy the web-app config into `.env`.
3. Deploy rules & indexes: `npx firebase-tools deploy --only firestore` (uses `firestore.rules`, `firestore.indexes.json`).
4. Register once, then in Firestore set `users/<your-uid>.role` to `"admin"` (first admin is bootstrapped from the console; afterwards admins manage roles in **Admin → Users**).

## AI assistant
`api/ai.js` verifies the caller's Firebase ID token and calls Gemini with the server-only `GEMINI_API_KEY`. For local development, `npm run dev` starts the Express/Vite server in `server/dev.js`, which serves both the frontend and `/api/ai`; set `GEMINI_API_KEY` and `VITE_FIREBASE_API_KEY` in `.env`. On Vercel, `api/ai.js` deploys as a serverless function; add those environment variables in the Vercel project settings. Do not expose or commit `GEMINI_API_KEY`.

## Structure
`src/features/*` (business UI) · `src/services/*` (Firebase/API/AI, no UI) · `src/hooks` (useFetch cache+retry, useCollection realtime pagination, useDebounce) · `src/components` (ui/layout/common) · `src/pages` · `src/context`.

## Performance
Every route is lazy-loaded; the homepage loads only React + router (Firebase is a separate chunk fetched on login/app routes). Firestore reads use `limit()` + server-side `count()`; API calls use a TTL cache and abort on unmount.

## Deploy
`npm run build` → `dist/`. Vercel (`vercel.json`) or Firebase Hosting (`firebase.json`, SPA rewrites included; AI proxy needs Vercel/Functions).

For Netlify, the repository-root `netlify.toml` sets the base directory to `devsphere`, the build command to `npm ci --include=dev && npm run build`, and the publish directory to `dist` (relative to the base directory). The command explicitly installs locked dependencies, including Vite and the React plugin, before building. This also supports CLI deploys that do not install dependencies automatically. The build runs alongside `package.json`, with `devsphere/dist/` published.
