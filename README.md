# Smash Plugins — Marketplace do Claude Code

Marketplace de plugins da **Agência Smash** para o Claude Code.

## Instalação (para o time)

No Claude Code, rode:

```
/plugin marketplace add SEU-GITHUB/smash-plugins
/plugin install smash@smash-plugins
```

Troque `SEU-GITHUB` pelo usuário/organização onde este repositório está hospedado
(ex.: `agenciasmash/smash-plugins`). Depois de instalar, reinicie o Claude Code.

Para instalar já compartilhado num projeto (via `.claude/settings.json`):
```
/plugin install smash@smash-plugins --scope project
```

## Plugins disponíveis

| Plugin  | O que faz |
|---------|-----------|
| `smash` | Ferramentas da Smash. Inclui `/smash:impacta-pos-evento` (dashboard de pós-evento no Método Impacta) e `/smash:KV-moodboard` (mood board de KV com refs reais de Pinterest e Adobe Stock, rotas de composição e título bilíngue). |

## Estrutura do repositório
```
smash-plugins/
├── .claude-plugin/
│   └── marketplace.json         # catálogo do marketplace
└── plugins/
    └── smash/
        ├── .claude-plugin/plugin.json
        ├── hooks/hooks.json      # instala pymupdf/pillow na 1ª sessão
        ├── requirements.txt
        └── skills/
            ├── impacta-pos-evento/
            └── KV-moodboard/        # prancha de direção de arte do KV
```

## Manutenção
Para publicar uma nova versão, edite os arquivos, suba o `version` em
`plugins/smash/.claude-plugin/plugin.json` e faça `git push`. O time recebe a atualização
com `/plugin update smash@smash-plugins`.
