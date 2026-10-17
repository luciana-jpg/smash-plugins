---
name: KV-moodboard
description: >
  Monta o mood board de KV (key visual) de convenção ou evento da Smash a partir do
  guide de marca do cliente, do tema do evento e das refs que a Lu/Leca gostou, e
  entrega uma prancha de direção de arte em página única (HTML) com refs decodificadas,
  DNA da marca, conceito, três rotas de composição com sketch, título bilíngue quando
  pedido, refs reais de banco de imagem (Pinterest e Adobe Stock) curadas e legendadas,
  direção de foto, riscos e próximos passos. Use SEMPRE que pedirem "mood board do KV",
  "moodboard da convenção", "prancha de referências pro KV", "pega refs no Pinterest /
  Adobe / banco de imagem", "direção de arte do KV", "como traduzir o tema em imagem",
  ou mandarem guide + refs + tema pedindo pra montar o visual. NÃO abre KV pronto em
  camadas (kv-camadas-smash), NÃO cria o tema (storytelling-tema-smash) e NÃO gera
  storyboard com prompt de imagem (storyboard-prompt-smash).
---

# KV-moodboard — Smash (v1)

Prancha de direção de arte que vem ANTES do KV. O objetivo é fechar arquitetura
(forma, cor, tipografia, foto, grafismo) com o cliente antes de abrir Photoshop,
com referência real na frente, não adjetivo. Calibrada no KV da convenção 99Compras
2026 ("O legado começa aqui" / 传承始于此), guide DiDi/99 + refs Shell Select e Itaú.

## Histórico (mantenha atualizado a cada job)

- **v1** (99Compras, out/2026): método em 9 seções, sketches em CSS com unidades de
  container, pipeline de refs por boards do Pinterest + Adobe Stock pelo conector,
  curadoria por folha de contato. Aprendizados registrados na última seção.

Se você (agente) mudar o método, a ordem das seções ou o pipeline de refs, **adicione
uma linha aqui e atualize os scripts**. Faz parte do fluxo.

## Entradas (buscar antes de perguntar)

1. **Guide de marca do cliente** (PDF). Extrair com `pdftotext -layout` e também
   renderizar a página (`pdftoppm -r 80 -png`) e OLHAR: paleta, fonte, regras de logo,
   exemplos de aplicação. O texto sozinho perde o que importa (como a foto da marca é).
2. **Tema do evento** e idiomas extras pedidos (ex.: título em chinês embaixo).
3. **Refs que a Lu gostou** (prints). Cada uma é um sistema, não uma imagem: decodificar.
4. Memória do job em `/areas/<job>.md`, se existir (cliente, data, público, dor).

Se não tiver tema fechado, pare e mande pra `storytelling-tema-smash`. Sem tema o
mood board vira catálogo de amarelo.

## A prancha (ordem fixa, 9 seções)

Página única em HTML publicada como artifact, no mundo de cor da marca do cliente,
tipografia substituta do Google Fonts quando a fonte da marca não está lá (dizer isso
na prancha). Sketches de layout em CSS, não imagem gerada. Veja
`references/exemplo-99compras.html` pra estrutura, tokens e CSS dos sketches.

| # | Seção | O que precisa ter |
|---|---|---|
| 01 | As refs, decodificadas | As refs da Lu lado a lado + 4 a 6 regras que elas têm em comum (fundo, moldura, tipo, grafismo na palavra, foto). A tese: "você escolheu N peças que são o mesmo sistema". |
| 02 | Refs de banco de imagem | 40 a 60 imagens reais, agrupadas pelo que cada grupo ENSINA, cada uma com legenda "por que está aqui" e link da fonte. Pipeline abaixo. |
| 03 | DNA da marca | Paleta com HEX e **proporção sugerida pro KV** (barra), tipografia, e só as regras do guide que mexem no KV (o que o logo pode virar em título, proteção, contraste). |
| 04 | Do tema pra imagem | Qual é o paradoxo do tema e como vira forma. Procurar uma forma que já é da marca (app icon, proteção do logo, numeral) pra ser a moldura. Um grafismo que vira sistema de motion. O título como lockup (bilíngue é assinatura de origem, não tradução). |
| 05 | Três rotas de composição | Segura, expressiva, ousada. Cada uma com sketch 16:9, "vem de", a favor, contra. Fechar com "minha leitura" recomendando uma e, se couber, um híbrido. |
| 06 | Título em outro idioma | Só se pedido. Três opções com transliteração e nota de sentido, uma recomendada, lockup sugerido com proporção, aviso de fonte e de validação com nativo. |
| 07 | Direção de foto | O que entra na janela, luz, cidade, quem (time > lojista/entregador > modelo de banco). O que evitar. |
| 08 | Riscos | Cada risco com o jeito de fechar. Sempre incluir "parecer campanha de produto" e "parecer a marca que é dona dessa cor". |
| 09 | Pra virar KV | Lista do que falta pedir ao cliente e a ordem de produção (16:9 primeiro, depois vertical e largo). |

