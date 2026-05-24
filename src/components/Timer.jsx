import { useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { Audio } from "@remotion/media";
import styles from "./Timer.module.css";

export const Timer = ({ startFrame, durationSeconds = 5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = durationSeconds * fps; // 150 frames
  const relFrame = frame - startFrame;

  // Si no ha empezado o ya terminó, no mostrar nada
  if (relFrame < 0 || relFrame >= totalFrames) {
    return null;
  }

  // Calcular segundos restantes (ej. de 5 a 1)
  const secondsLeft = Math.max(1, durationSeconds - Math.floor(relFrame / fps));

  // Calcular fotograma dentro del segundo actual (de 0 a 29)
  const frameInSecond = relFrame % fps;

  // Animación del pulso (heartbeat) de escala usando spring
  // Se reinicia cada segundo
  const pulseSpring = spring({
    frame: frameInSecond,
    fps,
    config: {
      damping: 10,
      mass: 0.3,
      stiffness: 200,
    },
  });

  // Mapeamos el spring para que vaya de 0.9 a 1.25 y regrese a 1
  const scale = interpolate(pulseSpring, [0, 1], [0.9, 1.15]);

  // Progreso circular
  const circleRadius = 75;
  const circumference = 2 * Math.PI * circleRadius;
  const progressPercent = 1 - relFrame / totalFrames;
  const strokeDashoffset = circumference * (1 - progressPercent);

  // Generar secuencias para los ticks de sonido
  const soundFrames = Array.from({ length: durationSeconds }, (_, i) => startFrame + i * fps);

  return (
    <div className={styles.timerContainer} style={{ transform: `scale(${scale})` }}>
      {/* Sonidos de cuenta regresiva (Tirados en secuencias de 1 frame para activarse) */}
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
