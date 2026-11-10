import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";

// ---------- Fonts ----------
loadFont({
  family: "Quicksand",
  url: staticFile("fonts/Quicksand-Bold.ttf"),
  weight: "700",
});
loadFont({
  family: "Quicksand",
  url: staticFile("fonts/Quicksand-SemiBold.ttf"),
  weight: "600",
});
loadFont({
  family: "Quicksand",
  url: staticFile("fonts/Quicksand-Medium.ttf"),
  weight: "500",
});

// ---------- Palette (from KV) ----------
export const C = {
  orange: "#ED4D2D",
  red: "#D2422A",
  salmon: "#F59C8B",
  navy: "#124272",
  navyDeep: "#0B2B4F",
  white: "#FFFFFF",
};

export const FPS = 30;
export const DURATION_SECONDS = 54;
const sec = (t: number) => Math.round(t * FPS);

const FONT = "Quicksand, system-ui, sans-serif";

// ---------- Helpers ----------
const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** Absolute Sequence by seconds (from, to). */
const Seq: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
  name?: string;
}> = ({ from, to, children, name }) => (
  <Sequence
    from={sec(from)}
    durationInFrames={sec(to) - sec(from)}
    name={name}
    layout="none"
  >
    {children}
  </Sequence>
);

/** Full-bleed photo with Ken Burns. scale from -> to, drift in px. */
const Photo: React.FC<{
  src: string;
  from?: number;
  to?: number;
  driftX?: number;
  driftY?: number;
  style?: React.CSSProperties;
}> = ({ src, from = 1.0, to = 1.08, driftX = 0, driftY = 0, style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s = from + (to - from) * p;
  return (
    <AbsoluteFill style={style}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${s}) translate(${driftX * p}px, ${driftY * p}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Circle reveal: clip-path circle growing from a point. */
const CircleReveal: React.FC<{
  children: React.ReactNode;
  cx?: number;
  cy?: number;
  start?: number; // frames
  dur?: number; // frames
  maxR?: number;
}> = ({ children, cx = 960, cy = 540, start = 0, dur = 26, maxR = 1500 }) => {
  const frame = useCurrentFrame();
  const r = interpolate(frame, [start, start + dur], [0, maxR], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

/** Pill (horizontal) reveal growing from center like KV 2. */
const PillReveal: React.FC<{
  children: React.ReactNode;
  start?: number;
  dur?: number;
}> = ({ children, start = 0, dur = 28 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  // inset from 540/960 (collapsed) to negative (over-cover), round 540
  const insetY = interpolate(p, [0, 1], [500, -300]);
  const insetX = interpolate(p, [0, 1], [700, -600]);
  return (
    <AbsoluteFill
      style={{ clipPath: `inset(${insetY}px ${insetX}px round 999px)` }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Pop: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  fromY?: number;
}> = ({ children, delay = 0, style, fromY = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const o = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        ...style,
        opacity: o,
        transform: `translateY(${(1 - s) * fromY}px) scale(${0.85 + 0.15 * s})`,
      }}
    >
      {children}
    </div>
  );
};

const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number }> = ({
  children,
  size = 220,
  color = C.white,
  weight = 700,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: weight,
      fontSize: size,
      color,
      lineHeight: 0.95,
      letterSpacing: -4,
    }}
  >
    {children}
  </div>
);

// Shaped photo card (circle / rounded square / pill) used in the triptych
const Shaped: React.FC<{
  src: string;
  shape: "circle" | "square" | "pill";
  w: number;
  h: number;
  x: number;
  y: number;
  delay: number;
  rise?: number; // extra translateY (negative = up) applied after `riseAt`
  riseAt?: number;
}> = ({ src, shape, w, h, x, y, delay, rise = 0, riseAt = 9999 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 110 } });
  const r = spring({ frame: frame - riseAt, fps, config: { damping: 16, stiffness: 90 } });
  const radius = shape === "circle" ? "50%" : shape === "pill" ? 999 : 60;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + rise * r,
        width: w,
        height: h,
        borderRadius: radius,
        overflow: "hidden",
        transform: `scale(${0.6 + 0.4 * s})`,
        opacity: s,
        boxShadow: "0 30px 80px rgba(120,30,10,0.25)",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${1.05 + 0.08 * Math.min(1, frame / 150)})`,
        }}
      />
    </div>
  );
};

// ---------- Scenes ----------

// 0.0–3.7 "O seller que chega ao Trends quase sempre começou sozinho."
const S0: React.FC = () => (
  <AbsoluteFill style={{ background: C.orange }}>
    <CircleReveal cx={560} cy={540} dur={30}>
      <Photo src="gen/c01.jpg" from={1.1} to={1.0} />
    </CircleReveal>
  </AbsoluteFill>
);

// 3.7–5.1 "Aprendeu fazendo,"
const S1: React.FC = () => (
  <AbsoluteFill style={{ background: C.red }}>
    <Photo src="gen/c02.jpg" from={1.0} to={1.08} driftX={-20} />
  </AbsoluteFill>
);

// 5.1–6.5 "entre um pedido e outro."
const S2: React.FC = () => (
  <AbsoluteFill style={{ background: C.red }}>
    <Photo src="gen/c10.jpg" from={1.08} to={1.0} driftY={10} />
  </AbsoluteFill>
);

// 6.5–8.6 "O que ele quer agora é crescer."
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blob = spring({ frame, fps, config: { damping: 18, stiffness: 60 } });
  return (
    <AbsoluteFill style={{ background: C.orange }}>
      {/* KV3-style growing ellipse */}
      <div
        style={{
          position: "absolute",
          left: 1320,
          top: 160,
          width: 760,
          height: 760,
          borderRadius: "50%",
          background: `linear-gradient(90deg, ${C.salmon}, rgba(237,77,45,0))`,
          transform: `scale(${0.2 + 0.8 * blob})`,
          transformOrigin: "20% 50%",
          opacity: 0.9,
        }}
      />
      <div style={{ position: "absolute", left: 130, top: 300 }}>
        <Pop delay={0} fromY={30}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: 64,
              color: C.white,
              marginBottom: 20,
            }}
          >
            O que ele quer agora é
          </div>
        </Pop>
        <Pop delay={sec(0.95)} fromY={120}>
          <Big size={300}>crescer.</Big>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

// 8.6–12.9 "Vender mais, ganhar espaço, transformar a loja em marca."
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // KV 4 composition: rounded square (left) + circle (right)
  const sq = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const ci = spring({ frame: frame - sec(1.0), fps, config: { damping: 14, stiffness: 100 } });
  // at 2.1s ("transformar") the circle expands to full-bleed
  const full = interpolate(frame, [sec(2.1), sec(2.7)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const r = interpolate(full, [0, 1], [345, 1500]);
  const cx = interpolate(full, [0, 1], [1305, 960]);
  const cy = interpolate(full, [0, 1], [540, 540]);
  return (
    <AbsoluteFill style={{ background: C.orange }}>
      <div
        style={{
          position: "absolute",
          left: 270,
          top: 190,
          width: 705,
          height: 700,
          borderRadius: 70,
          overflow: "hidden",
          transform: `translateX(${(1 - sq) * -900}px)`,
        }}
      >
        <Img
          src={staticFile("gen/c03.jpg")}
          style={{
            width: "140%",
            height: "100%",
            objectFit: "cover",
            marginLeft: "-20%",
            transform: `scale(${1 + 0.05 * Math.min(1, frame / 90)})`,
          }}
        />
      </div>
      <AbsoluteFill
        style={{
          clipPath: `circle(${r * (0.2 + 0.8 * ci)}px at ${cx}px ${cy}px)`,
          opacity: ci,
        }}
      >
        <AbsoluteFill style={{ transform: `translate(${(1 - full) * 560}px, ${(1 - full) * 200}px) scale(${1 + (1 - full) * 0.15})` }}>
          <Photo src="gen/c04.jpg" from={1.0} to={1.1} />
        </AbsoluteFill>
      </AbsoluteFill>
      {/* "marca" stamp */}
      <Pop delay={sec(3.3)} fromY={40} style={{ position: "absolute", left: 130, bottom: 110 }}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 150,
            color: C.white,
            letterSpacing: -3,
            textShadow: "0 10px 40px rgba(0,0,0,0.25)",
          }}
        >
          loja → marca
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

// 12.9–19.6 "E crescer tem uma ordem. Primeiro se aparece, depois se vende, só então se cresce."
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    { t: 1.95, label: "aparece", d: 230, x: 330, y: 540 },
    { t: 3.3, label: "vende", d: 400, x: 820, y: 540 },
    { t: 4.7, label: "cresce", d: 620, x: 1480, y: 540 },
  ];
  // final expansion of the big circle to cover screen (transition to stage)
  const expand = interpolate(frame, [sec(6.2), sec(6.7)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ background: C.red }}>
      <Pop delay={0} fromY={20} style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 60, color: C.white, opacity: 0.95 }}>
          crescer tem uma ordem
        </div>
      </Pop>
      {steps.map((st, i) => {
        const s = spring({ frame: frame - sec(st.t), fps, config: { damping: 12, stiffness: 140 } });
        const dd = st.d * (0.3 + 0.7 * s) + (i === 2 ? expand * 3200 : 0);
        return (
          <React.Fragment key={st.label}>
            <div
              style={{
                position: "absolute",
                left: st.x - dd / 2,
                top: st.y - dd / 2,
                width: dd,
                height: dd,
                borderRadius: "50%",
                background: `linear-gradient(90deg, #FFFFFF 0%, ${C.salmon} 100%)`,
                opacity: s,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: st.x - 300,
                width: 600,
                top: st.y + st.d / 2 + 30,
                textAlign: "center",
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 72,
                color: C.white,
                opacity: s * (1 - expand),
                transform: `translateY(${(1 - s) * 30}px)`,
              }}
            >
              {i + 1}. {st.label}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// 19.6–24.0 "É o caminho que ele já percorre com a Shopee, e é o caminho que o Trends coloca de pé."
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <AbsoluteFill style={{ opacity: o }}>
        <Photo src="gen/c05.jpg" from={1.0} to={1.12} driftY={-8} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 24.0–30.9 "Cada palco, cada conversa com especialista, cada ferramenta apresentada é um passo dessa ordem."
const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const riseAt = sec(5.0);
  const labels = [
    { t: 0.1, text: "palco", x: 120 },
    { t: 1.5, text: "conversa", x: 735 },
    { t: 3.5, text: "ferramenta", x: 1355 },
  ];
  return (
    <AbsoluteFill style={{ background: C.orange }}>
      <Shaped src="gen/c05.jpg" shape="pill" w={560} h={420} x={100} y={330} delay={sec(0.1)} rise={160} riseAt={riseAt} />
      <Shaped src="gen/c06.jpg" shape="square" w={520} h={520} x={700} y={280} delay={sec(1.5)} rise={0} riseAt={riseAt} />
      <Shaped src="gen/c03.jpg" shape="circle" w={560} h={560} x={1280} y={260} delay={sec(3.5)} rise={-160} riseAt={riseAt} />
      {labels.map((l) => {
        const o = interpolate(frame, [sec(l.t) + 6, sec(l.t) + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const hide = interpolate(frame, [riseAt, riseAt + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={l.text}
            style={{
              position: "absolute",
              left: l.x,
              top: 880,
              width: 520,
              textAlign: "center",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 64,
              color: C.white,
              opacity: o * hide,
            }}
          >
            {l.text}
          </div>
        );
      })}
      <Pop delay={riseAt + 4} fromY={30} style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 56, color: C.white }}>
          um passo de cada vez, na ordem certa
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

// 30.9–34.5 "Do MEI que abriu a loja ontem, à loja que já tem equipe."
const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [sec(1.9), sec(2.4)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  // diagonal wipe from the right revealing the team photo
  const x1 = interpolate(split, [0, 1], [2100, 1000]);
  const x2 = interpolate(split, [0, 1], [2300, 820]);
  return (
    <AbsoluteFill style={{ background: C.red }}>
      <Photo src="gen/c01.jpg" from={1.0} to={1.08} driftX={10} />
      <AbsoluteFill style={{ clipPath: `polygon(${x1}px 0, 2200px 0, 2200px 1080, ${x2}px 1080)` }}>
        <Photo src="gen/c08.jpg" from={1.08} to={1.0} />
      </AbsoluteFill>
      {/* thin orange divider */}
      <div
        style={{
          position: "absolute",
          left: x1 - 12,
          top: -40,
          width: 24,
          height: 1200,
          background: C.orange,
          transform: `skewX(${Math.atan2(180, 1080) * (180 / Math.PI)}deg)`,
          transformOrigin: "top left",
          opacity: split,
        }}
      />
    </AbsoluteFill>
  );
};

// 34.5–38.1 "Todo mundo que atravessa estas portas tem o mesmo destino."
const S9: React.FC = () => (
  <AbsoluteFill style={{ background: C.orange }}>
    <PillReveal dur={26}>
      <Photo src="gen/c07.jpg" from={1.0} to={1.1} driftY={-6} />
    </PillReveal>
  </AbsoluteFill>
);

// 38.1–41.9 "Sem promessa de número. É o motivo deste evento existir,"
const S10: React.FC = () => (
  <AbsoluteFill style={{ background: C.orange }}>
    <Photo src="gen/c09.jpg" from={1.0} to={1.08} />
  </AbsoluteFill>
);

// 41.9–44.6 "e o motivo de cada seller estar aqui."
const S11: React.FC = () => {
  const faces = [
    { src: "gen/c03.jpg", t: 0.0, cx: 480, cy: 540 },
    { src: "gen/c04.jpg", t: 0.55, cx: 1440, cy: 540 },
    { src: "gen/c08.jpg", t: 1.1, cx: 960, cy: 300 },
    { src: "gen/c10.jpg", t: 1.65, cx: 960, cy: 700 },
    { src: "gen/c07.jpg", t: 2.15, cx: 960, cy: 540 },
  ];
  return (
    <AbsoluteFill style={{ background: C.orange }}>
      {faces.map((f) => (
        <Sequence key={f.src} from={sec(f.t)} layout="none">
          <CircleReveal cx={f.cx} cy={f.cy} dur={14} maxR={1400}>
            <Photo src={f.src} from={1.15} to={1.0} />
          </CircleReveal>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// 44.6–48.7 "Shopee Trends 2027. Feito para crescer." — build KV 2 live
const S12: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pill = spring({ frame, fps, config: { damping: 16, stiffness: 70, mass: 1.1 } });
  const logo = spring({ frame: frame - sec(0.12), fps, config: { damping: 13, stiffness: 120 } });
  const tagline = interpolate(frame, [sec(2.2), sec(2.6)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  // KV2 pill geometry: left 345, top 185, width 1235, height 710
  const w = 1235 * (0.35 + 0.65 * pill);
  const h = 710 * (0.35 + 0.65 * pill);
  const cx = 345 + 1235 / 2;
  const cy = 185 + 710 / 2;
  return (
    <AbsoluteFill style={{ background: C.orange }}>
      <div
        style={{
          position: "absolute",
          left: cx - w / 2,
          top: cy - h / 2,
          width: w,
          height: h,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${C.navyDeep} 0%, ${C.navy} 60%, ${C.navy} 100%)`,
          opacity: Math.min(1, pill * 2),
        }}
      />
      <Img
        src={staticFile("kv/logo_white.png")}
        style={{
          position: "absolute",
          left: 90,
          top: 410,
          width: 435,
          transform: `scale(${0.7 + 0.3 * logo})`,
          transformOrigin: "left center",
          opacity: logo,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 995,
          top: 500,
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 62,
          color: C.white,
          opacity: tagline,
          transform: `translateY(${(1 - tagline) * 24}px)`,
          whiteSpace: "nowrap",
        }}
      >
        Feito para crescer
      </div>
    </AbsoluteFill>
  );
};

// 48.7–53.0: carousel through the KV family, one into the other
const S13: React.FC = () => {
  const order = [
    { src: "kv/1.png", cx: 960, cy: 540 },
    { src: "kv/3.png", cx: 540, cy: 540 },
    { src: "kv/4.png", cx: 1300, cy: 540 },
    { src: "kv/5.png", cx: 700, cy: 500 },
    { src: "kv/2.png", cx: 960, cy: 540 },
  ];
  const kvs = [...order, ...order].map((k, i) => ({ ...k, t: i * 0.42, key: `${k.src}-${i}` }));
  return (
    <AbsoluteFill style={{ background: C.orange }}>
      <Img src={staticFile("kv/2.png")} style={{ width: "100%", height: "100%" }} />
      {kvs.map((k) => (
        <Sequence key={k.key} from={sec(k.t)} layout="none">
          <CircleReveal cx={k.cx} cy={k.cy} dur={10} maxR={1500}>
            <Img src={staticFile(k.src)} style={{ width: "100%", height: "100%" }} />
          </CircleReveal>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ---------- Main ----------
export const ShopeeTrendsVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.orange, fontFamily: FONT }}>
      <Audio src={staticFile("audio/locucao.mp3")} />
      <Seq from={0} to={3.7} name="S0 sozinho"><S0 /></Seq>
      <Seq from={3.7} to={5.1} name="S1 aprendeu"><S1 /></Seq>
      <Seq from={5.1} to={6.5} name="S2 pedido"><S2 /></Seq>
      <Seq from={6.5} to={8.6} name="S3 crescer"><S3 /></Seq>
      <Seq from={8.6} to={12.9} name="S4 loja marca"><S4 /></Seq>
      <Seq from={12.9} to={19.6} name="S5 ordem"><S5 /></Seq>
      <Seq from={19.6} to={24.0} name="S6 palco"><S6 /></Seq>
      <Seq from={24.0} to={30.9} name="S7 triptico"><S7 /></Seq>
      <Seq from={30.9} to={34.5} name="S8 MEI equipe"><S8 /></Seq>
      <Seq from={34.5} to={38.1} name="S9 portas"><S9 /></Seq>
      <Seq from={38.1} to={41.9} name="S10 retrato"><S10 /></Seq>
      <Seq from={41.9} to={44.6} name="S11 sellers"><S11 /></Seq>
      <Seq from={44.6} to={48.7} name="S12 KV build"><S12 /></Seq>
      <Seq from={48.7} to={DURATION_SECONDS} name="S13 KV carousel"><S13 /></Seq>
    </AbsoluteFill>
  );
};
