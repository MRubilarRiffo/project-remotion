import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, Audio } from "remotion";
import { LetterBox } from "../components/LetterBox";
import { Confetti } from "../components/Confetti";
import styles from "./RevealScene.module.css";

export const RevealScene = ({ flagUrl, hint, answer, funFact }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación del título de felicitaciones (bounce rápido)
  const congratsSpring = spring({
    frame,
    fps,
    config: { damping: 7, mass: 0.4, stiffness: 180 }
  });

  // Animación de la bandera haciendo un pequeño salto
  const flagSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 9, mass: 0.5, stiffness: 140 }
  });
  const flagScale = interpolate(flagSpring, [0, 1], [0.8, 1.05]) + 
                    Math.sin(frame / 6) * (frame < 60 ? 0.03 : 0); // Pequeña vibración inicial

  // Animación de entrada de la tarjeta de Fun Fact
  const cardSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 11, mass: 0.6, stiffness: 110 }
  });

  // Limpiar espacios
  const cleanHint = hint.replace(/\s+/g, "");
  const cleanAnswer = answer.replace(/\s+/g, "");

  return (
    <div className={styles.container}>
      {/* Sonido de Éxito al entrar a la escena */}
      <Audio src="https://remotion.media/ding.wav" volume={0.8} playbackRate={1.2} />

      {/* Confetti explota de inmediato en frame 0 */}
      <Confetti startFrame={0} />

      {/* ¡FELICITACIONES! */}
      <h1 
        className={styles.congratsText}
        style={{
          transform: `scale(${congratsSpring}) rotate(${interpolate(congratsSpring, [0, 1], [-8, 0])}deg)`,
          opacity: congratsSpring
        }}
      >
        ¡CORRECTO! 🎉
      </h1>

      {/* Bandera con escala de celebración */}
      <div 
        className={styles.flagFrameCelebrate}
        style={{
          transform: `scale(${flagScale})`,
          opacity: congratsSpring
        }}
      >
        <Img src={flagUrl} className={styles.flagImage} />
      </div>

      {/* Casilleros de letras - Todos revelados */}
      <div className={styles.lettersContainer}>
        {cleanHint.split("").map((char, index) => (
          <LetterBox
            key={index}
            char={char}
            revealedChar={cleanAnswer[index]}
            isRevealed={true} // Forzar revelación
            index={index}
            revealFrame={0} // Se revela al inicio de la escena de inmediato
            initialIntroDelay={0} // No animar la entrada del contenedor, ya está ahí
          />
        ))}
      </div>

      {/* Tarjeta de Fun Fact */}
      {funFact && (
        <div 
          className={styles.funFactCard}
          style={{
            transform: `translateY(${interpolate(cardSpring, [0, 1], [400, 0])}px) scale(${cardSpring})`,
            opacity: cardSpring
          }}
        >
          <h3 className={styles.funFactTitle}>¿Sabías que...? 🤔</h3>
          <p className={styles.funFactText}>{funFact}</p>
        </div>
      )}
    </div>
  );
};
