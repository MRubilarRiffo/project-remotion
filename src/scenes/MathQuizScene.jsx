import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio, Sequence } from "remotion";
import { MathOption } from "../components/MathOption";
import { Timer } from "../components/Timer";
import styles from "./MathQuizScene.module.css";

export const MathQuizScene = ({ categoryTitle, equation, options }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animaciones de entrada específicas para esta escena
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 100 }
  });

  const equationSpring = spring({
    frame: frame - 5, // Aparece muy rápido (5 frames)
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 120 }
  });

  // El temporizador de 3s inicia en el frame 15 (0.5 segundos)
  const timerStartFrame = 15;
  const durationSeconds = 3;
  
  // Creamos un array de ticks para 3 segundos
  const ticks = new Array(durationSeconds).fill(true);

  return (
    <div className={styles.container}>
      {/* Título de la Categoría */}
      <h2 
        className={styles.categoryTitle}
        style={{
          transform: `scale(${titleSpring}) translateY(${interpolate(titleSpring, [0, 1], [-100, 0])}px)`,
          opacity: titleSpring
        }}
      >
        {categoryTitle || "🧠 RETO MATEMÁTICO"}
      </h2>

      {/* Ecuación en lugar de la imagen de la bandera */}
      <div 
        className={styles.equationContainer}
        style={{
          transform: `scale(${equationSpring})`,
          opacity: equationSpring
        }}
      >
        <p className={styles.equationText}>{equation}</p>
      </div>

      {/* Alternativas */}
      <div className={styles.optionsContainer}>
        {options.map((opt, index) => (
          <MathOption 
            key={index}
            text={opt}
            index={index}
            isRevealPhase={false}
            isCorrect={false}
          />
        ))}
      </div>

      {/* Temporizador circular */}
      <div className={styles.timerWrapper}>
        <Timer startFrame={timerStartFrame} durationSeconds={durationSeconds} />
      </div>

      {/* Sonidos de reloj (Tick-Tock simulado con pops suaves) */}
      {ticks.map((_, index) => (
        <Sequence key={index} from={timerStartFrame + index * fps} durationInFrames={fps} layout="none">
          <Audio src="https://remotion.media/mouse-click.wav" volume={0.3} playbackRate={1.2} />
        </Sequence>
      ))}
    </div>
  );
};
