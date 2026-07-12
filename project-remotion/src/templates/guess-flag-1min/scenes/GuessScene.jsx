import { useCurrentFrame, useVideoConfig, spring, Img } from "remotion";
import { Timer } from "../components/Timer";
import { LetterHint } from "../components/LetterHint";
import styles from "./GuessScene.module.css";

export const GuessScene = ({ hookText, flagUrl, hint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation for hook text
  const hookSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 150 }
  });

  // Entrance animation for the flag image
  const flagSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 }
  });

  // Entrance animation for letter hint
  const hintSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 150 }
  });

  return (
    <div className={styles.container}>
      {/* Top Hook Text */}
      <div
        className={styles.hookContainer}
        style={{
          transform: `scale(${hookSpring})`,
          opacity: hookSpring
        }}
      >
        <h1 className={styles.hookText}>{hookText}</h1>
      </div>

      {/* Flag Image */}
      <div
        className={styles.flagContainer}
        style={{
          transform: `scale(${flagSpring})`,
          opacity: flagSpring
        }}
      >
        <Img src={flagUrl} className={styles.flagImage} />
      </div>

      {/* Letter Hint Boxes */}
      <div
        style={{
          transform: `translateY(${100 - hintSpring * 100}px)`,
          opacity: hintSpring
        }}
      >
        <LetterHint hint={hint} />
      </div>

      {/* Timer (Bottom Right or Centered) */}
      <div className={styles.timerWrapper}>
        <Timer startFrame={30} durationSeconds={3} />
      </div>
    </div>
  );
};
