# Prompts de image-to-video por cena

Para gerar os clipes em qualquer ferramenta de image-to-video (Kling, Runway, Seedance via ElevenLabs, Higgsfield, Veo). Use a foto da cena como frame inicial (`public/gen/cXX.jpg`), 16:9, 5 s, 1080p quando houver. Os prompts descrevem só o movimento, não a imagem (é o que os modelos pedem). Salve o resultado como `public/gen/cXX.mp4` e rode `node scripts/clips-manifest.mjs` antes de renderizar: a composição troca a foto pelo clipe automaticamente.

Sufixo para todos os prompts: "maintain exact appearance from reference image, consistent character throughout, no deformation or drift, no text, no logos, natural motion, 24 fps".

| Clipe | Cena | Prompt de movimento |
|---|---|---|
| c01 | Seller sozinha à noite | Slow push-in on the woman as she folds the box flap and presses the tape down with her thumb, then glances at the phone screen lighting her face. Desk lamp flickers softly. Camera drifts forward 10 percent. |
| c02 | Mãos fechando caixa | Handheld close-up: his hands pull the tape across the box, tear it, and press it flat; he slides the box aside and reaches for the next one. Morning light stays steady. Camera holds, slight breathing motion. |
| c03 | Fotografando produtos | She taps the phone screen to take the photo, tilts the phone to check it and smiles; ring light stays on. Camera slowly orbits a few degrees to the left. |
| c04 | Seller com caixa laranja | He lifts the orange box slightly and turns it toward the camera, proud; then looks off camera and laughs. Camera dollies in gently, shallow focus on his face. |
| c05 | Palco do evento | Slow dolly forward through the crowd toward the stage; audience phones raised, light beams sweep across the haze, LED screen shapes drift slowly. No new people appear. |
| c06 | Conversa com especialista | The specialist points at the tablet and swipes; the seller nods and leans in, both smile. Crowd blurs past in the background. Camera holds with a slow push-in. |
| c07 | Grupo entrando pelas portas | The group walks toward the camera through the glass doors, backlit by the sun, laughing; camera tracks backward at walking pace keeping them in frame. |
| c08 | Equipe no estoque | The high five lands and the hands come down; the woman on the ladder passes a parcel down; the man at the table tapes a box. Camera slow lateral slide to the right. |
| c09 | Retrato olhando para a câmera | She holds eye contact, breathes, and a slow confident smile forms; hair moves slightly. Camera locked, very slow push-in. Orange backdrop stays flat. |
| c10 | Entregador de moto ao entardecer | He looks up from the phone toward the city, puts the phone in his pocket and grips the handlebar; traffic lights blur in the background. Camera slow push-in from the side. |

## Como encaixar na montagem

Duração mínima por clipe: 5 s cobre todas as cenas (a mais longa, o palco, usa 4,4 s). Se o modelo entregar 720p, a composição sobe para 1080p com leve suavização; prefira 1080p nativo quando houver.
