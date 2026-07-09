# tmux POC — Fullstack (Node + Vite) with a single command

A proof of concept to validate one scenario: **spin up a whole dev environment —
backend, frontend and tests — inside a single tmux session, with one command**,
and show off persistence (close the terminal without killing the processes).

```
┌──────────────────────┬──────────────────────┐
│  BACKEND (node)      │  FRONTEND (vite)     │
│  npm run dev         │  npm run dev         │
│  → http://:3000      │  → http://:5173      │
├──────────────────────┼──────────────────────┤
│  TESTS (vitest)      │  FREE SHELL          │
│  npm test            │  git, npm, etc.      │
└──────────────────────┴──────────────────────┘
        all of this = ./dev-session.sh
```

## What's in here

| Folder / file | What it is |
|---------------|------------|
| `backend/` | Node server using only the native `http` module (zero dependencies). API at `/api/status` and `/api/tasks`. |
| `frontend/` | Vite app (vanilla JS) that consumes the backend through a proxy and shows its status. Ships with a Vitest test. |
| `dev-session.sh` | The star of the show: builds the tmux session with the 4 panes. |
| `cheatsheet.md` | Keyboard-shortcut cheat sheet to use during the presentation. |

## Prerequisites

```bash
brew install tmux    # you already have node/npm
```

## How to run

```bash
./dev-session.sh
```

The first time it installs the frontend dependencies automatically. Then it opens
the tmux session with everything running. Open **http://localhost:5173** in the
browser — the frontend shows the backend online and refreshes the uptime every 2s.

To tear everything down: `./dev-session.sh --kill`

---

## What is tmux and how it works under the hood

**tmux = terminal multiplexer.** To "multiplex" means making **many streams travel
through a single channel** — tmux takes *one* terminal (your window) and lets many
independent terminals run inside it, like a cable that carries hundreds of TV
channels over a single wire.

### The key idea: client–server architecture

This is what explains all the "magic":

```
        YOUR TERMINAL                    BACKGROUND PROCESS
   ┌────────────────────┐            ┌──────────────────────────┐
   │   tmux (client)    │◄──socket──►│    tmux (server)         │
   │  only draws the    │            │  ┌────────────────────┐  │
   │  screen & sends    │            │  │ session "poc"      │  │
   │  keystrokes        │            │  │  ├ pane: node ●    │  │
   └────────────────────┘            │  │  ├ pane: vite ●    │  │
                                     │  │  └ pane: vitest ●  │  │
                                     │  └────────────────────┘  │
                                     └──────────────────────────┘
```

When you run `tmux`, two things actually happen:

1. **The server** — a process running in the background (a daemon). It is what
   *actually holds* your sessions, windows, panes and every program (your backend,
   Vite...). It has no screen.
2. **The client** — the `tmux` you see in your terminal. It *runs nothing*; it only
   does two things: draw on screen whatever the server sends, and forward your
   keystrokes to the server.

The two talk over a **Unix socket** (a special file under `/tmp/tmux-<your-id>/`).

### Why *detach* works (the "wow" moment)

When you hit `Ctrl+b d` (detach) you only **shut down the client**. The server and
every process keep running, because they **never depended on your terminal** — they
are children of the server, not of your window. You can close the terminal, drop
the SSH connection, and nothing dies. Later `tmux attach` reconnects a new client
to the same server and you see everything exactly as you left it.

### How each pane becomes a real terminal: PTYs

Every pane needs to behave like a real terminal (colors, resizing, Ctrl+C, etc.).
For that the server uses **pseudo-terminals (PTYs)** — a feature of the operating
system itself. A PTY is a "fake terminal" in a pair with two ends:

- **slave end:** where the program (`node server.js`) runs, thinking it is attached
  to a real terminal.
- **master end:** held by the tmux server, which *pretends to be the keyboard and
  screen* of that program.

The server keeps **one PTY per pane**. It reads each program's output through those
PTYs, composes the picture of the whole screen (with the borders/dividers it draws
itself) and sends it to the client to display. When you type, the path reverses:
client → server → PTY of the active pane → your program.

