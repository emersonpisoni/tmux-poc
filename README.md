# POC tmux — Fullstack (Node + Vite) com 1 comando

Prova de conceito para validar o cenário: **subir um ambiente de desenvolvimento
inteiro — backend, frontend e testes — dentro de uma única sessão tmux, com um
comando só**, e mostrar a persistência (fechar o terminal sem matar os processos).

```
┌──────────────────────┬──────────────────────┐
│  BACKEND (node)      │  FRONTEND (vite)     │
│  npm run dev         │  npm run dev         │
│  → http://:3000      │  → http://:5173      │
├──────────────────────┼──────────────────────┤
│  TESTES (vitest)     │  SHELL LIVRE         │
│  npm test            │  git, npm, etc.      │
└──────────────────────┴──────────────────────┘
        tudo isso = ./dev-session.sh
```

## O que tem aqui

| Pasta / arquivo | O que é |
|-----------------|---------|
| `backend/` | Servidor Node usando só o módulo `http` nativo (zero dependências). API em `/api/status` e `/api/tasks`. |
| `frontend/` | App Vite (vanilla JS) que consome o backend via proxy e mostra o status. Tem um teste Vitest. |
| `dev-session.sh` | O script estrela: monta a sessão tmux com os 4 painéis. |
| `cheatsheet.md` | Cola de atalhos para usar durante a apresentação. |

## Pré-requisitos

```bash
brew install tmux
```

## Como rodar

```bash
./dev-session.sh
```

Na primeira vez ele instala as deps do frontend automaticamente. Depois abre a
sessão tmux com tudo rodando. Acesse **http://localhost:5173** no navegador — o
front mostra o backend online e atualiza o uptime a cada 2s.

Para derrubar tudo: `./dev-session.sh --kill`

---

## Roteiro sugerido para a apresentação (~5 min)

1. **O problema** (30s) — "Sem tmux, eu abriria 3–4 terminais na mão: backend,
   frontend, testes... e ficaria alternando entre eles."

2. **A solução** (30s) — Rode `./dev-session.sh`. Um comando, tudo aparece
   dividido na tela. Abra o navegador em `localhost:5173` mostrando front + back
   conversando.

3. **Hot reload ao vivo** (1min) — Edite `frontend/src/main.js` (ex: troque o
   título) e salve. O painel do Vite recompila e o navegador atualiza sozinho.

4. **Testes reagindo** (1min) — Edite `frontend/src/format.js` quebrando a lógica
   (ex: troque `${min}m ${rest}s` por outra coisa). O painel do Vitest fica
   vermelho na hora. Desfaça e ele volta ao verde.

5. **Zoom** (30s) — `Ctrl+b` depois `z` num painel para vê-lo em tela cheia, e de
   novo para voltar. Bom para focar num log.

6. **A mágica da persistência** (1min) — `Ctrl+b` depois `d` (detach). Você
   "sai", mas os processos continuam vivos. Rode `tmux ls` para provar. Feche o
   terminal, abra outro, `tmux attach -t poc` — está tudo lá como estava.

7. **Fechar** (15s) — `./dev-session.sh --kill`.

> Deixe o `cheatsheet.md` aberto num painel ou num segundo monitor durante a demo.
