#!/usr/bin/env bash
#
# dev-session.sh — brings up the whole fullstack environment in a single tmux session.
#
#   ┌──────────────────┬──────────────────┐
#   │ BACKEND (node)   │ FRONTEND (vite)  │
#   ├──────────────────┼──────────────────┤
#   │ TESTS (vitest)   │ FREE SHELL       │
#   └──────────────────┴──────────────────┘
#
# Usage:  ./dev-session.sh          -> create (or attach to) the session
#         ./dev-session.sh --kill   -> kill the session
#
set -euo pipefail

SESSION="poc"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v tmux >/dev/null 2>&1; then
  echo "tmux is not installed. Run first:  brew install tmux"
  exit 1
fi

# Shortcut to tear everything down: ./dev-session.sh --kill
if [ "${1:-}" = "--kill" ]; then
  tmux kill-session -t "$SESSION" 2>/dev/null && echo "Session '$SESSION' terminated." || echo "No active session '$SESSION'."
  exit 0
fi

# If the session already exists, just attach (shows off tmux persistence).
if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "Session '$SESSION' already exists — reattaching..."
  exec tmux attach -t "$SESSION"
fi

# First run: install the frontend deps (the backend has none).
if [ ! -d "$ROOT/frontend/node_modules" ]; then
  echo "Installing frontend dependencies (first time only)..."
  (cd "$ROOT/frontend" && npm install)
fi

# --- Build the window with 4 panes ------------------------------------------
# We use pane IDs (%N) instead of numeric indexes: it's the robust way, because
# tmux renumbers indexes as the layout changes.

# Pane 1: BACKEND
tmux new-session -d -s "$SESSION" -n dev -c "$ROOT/backend"
P_BACK=$(tmux display-message -p -t "$SESSION:dev" '#{pane_id}')
tmux send-keys -t "$P_BACK" "npm run dev" C-m

# Pane 2: FRONTEND (split vertically, to the right of the backend)
P_FRONT=$(tmux split-window -h -P -F '#{pane_id}' -t "$P_BACK" -c "$ROOT/frontend")
tmux send-keys -t "$P_FRONT" "npm run dev" C-m

# Pane 3: TESTS (split the backend pane horizontally)
P_TEST=$(tmux split-window -v -P -F '#{pane_id}' -t "$P_BACK" -c "$ROOT/frontend")
tmux send-keys -t "$P_TEST" "npm test" C-m

# Pane 4: FREE SHELL (split the frontend pane horizontally)
P_SHELL=$(tmux split-window -v -P -F '#{pane_id}' -t "$P_FRONT" -c "$ROOT")
tmux send-keys -t "$P_SHELL" "clear; echo '> Free terminal: git, npm, etc.'" C-m

# Make the 4 panes the same size (2x2 grid) and focus the shell.
tmux select-layout -t "$SESSION:dev" tiled
tmux select-pane -t "$P_SHELL"

echo "Frontend: http://localhost:5173   |   Backend: http://localhost:3000"
exec tmux attach -t "$SESSION"
