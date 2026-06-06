import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import styles from "./MathOption.module.css";

export const MathOption = ({ text, index, isRevealPhase, isCorrect }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación de entrada inicial para cada opción (escalonada por index)
  const entryDelay = 10 + (index * 5); // Aparecen muy rápido después de la ecuación
  
  const entrySpring = spring({
    frame: frame - entryDelay,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 100 }
  });

  // Animación si es la fase de revelación y es la correcta
  const highlightSpring = spring({
    frame: isRevealPhase && isCorrect ? frame : 0,
    fps,
    config: { damping: 8, mass: 0.6, stiffness: 150 }
  });

  const entryScale = interpolate(entrySpring, [0, 1], [0.5, 1]);
  const highlightScale = interpolate(highlightSpring, [0, 1], [1, 1.25]);
  
  // Combinamos las escalas (primero entra, luego en la fase reveal si es correcta se hace un pop)
  const finalScale = isRevealPhase && isCorrect ? highlightScale : entryScale;

  // Clase adicional si es revelado y es correcto
  const containerClass = `${styles.optionContainer} ${isRevealPhase && isCorrect ? styles.correctOption : ""}`;

  return (
    <div
      className={containerClass}
      style={{
        transform: `scale(${finalScale})`,
        opacity: entrySpring,
      }}
    >
      <p className={styles.optionText}>{text}</p>
    </div>
  );
};
