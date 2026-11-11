# Shopee Trends 2027 · vídeo manifesto "Feito para crescer"

Vídeo de storytelling (54 s, 1920x1080, 30 fps) montado sobre a locução oficial. Mistura fotos ilustrativas geradas por IA com os elementos do KV (círculo, pílula, quadrado arredondado, laranja #ED4D2D, vermelho #D2422A, salmão #F59C8B, navy #124272) e termina na família de KVs passando de um para o outro.

## Roteiro visual sincronizado com a locução

| Tempo | Locução | Imagem |
|---|---|---|
| 0.0 – 3.7 | O seller que chega ao Trends quase sempre começou sozinho. | Foto 1 (seller sozinha à noite embalando um pedido), revelada por círculo que abre do canto esquerdo. |
| 3.7 – 5.1 | Aprendeu fazendo, | Foto 2 (mãos fechando caixa no quarto improvisado), corte seco. |
| 5.1 – 6.5 | entre um pedido e outro. | Foto 10 (entregador de moto ao entardecer), corte seco. |
| 6.5 – 8.6 | O que ele quer agora é crescer. | Fundo laranja, tipografia: "crescer." em Quicksand Bold gigante, blob salmão do KV 3 crescendo atrás. |
| 8.6 – 12.9 | Vender mais, ganhar espaço, transformar a loja em marca. | Composição do KV 4: quadrado arredondado entra com a foto 3 (fotografando produtos), círculo entra com a foto 4 (seller com caixa laranja). Em "transformar" o círculo abre em tela cheia e aparece o carimbo "loja → marca". |
| 12.9 – 19.6 | E crescer tem uma ordem. Primeiro se aparece, depois se vende, só então se cresce. | Fundo vermelho, três círculos em degradê branco-salmão (motivo do KV 3) entrando em tamanhos crescentes: 1. aparece, 2. vende, 3. cresce. O terceiro círculo se expande e vira a transição. |
| 19.6 – 24.0 | É o caminho que ele já percorre com a Shopee, e é o caminho que o Trends coloca de pé. | Foto 5 (palco do evento com público), push-in lento. |
| 24.0 – 30.9 | Cada palco, cada conversa com especialista, cada ferramenta apresentada é um passo dessa ordem. | Tríptico nas formas do KV: pílula (palco), quadrado (conversa com especialista), círculo (ferramenta no celular). Em "passo dessa ordem" as três formas se reorganizam em escada. |
| 30.9 – 34.5 | Do MEI que abriu a loja ontem, à loja que já tem equipe. | Foto 1 volta (a mesma seller do início) e um wipe diagonal revela a foto 8 (equipe no estoque). Tela dividida. |
| 34.5 – 38.1 | Todo mundo que atravessa estas portas tem o mesmo destino. | Foto 7 (grupo entrando pelas portas do centro de convenções), revelada pela pílula do KV 2. |
| 38.1 – 41.9 | Sem promessa de número. É o motivo deste evento existir, | Foto 9 (retrato de seller olhando para a câmera, fundo laranja). |
| 41.9 – 44.6 | e o motivo de cada seller estar aqui. | Montagem rápida: cinco rostos de sellers abrindo em círculos (fotos 3, 4, 8, 10, 7). |
| 44.6 – 48.7 | Shopee Trends 2027. Feito para crescer. | O KV 2 é construído ao vivo: pílula navy cresce, lockup "Shopee trends. 2027" entra, "Feito para crescer" aparece. |
| 48.7 – 54.0 | (silêncio) | Carrossel da família de KVs (1, 3, 4, 5, 2, duas voltas) passando de um para o outro por círculos, parando no KV 2. |

## Insumos

- `public/audio/locucao.mp3`: locução oficial (ElevenLabs, 48 s).
- `public/kv/1..5.png`: os cinco KVs do projeto. `logo_white.png`: lockup extraído do KV 2 com transparência.
- `public/gen/c01..c10.png`: fotos ilustrativas geradas por IA (Canva), 1920x1080, sem texto nem logos.
- `public/fonts/Quicksand-*.ttf`: fonte compatível com a tipografia do KV.

## Como renderizar de novo

```bash
npm install
npx remotion render src/index.ts ShopeeTrends out/shopee-trends-2027-manifesto.mp4
```

Para abrir o editor visual e mexer em tempos, textos e posições:

```bash
npx remotion studio
```

Os tempos de cada cena ficam no final de `src/Video.tsx` (componente `ShopeeTrendsVideo`).

## O que ainda falta

- Trilha sonora: o vídeo está só com a locução. Falta uma faixa licenciada (build-up, pop, 55 s) misturada uns 18 dB abaixo da voz.
- As fotos são ilustrativas. Se o cliente quiser, dá para trocar por fotos reais do Trends 2026 mantendo a mesma montagem (basta substituir os arquivos em `public/gen/`).
