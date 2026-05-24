import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import styles from "./IntroScene.module.css";

export const IntroScene = ({ title, emoji }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada: frame 0 a 30
  const introSpring = spring({
    frame,
    fps,
    config: {
      damping: 10,
      mass: 0.5,
      stiffness: 120,
    },
  });

  // Salida: frame 75 a 90
  const outroSpring = spring({
    frame: frame - 75,
    fps,
    config: {
      damping: 12,
      mass: 0.6,
      stiffness: 140,
    },
  });

  // Escala total combinada (entra rebota y luego se achica)
  const scale = introSpring * (1 - outroSpring);

  // Eje Y: cae del cielo y sale disparado al cielo o hacia abajo
  // Cuando entra, va de -800 a 0. Al salir, va de 0 a 1000.
  const translateY = interpolate(introSpring, [0, 1], [-800, 0]) + 
                     interpolate(outroSpring, [0, 1], [0, 1200]);

  // Rotación leve de entrada
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
        <span className={styles.emoji}>{emoji || "🌎"}</span>
        <h1 className={styles.titleText}>{title || "Adivina el País"}</h1>
        <span className={styles.subtitle}>¡A jugar! 🎮</span>
      </div>
    </div>
  );
};
