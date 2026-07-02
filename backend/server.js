// Backend minimo usando apenas o modulo http nativo do Node (zero dependencias).
// Expoe uma pequena API que o frontend Vite consome. Loga cada request para que
// o painel do tmux fique "vivo" durante a apresentacao.
import { createServer } from 'node:http';

const PORT = process.env.PORT || 3000;
const startedAt = Date.now();

// "Banco de dados" em memoria so para ter o que mostrar.
const tasks = [
  { id: 1, title: 'Instalar o tmux', done: true },
  { id: 2, title: 'Subir backend + frontend com 1 comando', done: false },
  { id: 3, title: 'Impressionar na apresentacao', done: false },
];

function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    // CORS liberado (util caso o front chame direto, sem o proxy do Vite).
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

const server = createServer((req, res) => {
  const ts = new Date().toLocaleTimeString('pt-BR');
  console.log(`[${ts}] ${req.method} ${req.url}`);

  if (req.url === '/api/status') {
    const uptime = Math.floor((Date.now() - startedAt) / 1000);
    return json(res, 200, { status: 'ok', uptime, now: new Date().toISOString() });
  }

  if (req.url === '/api/tasks') {
    return json(res, 200, tasks);
  }

  json(res, 404, { error: 'rota nao encontrada' });
});

server.listen(PORT, () => {
  console.log(`\n  BACKEND no ar em http://localhost:${PORT}`);
  console.log('  Rotas: GET /api/status  |  GET /api/tasks\n');
});

// Heartbeat: mostra que o processo esta vivo mesmo sem requests.
setInterval(() => {
  const uptime = Math.floor((Date.now() - startedAt) / 1000);
  console.log(`  ...backend saudavel (uptime ${uptime}s)`);
}, 5000);
