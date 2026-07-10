# tmux — shortcut cheat sheet for the presentation

> **Prefix** = the key that "wakes up" tmux before any of its commands.
> Default: **`Ctrl + b`** (press and release, then the next key).

## The essentials (what you'll use live)

| Action | Keys |
|--------|------|
| **Detach** (leave, but keep everything running) | `prefix` + `d` |
| Reattach later | `tmux attach -t poc` |
| Move between panes | `prefix` + `←↑↓→` |
| Switch to the last pane | `prefix` + `o` |
| **Zoom** a pane (fullscreen / back) | `prefix` + `z` |
| Close the current pane | `prefix` + `x` (confirm) or `exit` |

## Panes (the "many terminals together")

| Action | Keys |
|--------|------|
| Split vertically (side by side) | `prefix` + `%` |
| Split horizontally (one above the other) | `prefix` + `"` |
| Rearrange into an even grid (square) | `prefix` + `Space` (cycles layouts, stop on `tiled`) |
| Show pane numbers | `prefix` + `q` |

## Windows (the "tabs")

| Action | Keys |
|--------|------|
| New window | `prefix` + `c` |
| Next / previous | `prefix` + `n` / `p` |
| Go to window N | `prefix` + `0..9` |
| Rename window | `prefix` + `,` |

## Sessions (from the command line)

| Action | Command |
|--------|---------|
| List sessions | `tmux ls` |
| Attach | `tmux attach -t poc` |
| Kill the session | `tmux kill-session -t poc` (or `./dev-session.sh --kill`) |

## Scroll tip
Pane with lots of logs? `prefix` + `[` enters scroll mode
(use the arrows / `PgUp`); press `q` to exit.
