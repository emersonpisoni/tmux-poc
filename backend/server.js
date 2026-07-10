// Minimal backend using only Node's native http module (zero dependencies).
// It exposes a small API that the Vite frontend consumes. It logs every request
// so that the tmux pane stays "alive" during the presentation.
import { createServer } from 'node:http';

const PORT = process.env.PORT || 3000;
const startedAt = Date.now();

// In-memory "database" just to have something to show.
const tasks = [
  { id: 1, title: 'Install tmux', done: true },
  { id: 2, title: 'Bring up backend + frontend with one command', done: true },
  { id: 3, title: 'Nail the presentation', done: true },
];

function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    // CORS open (useful if the frontend calls directly, without the Vite proxy).
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

const server = createServer((req, res) => {
  const ts = new Date().toLocaleTimeString('en-US');
  console.log(`[${ts}] ${req.method} ${req.url}`);

  if (req.url === '/api/status') {
    const uptime = Math.floor((Date.now() - startedAt) / 1000);
    return json(res, 200, { status: 'ok', uptime, now: new Date().toISOString() });
  }

  if (req.url === '/api/tasks') {
    return json(res, 200, tasks);
  }

  json(res, 404, { error: 'route not found' });
});

server.listen(PORT, () => {
  console.log(`\n  BACKEND up at http://localhost:${PORT}`);
  console.log('  Routes: GET /api/status  |  GET /api/tasks\n');
});

// Heartbeat: shows the process is alive even without requests.
setInterval(() => {
  const uptime = Math.floor((Date.now() - startedAt) / 1000);
  console.log(`  ...backend healthy (uptime ${uptime}s)`);
}, 5000);
