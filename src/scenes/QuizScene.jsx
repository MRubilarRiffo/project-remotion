import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, Audio, Sequence } from "remotion";
import { LetterBox } from "../components/LetterBox";
import { Timer } from "../components/Timer";
import styles from "./QuizScene.module.css";

export const QuizScene = ({ flagUrl, hint, answer, categoryTitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animaciones de entrada específicas para esta escena
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 100 }
  });

  const flagSpring = spring({
    frame: frame - 15, // Aparece 15 frames después
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 120 }
  });

  // Limpiar espacios de hint y answer para mapearlos uno a uno
  const cleanHint = hint.replace(/\s+/g, "");
  const cleanAnswer = answer.replace(/\s+/g, "");

  // El temporizador de 5s inicia en el frame 30 (1 segundo después de entrar a esta escena)
  const timerStartFrame = 30;

  // Creamos un array de 8 ticks para que suenen cada segundo
  const ticks = new Array(8).fill(true);

  return (
    <div className={styles.container}>
      {/* Título de la Categoría */}
      <h2 
        className={styles.hintTitle}
        style={{
          transform: `scale(${titleSpring}) translateY(${interpolate(titleSpring, [0, 1], [-100, 0])}px)`,
          opacity: titleSpring
        }}
      >
        {categoryTitle || "¿QUÉ PAÍS ES?"}
      </h2>

      {/* Imagen / Bandera en su marco animado */}
      <div 
        className={styles.flagFrame}
        style={{
          transform: `scale(${flagSpring}) rotate(${interpolate(flagSpring, [0, 1], [-10, 0])}deg)`,
          opacity: flagSpring
        }}
      >
        <Img src={flagUrl} className={styles.flagImage} />
      </div>

      {/* Casilleros de letras */}
      <div className={styles.lettersContainer}>
        {cleanHint.split("").map((char, index) => (
          <LetterBox
            key={index}
            char={char}
            revealedChar={cleanAnswer[index]}
            isRevealed={false} // En la escena del Quiz todavía no se revelan las letras ocultas
            index={index}
            revealFrame={180} // No importa aquí ya que no se revelan
          />
        ))}
      </div>

      {/* Temporizador circular */}
      <div className={styles.timerWrapper}>
        <Timer startFrame={timerStartFrame} durationSeconds={8} />
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
