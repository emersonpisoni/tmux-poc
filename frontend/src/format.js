// Funcao pura, isolada de propósito para ter algo simples de testar com o Vitest
// (o painel de testes do tmux fica reagindo quando voce edita isto ao vivo).
export function formatUptime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${min}m ${rest}s`;
}
