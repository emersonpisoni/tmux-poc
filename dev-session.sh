#!/usr/bin/env bash
#
# dev-session.sh — sobe o ambiente fullstack inteiro numa unica sessao tmux.
#
#   ┌──────────────────┬──────────────────┐
#   │ BACKEND (node)   │ FRONTEND (vite)  │
#   ├──────────────────┼──────────────────┤
#   │ TESTES (vitest)  │ SHELL LIVRE      │
#   └──────────────────┴──────────────────┘
#
# Uso:  ./dev-session.sh          -> cria (ou anexa) a sessao
#       ./dev-session.sh --kill   -> mata a sessao
#
set -euo pipefail

SESSION="poc"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v tmux >/dev/null 2>&1; then
  echo "tmux nao esta instalado. Rode primeiro:  brew install tmux"
  exit 1
fi

# Atalho para derrubar tudo: ./dev-session.sh --kill
if [ "${1:-}" = "--kill" ]; then
  tmux kill-session -t "$SESSION" 2>/dev/null && echo "Sessao '$SESSION' encerrada." || echo "Nenhuma sessao '$SESSION' ativa."
  exit 0
fi

# Se a sessao ja existe, apenas anexa (mostra a persistencia do tmux).
if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "Sessao '$SESSION' ja existe — reanexando..."
  exec tmux attach -t "$SESSION"
fi

# Primeira execucao: instala as deps do frontend (o backend nao tem nenhuma).
if [ ! -d "$ROOT/frontend/node_modules" ]; then
  echo "Instalando dependencias do frontend (so na primeira vez)..."
  (cd "$ROOT/frontend" && npm install)
fi

# --- Monta a janela com 4 paineis -------------------------------------------
# Usamos os IDs dos paineis (%N) em vez de indices numericos: e' a forma robusta,
# porque o tmux renumera indices conforme o layout muda.

# Painel 1: BACKEND
tmux new-session -d -s "$SESSION" -n dev -c "$ROOT/backend"
P_BACK=$(tmux display-message -p -t "$SESSION:dev" '#{pane_id}')
tmux send-keys -t "$P_BACK" "npm run dev" C-m

# Painel 2: FRONTEND (divide a tela na vertical, a direita do backend)
P_FRONT=$(tmux split-window -h -P -F '#{pane_id}' -t "$P_BACK" -c "$ROOT/frontend")
tmux send-keys -t "$P_FRONT" "npm run dev" C-m

# Painel 3: TESTES (divide o painel do backend na horizontal)
P_TEST=$(tmux split-window -v -P -F '#{pane_id}' -t "$P_BACK" -c "$ROOT/frontend")
tmux send-keys -t "$P_TEST" "npm test" C-m

# Painel 4: SHELL LIVRE (divide o painel do frontend na horizontal)
P_SHELL=$(tmux split-window -v -P -F '#{pane_id}' -t "$P_FRONT" -c "$ROOT")
tmux send-keys -t "$P_SHELL" "clear; echo '> Terminal livre: git, npm, etc.'" C-m

# Deixa os 4 paineis do mesmo tamanho (grade 2x2) e foca no shell.
tmux select-layout -t "$SESSION:dev" tiled
tmux select-pane -t "$P_SHELL"

echo "Frontend: http://localhost:5173   |   Backend: http://localhost:3000"
exec tmux attach -t "$SESSION"
