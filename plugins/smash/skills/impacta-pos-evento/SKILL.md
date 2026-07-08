---
name: impacta-pos-evento
description: >
  Gera o dashboard web de pós-evento no formato Método Impacta da Agência Smash —
  uma página única, autocontida e na identidade da marca, com as abas Visão Geral,
  Jornada do Evento, Retenção pela Agenda, ESG, Destaques e Time. Use SEMPRE que o
  usuário pedir um pós-evento, relatório de evento, dashboard de evento, "impacta",
  "método impacta", análise de convenção/celebração/get together, retenção de público
  pela agenda ou um balanço de ESG de evento — mesmo que não diga a palavra "dashboard".
  Aciona a partir de um PDF/relatório de pós-evento e/ou do protocolo de coleta Impacta.
---

# Dashboard Pós-Evento — Método Impacta (Smash)

Este skill transforma o material de pós-evento de um evento da Smash (PDF de registro
+ protocolo de coleta Impacta) em um **dashboard web de página única**, autocontido
(abre em qualquer navegador, tudo embutido) e fiel à identidade Smash.

## Antes de começar (sempre)
1. **Carregue o skill `smash-guide`** para a identidade visual e verbal. Este dashboard
   usa a variante de paleta: **preto dominante, branco no texto, amarelo nos títulos,
   dados e gráfico; azul (`#00E5FF`) e roxo (`#9333EA`) SÓ em ícones pontuais**. Sem
   gradiente colorido, sem blocos de azul/roxo. É uma escolha de marca deliberada.
2. **Leia `references/impacta-metodo.md`** para entender o que cada aba responde e como
   ler os dados. Princípio inegociável: os dados do Impacta são **qualitativos-observacionais**
   — nunca invente números duros (nº de convidados, kg de CO₂, % de satisfação) que o
   material não traz. Notas e curvas são "leitura qualitativa-observacional"; deixe isso
   visível no dashboard.

## Insumos típicos
- Um **PDF de pós-evento** (registro: local, cenografia, A&B, palco, gift, considerações, carômetro).
- O **protocolo de coleta Impacta** preenchido (respostas de Atendimento, Conteúdo, Produção) — pode vir como `.md`, doc ou colado no chat.
- Fotos ficam **dentro do PDF** — extraia de lá. O **logo `smash!`** e, muitas vezes, a **agenda real com horários** também estão no PDF.

## Fluxo de trabalho

### 1. Extraia texto e imagens do PDF
```bash
python scripts/extract_pdf.py "<caminho do PDF>" impacta_extract
```
Isso gera `impacta_extract/texto.txt`, a pasta `imgs/` e o `imgs/_catalogo.txt`.
Abra (com a ferramenta Read) as imagens maiores (>= 600px) para escolher as boas.
Procure especificamente: o **logo branco `smash!`**, uma **foto-hero forte** (palco com
plateia / momento de pico), e uma foto por seção da jornada. Se houver uma página com a
**agenda/horários**, leia — ela deixa a aba de Retenção muito mais precisa.

### 2. Reúna o conteúdo real
Cruze o `texto.txt` com o protocolo Impacta para preencher cada aba. Não terceirize o
julgamento para o script — quem escreve os textos, define a curva de retenção e as notas
de ESG é você, com base nas evidências. Veja o mapeamento aba→pergunta em
`references/impacta-metodo.md`.

### 3. Preencha o template
Copie `references/template.html` para o seu diretório de trabalho e edite o **conteúdo**
(textos das abas, cards de KPI, blocos da jornada, cardápio, considerações, carômetro,
e o array `pts` da curva de retenção no `<script>`). **Mantenha os tokens de imagem**
(`__HERO__`, `__LOGO__`, `__PLENARY__`, etc.) — eles são preenchidos no passo 4.
Estrutura das abas e tokens: veja "Referência do template" abaixo.

### 4. Gere o HTML autocontido
Crie um `mapa.json` que liga cada token de imagem ao arquivo escolhido e rode:
```bash
python scripts/build.py template.html mapa.json Dashboard-<Evento>.html
```
O script otimiza as fotos, embute tudo como data URI e injeta os ícones (azul/roxo).
Ele avisa se sobrou algum token não preenchido. O resultado é um único `.html`.

### 5. Entregue
- **Preview local**: publique como Artifact (`Artifact` tool) para revisão rápida, ou
  abra o `.html` (é autocontido).
- **Link público para o cliente** (quando pedido): o caminho confiável é o **Netlify Drop**.
  Abra `https://app.netlify.com/drop` no navegador do usuário (ferramentas de browser),
  peça para ele **arrastar o `.html` para o círculo central** (o upload programático é
  bloqueado por sandbox; o arrasto do usuário resolve), então **capture a URL gerada** e
  entregue. Dá para renomear em Configuração do projeto → *Change project name*.
  Evite catbox/0x0/tmpfiles: servem HTML como texto puro (mostram o código, não renderizam).

## Referência do template (`references/template.html`)

Página escura, header fixo com o logo, hero com foto + overlay Smash, navegação por abas
e um `<canvas>` para a curva de retenção. **Abas (nesta ordem):**

1. **Visão Geral** — 4 KPIs (fatos reais: duração, formato que reteve, mensagem, objetivo),
   "surpresas positivas" × "pontos de atrito", e uma citação de leitura de conteúdo.
2. **Jornada do Evento** — blocos numerados com foto(s) + descrição, na ordem do relatório:
   Local, Implantação, Cenografia (térreo e andar do evento), A&B (welcome + coquetel com
   cardápio), Palco/Plenária, Gift out.
3. **Retenção pela Agenda** — `<canvas>` com a curva de atenção percebida (array `pts` no
   script: `{x:"18h25", l:"Painel 1", v:56, k:"dip"}`, onde `k` = `peak|dip|warn`), mais
   cards de timeline com os horários reais e "o que sustenta/derruba a retenção".
4. **ESG** — banner da sede + scorecard por pilar (Ambiental/Social/Governança) com nota
   qualitativa (0–5), iniciativas registradas e lacunas + fotos-evidência (gift em juta etc.).
5. **Destaques** — "Muito bem avaliado" (manter como assinatura) × "Exige intervenção"
   (prioridade próxima edição), puxados das considerações finais.
6. **Time** — carômetro (array `members` no script: `["Nome","Cargo"]`).

**Tokens de imagem** (troque no `mapa.json`; use só os que fizerem sentido, remova figuras
sem foto): `__LOGO__`, `__HERO__`, `__PLENARY__`, `__RECEPTION__`, `__CRED__`, `__BAR__`,
`__WELCOME__`, `__PAINEL__`, `__PLAN__`, `__TOTEM__`, `__BACKDROP__`, `__SOUP__`,
`__DRINKS__`, `__GIFT__`, `__GIFTBOX__`. **Tokens de ícone** são automáticos (não vão no mapa).

## Dependências
`python -m pip install pymupdf pillow` (extração de PDF + otimização de imagem).

## Lembretes de qualidade
- Fidelidade de marca vem antes de "encher" o dashboard: menos azul/roxo, mais preto/amarelo/branco.
- Toda nota ou curva sem base dura = rotular como leitura qualitativa. Honestidade é parte do método.
- Se o material tiver números reais (presença por bloco, pegada do venue), plugue-os e
  troque o rótulo qualitativo por dado medido naquele ponto.
