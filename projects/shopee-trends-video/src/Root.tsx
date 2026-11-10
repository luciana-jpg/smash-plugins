import { Composition } from "remotion";
import { ShopeeTrendsVideo, FPS, DURATION_SECONDS } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShopeeTrends"
        component={ShopeeTrendsVideo}
        durationInFrames={Math.round(DURATION_SECONDS * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
