import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import styles from "./IntroScene.module.css";

export const IntroScene = ({ hookText, emoji }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada más rápida: frame 0 a 15 con pop-in agresivo
  const introSpring = spring({
    frame,
    fps,
    config: {
      damping: 10,
      mass: 0.4,
      stiffness: 150,
    },
  });

  const scale = introSpring;
  const translateY = interpolate(introSpring, [0, 1], [-800, 0]);
  const rotate = interpolate(introSpring, [0, 1], [-15, 0]);

  // Movimiento dinámico continuo para que el fondo no sea estático
  const bgScale = 1 + (frame * 0.002);
  const bgRotate = frame * 0.05;

  return (
    <div 
      className={styles.container}
      style={{
        transform: `scale(${bgScale}) rotate(${bgRotate}deg)`
      }}
    >
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
