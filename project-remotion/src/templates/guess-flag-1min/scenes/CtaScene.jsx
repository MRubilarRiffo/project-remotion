import { useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from "remotion";
import styles from "./CtaScene.module.css";

export const CtaScene = ({ ctaText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación del título de CTA (entrada rápida con rebote)
  const ctaSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 150 }
  });

  // Animación de pulso continuo (latido)
  const pulse = 1 + Math.sin(frame / 5) * 0.05;
  const finalScale = ctaSpring * pulse;

  return (
    <div className={styles.container}>
      {/* Sonido llamativo al mostrar el CTA */}
      <Audio src="https://remotion.media/ding.wav" volume={0.8} />

      <h1 
        className={styles.ctaText}
        style={{
          transform: `scale(${finalScale})`,
          opacity: ctaSpring
        }}
      >
        {ctaText || "¡Comenta tu respuesta! 👇"}
      </h1>
      
      <h2 
        className={styles.ctaSubText}
        style={{
          transform: `translateY(${interpolate(ctaSpring, [0, 1], [100, 0])}px)`,
          opacity: ctaSpring
        }}
      >
        ¡Síguenos para más! ➕
      </h2>
    </div>
  );
};