Regras de escrita da prancha: sem travessão, sem emoji, prosa curta, discordar
quando a ref favorita da Lu for a mais arriscada (dizer por quê e o que faria no lugar).

## Pipeline de refs de banco (seção 02)

O que funciona e o que não funciona, testado em out/2026 do ambiente cloud:

| Fonte | Funciona? | Como |
|---|---|---|
| Pinterest, páginas de **board** e de **ideas** | Sim | `curl` com user agent de browser, pins vêm no HTML. 20 a 100 por página. `scripts/pinterest_boards.py`. |
| Pinterest, página de **pin** individual | Sim | Mesmo curl; útil pra pegar um pin específico que veio do WebSearch. |
| Pinterest, **busca** (`/search/pins/`) e API interna | Não | Página vem sem pins, API responde 403. Não insista; ache boards via WebSearch com `allowed_domains: pinterest.com`. |
| **Adobe Stock pelo conector** (`asset_search`, `entityScope: StockAsset`) | Sim | Chamar `adobe_mandatory_init` antes. **Queries curtas** (3 a 5 palavras): "delivery courier yellow bike" acha 19, "delivery courier yellow jacket bicycle city street Brazil smiling" acha 0. Trocar `240_F` por `500_F` na URL do preview dá thumbnail maior. São comps com marca d'água: licenciar antes de usar. |
| Adobe Stock pela **web** (stock.adobe.com) | Não | 403 pra fetch automático. |
| Behance, Unsplash, Pexels, Dribbble | Não | 403, 401, Cloudflare. Dizer na prancha que não entraram. |
| Openverse (`api.openverse.org`) e Wikimedia Commons | Parcial | Funcionam, mas acervo fraco pra campanha. Último recurso pra foto CC. |

Passo a passo:

1. **Achar boards**: 4 a 8 buscas no WebSearch restritas a `pinterest.com` com os
   eixos do KV (cor da marca + poster, key visual de evento, identidade de evento
   corporativo, bento/tiles, o idioma extra + tipografia, o tipo de foto). Pegar
   URLs de board e de ideas, não de pin.
2. **Baixar**: `python3 -I scripts/pinterest_boards.py dl/pins <urls...>`. Dá
   em média 20 pins por board; 10 boards = ~200 imagens.
3. **Adobe Stock**: 4 a 6 `asset_search` em paralelo com queries curtas, por eixo
   de foto (quem entrega, quem vende, quem recebe, retrato no fundo da cor da marca,
   cidade). Salvar id, name e renditionURL num JSON e baixar com curl.
4. **Folha de contato**: `python3 -I scripts/contact_sheet.py dl/pins sheets/pins 6 36`
   e o mesmo pro stock. **Abrir cada folha e olhar.** Não dá pra curar pelo título
   (os pins vêm quase sempre sem título). Anotar os números que ficam.
5. **Curar**: 40 a 60 ao todo. Critério: a imagem ensina uma regra que o KV vai
   usar (forma, contraste, mosaico, tratamento de foto, lockup bilíngue, desdobramento
   em palco/crachá) ou é a foto que o fotógrafo precisa ver. Fora: a que só é bonita.