### The prefix, revisited

The prefix (`Ctrl+b`) exists because the client intercepts *everything* you type
before handing it to the program. It needs a signal to know when a key is *for it*
(a tmux command) versus *for the program* inside the pane.

---

## Alternatives on the market

Worth splitting into families — an "alternative to tmux" depends on whether you
want general terminal multiplexing or just this specific use case (running frontend
+ backend together).

### Family 1 — Terminal multiplexers (direct tmux competitors)

| Tool | Summary | When it fits |
|------|---------|--------------|
| **GNU Screen** | The "grandfather" of tmux (1980s). Same detach/attach idea. | Legacy; ships on almost every server. tmux replaced it in practice. |
| **Zellij** | The "modern tmux", written in Rust. Shows shortcuts on screen, file-based layouts, plugins. | If you find tmux too raw. Gentler learning curve. |
| **dtach / abduco** | Tiny: do *only* detach/attach, no screen splitting. | When you just want "don't let the process die", no panes. |

### Family 2 — Terminal emulators with built-in multiplexing

Here the split is done by the **terminal app itself**, no tmux needed: **iTerm2**
(Mac), **Kitty**, **WezTerm**, **Windows Terminal**. The crucial difference: they
**lack tmux's persistence** — close the terminal and the processes die (there is no
background server). Many people still run tmux *inside* WezTerm/Kitty for that.

### Family 3 — Tools for the actual use case (run frontend + backend together)

If the goal is just "one command spins up several dev processes", some people don't
even use tmux:

| Tool | How it solves it |
|------|------------------|
| **`concurrently`** (npm) | `concurrently "npm:backend" "npm:frontend"` — runs everything in a single terminal with prefixed logs. Very popular in the JS world. |
| **`npm-run-all` / `mprocs`** | Similar; **mprocs** even gives a mini-TUI with one pane per process. |
| **Foreman / Overmind** | List the processes in a `Procfile` and it starts them all. Overmind uses tmux under the hood, gaining detach. |
| **Docker Compose** | `docker compose up` brings up back + front + database in containers. Truly reproducible, but heavier. |
| **Turborepo / Nx** | In monorepos, run tasks from several packages in parallel. |

### Which to pick?

- **Just want the logs together, don't care about persistence** → `concurrently`.
- **Want separate panes, navigation, zoom, and especially detach/attach** → **tmux**
  (what this POC does). The most powerful and flexible.
- **Want tmux's power with an easier UX** → **Zellij**.
- **Want full reproducibility across machines** → **Docker Compose**.

tmux's differentiator that no Family 3 competitor has: it is not about "running
processes", it is about **controlling terminals** — persistence, works over SSH,
independent of the terminal app, and useful for anything (not just JS dev). It's a
swiss-army knife; the others are single-purpose tools.

---

## Suggested presentation script (~5 min)

1. **The problem** (30s) — "Without tmux I'd open 3–4 terminals by hand: backend,
   frontend, tests... and keep switching between them."

2. **The solution** (30s) — Run `./dev-session.sh`. One command, everything shows up
   split on screen. Open the browser at `localhost:5173` showing front + back talking.

3. **Live hot reload** (1min) — Edit `frontend/src/main.js` (e.g. change the title)
   and save. The Vite pane recompiles and the browser updates on its own.

4. **Tests reacting** (1min) — Edit `frontend/src/format.js` breaking the logic (e.g.
   change `${min}m ${rest}s` to something else). The Vitest pane turns red instantly.
   Undo it and it goes back to green.

5. **Zoom** (30s) — `Ctrl+b` then `z` on a pane to see it fullscreen, and again to go
   back. Great for focusing on a log.

6. **The persistence magic** (1min) — `Ctrl+b` then `d` (detach). You "leave", but the
   processes stay alive. Run `tmux ls` to prove it. Close the terminal, open another,
   `tmux attach -t poc` — everything is there as it was.

7. **Wrap up** (15s) — `./dev-session.sh --kill`.

> Keep `cheatsheet.md` open in a pane or on a second monitor during the demo.
