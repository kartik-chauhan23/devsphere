import 'dotenv/config';
import { createServer } from 'node:http';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import aiHandler from '../api/ai.js';

const app = express();
const server = createServer(app);
const vite = await createViteServer({
  appType: 'spa',
  server: { middlewareMode: true, hmr: { server } },
});

app.use(express.json({ limit: '100kb' }));
app.all('/api/ai', aiHandler);
app.use(vite.middlewares);

const port = Number(process.env.PORT) || 5173;
server.listen(port, () => {
  console.log(`DevSphere is running at http://localhost:${port}`);
});
