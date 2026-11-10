import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const times = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id: "ShopeeTrends", browserExecutable: "/opt/pw-browsers/chromium", chromiumOptions: { } });
for (const t of times) {
  const frame = Math.round(t * comp.fps);
  await renderStill({ composition: comp, serveUrl, frame, output: `out/stills/t${t.toFixed(2)}.jpg`, imageFormat: "jpeg", jpegQuality: 85, browserExecutable: "/opt/pw-browsers/chromium" });
  console.log("ok", t);
}
