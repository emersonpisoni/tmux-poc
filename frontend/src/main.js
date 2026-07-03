import './style.css';
import { formatUptime } from './format.js';

const app = document.querySelector('#app');

function render({ online, uptime, tasks }) {
  app.innerHTML = `
    <h1>POC tmux 🖥️</h1>
    <p class="sub">Frontend Vite conversando com o backend Node — tudo up por 1 comando.</p>
    <div class="status ${online ? 'ok' : 'down'}">
      <span class="dot"></span>
      ${online ? `Backend online · uptime ${formatUptime(uptime)}` : 'Backend offline'}
    </div>
    <ul>
      ${tasks
        .map(
          (t) => `<li>
            <span>${t.done ? '✅' : '⬜'}</span>
            <span class="${t.done ? 'done' : ''}">${t.title}</span>
          </li>`
        )
        .join('')}
    </ul>
  `;
}

async function poll() {
  try {
    const [status, tasks] = await Promise.all([
      fetch('/api/status').then((r) => r.json()),
      fetch('/api/tasks').then((r) => r.json()),
    ]);
    render({ online: true, uptime: status.uptime, tasks });
  } catch {
    render({ online: false, uptime: 0, tasks: [] });
  }
}

poll();
setInterval(poll, 2000);
