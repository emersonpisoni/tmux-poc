# tmux — cola de atalhos para a apresentação

> **Prefix** = a tecla que "acorda" o tmux antes de qualquer comando.
> Padrão: **`Ctrl + b`** (aperta e solta, depois a próxima tecla).

## O essencial (o que você vai usar ao vivo)

| Ação | Teclas |
|------|--------|
| **Detach** (sai, mas deixa tudo rodando) | `prefix` + `d` |
| Reanexar depois | `tmux attach -t poc` |
| Navegar entre painéis | `prefix` + `←↑↓→` |
| Alternar para o último painel | `prefix` + `o` |
| **Zoom** num painel (tela cheia / volta) | `prefix` + `z` |
| Fechar o painel atual | `prefix` + `x` (confirma) ou `exit` |

## Painéis (o "vários terminais juntos")

| Ação | Teclas |
|------|--------|
| Dividir na vertical (lado a lado) | `prefix` + `%` |
| Dividir na horizontal (um sobre o outro) | `prefix` + `"` |
| Mostrar números dos painéis | `prefix` + `q` |

## Janelas (as "abas")

| Ação | Teclas |
|------|--------|
| Nova janela | `prefix` + `c` |
| Próxima / anterior | `prefix` + `n` / `p` |
| Ir para a janela N | `prefix` + `0..9` |
| Renomear janela | `prefix` + `,` |

## Sessões (pela linha de comando)

| Ação | Comando |
|------|---------|
| Listar sessões | `tmux ls` |
| Anexar | `tmux attach -t poc` |
| Matar a sessão | `tmux kill-session -t poc` (ou `./dev-session.sh --kill`) |

## Dica de scroll
Terminal com muito log? `prefix` + `[` entra no modo de rolagem
(use as setas / `PgUp`); aperte `q` para sair.
