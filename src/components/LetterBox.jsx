import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import styles from "./LetterBox.module.css";

export const LetterBox = ({ char, revealedChar, isRevealed, index, revealFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación de entrada inicial del casillero (en la escena del Quiz)
  // El casillero aparece en el frame 100 con un desfase (stagger) de 3 frames por letra
  const introDelay = 100 + index * 4;
  const introSpring = spring({
    frame: frame - introDelay,
    fps,
    config: {
      damping: 10,
      mass: 0.5,
      stiffness: 120,
    },
  });

  // Animación cuando se revela la letra oculta
  // Ocurre a partir del revealFrame (por ejemplo, frame 270), con un desfase
  const revealDelay = revealFrame + index * 5;
  const revealSpring = spring({
    frame: frame - revealDelay,
    fps,
    config: {
      damping: 8,
      mass: 0.4,
      stiffness: 150,
    },
  });

  // Si la letra es visible desde el principio
  const isInitiallyVisible = char !== "_";

  // Determinar si debemos pintar la casilla como revelada en este frame específico
  const showAsRevealed = isInitiallyVisible || (isRevealed && frame >= revealDelay);

  // Escala final combinada
  let scale = introSpring; // Empieza en 0 y va a 1
  if (!isInitiallyVisible && isRevealed && frame >= revealFrame) {
    // Si era oculta y se está revelando, hacemos un pop adicional
    scale = revealSpring;
  }

  // Rotación divertida para estilo infantil
  const rotation = (index % 2 === 0 ? 3 : -3) * (1 - scale);

  return (
    <div
      className={`${styles.box} ${showAsRevealed ? styles.revealed : styles.hidden}`}
      style={{
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        opacity: scale,
      }}
    >
      <span className={styles.charText}>
        {showAsRevealed ? revealedChar : ""}
      </span>
    </div>
  );
};
