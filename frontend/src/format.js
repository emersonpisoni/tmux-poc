// Pure function, deliberately isolated so there's something simple to test with
// Vitest (the tmux test pane reacts when you edit this live).
export function formatUptime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${min}m ${rest}s`;
}