6. **Agrupar e legendar**: 5 a 7 grupos, cada um com uma tese de uma linha e cada
   imagem com uma legenda que diz o que ela ensina ("anéis concêntricos sobre
   amarelo: é o grafismo do legado se espalhando"). `scripts/build_gallery.py`
   gera a seção a partir de um JSON de curadoria e copia as imagens (máx. 900 px).
7. **Publicar** as imagens junto com a página (`files` do artifact), porque o
   artifact não carrega imagem de host externo.
8. Na prancha, uma linha dizendo quais fontes não entraram e por quê.

Nunca publicar imagem que você não olhou. Nunca gerar imagem por IA no lugar das
refs sem a Lu pedir: gasta crédito e vira "KV achatado" (ver `kv-camadas-smash`).

## Sketches das rotas

Três `div.sk` 16:9 com `container-type: inline-size`, tipografia em `cqw`, manchas
de gradiente marrom/laranja no lugar da foto, tokens de cor da marca. Rota A
(moldura): janela central + anéis + título dividido nos dois lados. Rota B
(mosaico): tiles arredondados + pessoa em primeiro plano + título cruzando. Rota C
(ousada): o elemento próprio da marca (numeral, ícone) como máscara da foto. Mudar
as formas conforme a marca, manter a lógica segura/expressiva/ousada. CSS pronto no
exemplo.

## Título em outro idioma (quando pedido)

- Tratar como parte do lockup: mesmo peso, mesma cor, alinhado ao bloco principal,
  35 a 40% do corpo do título. Pequeno ou em cor diferente vira enfeite.
- Três opções: a de slogan (compacta, registro formal), a literal (tom de conversa)
  e a que muda o sentido (mais épica). Recomendar uma e dizer o que cada uma perde.
- Checar polissemia: "legado" em chinês é 传承 (o que passa adiante), nunca 遗产
  (herança de bens, soa a testamento).
- Avisar que a fonte da marca provavelmente não tem glifos CJK; pedir a família
  CJK ao cliente (DiDi tem) e indicar o par aberto (Source Han Sans / Noto Sans CJK
  no peso Heavy).
- Pedir validação com falante nativo antes de fechar arte. Quando o cliente é de
  grupo chinês (99/DiDi), tem gente nativa na casa.

## Aprendizados do 99Compras (não repetir, não esquecer)

1. **Refs favoritas são o mesmo sistema**: Shell Select "Vale a parada" e Itaú "Vive
   más protegido" = cor sólida em 100% do fundo, janela de canto arredondado, título
   gigante que passa na frente e atrás, ícone dentro da palavra, foto real quente.
2. **Amarelo + mosaico de foto colorida + título branco bold = Shell Select.** Com
   marca amarela, o título vai pro preto (que o guide pede) e a moldura tem que ser
   a forma própria da marca (squircle do app icon). O que destaca de verdade é foto
   em P&B com a cor como máscara (Under Armour) ou uma janela só com muito vazio.
3. **A forma da marca já existe**: proteção do logo / app icon vira moldura. Não
   inventar forma nova quando o guide já dá uma.
4. **Anéis concêntricos tonais** saindo da janela = legado se espalhando. Vira
   motion de telão e textura de cenografia sem precisar de foto. Ref: Fiat 500.
5. **O tema é um paradoxo** ("legado" olha pra trás, "começa aqui" olha pra frente).
   O KV tem que parecer largada, não retrospectiva. Dizer isso na seção 04.
6. **Laranja de acento cresce sozinho.** Segurar num elemento, senão vira a ref do
   Itaú.
7. **Convenção interna com foto de cliente feliz parece anúncio do app.** O time
   ou quem opera (lojista, entregador) na janela.
8. **Rota ousada com o logo** (99 gigante com foto dentro) flerta com "distorção
   de logo" do guide. Mandar como tipografia de título, logo íntegro na assinatura,
   e pedir ok formal antes de investir.
9. **Tiles arredondados são o padrão do social brasileiro** (crédito, dia do
   cliente, convenção de franqueados). Bom pra desdobrar, fraco como ideia única
   de KV.
10. **Pinterest sem login só entrega boards.** Planejar as buscas por board, não
    por termo. Adobe Stock só pelo conector e com query curta.

## Quando NÃO é essa skill

- KV já aprovado e precisa de camadas/PSD → `kv-camadas-smash`.
- Tema não existe ainda → `storytelling-tema-smash` primeiro.
- Quer frames de abertura ou prompts de imagem → `storyboard-prompt-smash`.
- Quer crítica de um KV pronto → `event-design-director`.
- Quer aplicar o KV em crachá/backdrop/post → `kv-multiformato-lote`.
