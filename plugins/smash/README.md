# Smash — Plugin para Claude Code

Ferramentas da Agência Smash. Hoje inclui a skill de **dashboard de pós-evento no Método Impacta**.

## Skills incluídas
- **`/smash:impacta-pos-evento`** — gera um dashboard web de página única (autocontido, na
  identidade Smash) a partir do PDF de pós-evento e do protocolo de coleta Impacta.
  Abas: Visão Geral · Jornada do Evento · Retenção pela Agenda · ESG · Destaques · Time.

## Como usar
Depois de instalado, é só pedir em linguagem natural, por exemplo:
> "Faz o pós-evento Impacta do evento X" · "Preciso do dashboard de retenção e ESG desse evento"

A skill dispara sozinha, extrai texto e fotos do PDF, cruza com o protocolo Impacta e
monta o `.html` final.

## Dependências
As bibliotecas `pymupdf` e `pillow` são instaladas automaticamente na primeira sessão
(via hook `SessionStart`). Se por algum motivo falhar, rode manualmente:
```bash
python3 -m pip install pymupdf pillow
```
