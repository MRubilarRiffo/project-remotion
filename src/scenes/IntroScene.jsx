import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import styles from "./IntroScene.module.css";

export const IntroScene = ({ hookText, emoji }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada más rápida: frame 0 a 15
  const introSpring = spring({
    frame,
    fps,
    config: {
      damping: 10,
      mass: 0.4,
      stiffness: 150,
    },
  });

  // Salida rápida: frame 60 a 75
  const outroSpring = spring({
    frame: frame - 60,
    fps,
    config: {
      damping: 12,
      mass: 0.5,
      stiffness: 180,
    },
  });

  const scale = introSpring * (1 - outroSpring);

  const translateY = interpolate(introSpring, [0, 1], [-800, 0]) + 
                     interpolate(outroSpring, [0, 1], [0, 1200]);

  const rotate = interpolate(introSpring, [0, 1], [-15, 0]) + 
                 interpolate(outroSpring, [0, 1], [0, 25]);

  return (
    <div className={styles.container}>
      <div 
        className={styles.titleContainer}
        style={{
          transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
          opacity: scale,
        }}
      >
        <h1 className={styles.titleText}>{hookText || "¡Sólo el 1% adivina el país! 🌎"}</h1>
        <span className={styles.subtitle}>¿Serás capaz? 🔥</span>
      </div>
    </div>
  );
};
