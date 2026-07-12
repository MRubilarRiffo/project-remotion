import { useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { Audio } from "@remotion/media";
import styles from "./Timer.module.css";

export const Timer = ({ startFrame, durationSeconds = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = durationSeconds * fps;
  const relFrame = frame - startFrame;

  if (relFrame < 0 || relFrame >= totalFrames) {
    return null;
  }

  const secondsLeft = Math.max(1, durationSeconds - Math.floor(relFrame / fps));
  const frameInSecond = relFrame % fps;

  const pulseSpring = spring({
    frame: frameInSecond,
    fps,
    config: {
      damping: 10,
      mass: 0.3,
      stiffness: 200,
    },
  });

  const scale = interpolate(pulseSpring, [0, 1], [0.9, 1.15]);

  const circleRadius = 75;
  const circumference = 2 * Math.PI * circleRadius;
  const progressPercent = 1 - relFrame / totalFrames;
  const strokeDashoffset = circumference * (1 - progressPercent);

  const soundFrames = Array.from({ length: durationSeconds }, (_, i) => startFrame + i * fps);

  return (
    <div className={styles.timerContainer} style={{ transform: `scale(${scale})` }}>
      {soundFrames.map((tickFrame, index) => (
        <Sequence key={index} from={tickFrame} durationInFrames={30} layout="none">
          <Audio src="https://remotion.media/ding.wav" volume={0.6} />
        </Sequence>
      ))}

      <svg width="180" height="180">
        <circle
          className={styles.circleBackground}
          cx="90"
          cy="90"
          r={circleRadius}
        />
        <circle
          className={styles.circleProgress}
          cx="90"
          cy="90"
          r={circleRadius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      
      <div className={styles.innerCircle}>
        <span className={styles.number}>{secondsLeft}</span>
      </div>
    </div>
  );
};
