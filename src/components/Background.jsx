import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import styles from "./Background.module.css";

const BUBBLE_PRESETS = [
  { id: 1, size: 120, startX: 10, startY: 110, endY: -20, speed: 25, amp: 40, phase: 0 },
  { id: 2, size: 180, startX: 30, startY: 120, endY: -30, speed: 30, amp: 60, phase: 1.5 },
  { id: 3, size: 90, startX: 55, startY: 105, endY: -15, speed: 20, amp: 30, phase: 3 },
  { id: 4, size: 220, startX: 75, startY: 130, endY: -40, speed: 35, amp: 80, phase: 4.5 },
  { id: 5, size: 150, startX: 90, startY: 115, endY: -25, speed: 28, amp: 50, phase: 2 },
  { id: 6, size: 100, startX: 20, startY: 140, endY: -20, speed: 22, amp: 45, phase: 0.8 },
  { id: 7, size: 140, startX: 45, startY: 150, endY: -30, speed: 27, amp: 55, phase: 3.7 },
  { id: 8, size: 200, startX: 85, startY: 160, endY: -50, speed: 32, amp: 70, phase: 5.1 }
];

export const Background = ({ colorTheme }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Cambiar el gradiente según la categoría o tema si se pasa
  const getGradientStyle = () => {
    switch (colorTheme) {
      case "animales": // Verde salvaje / amarillo alegre
        return { background: "linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)" };
      case "frutas": // Rojo sandía / amarillo piña
        return { background: "linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)" };
      case "capitales": // Azul cielo / violeta espacial
        return { background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" };
      default: // Adivina el país (por defecto): Rosa / Coral infantil
        return { background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" };
    }
  };

  return (
    <div className={styles.container} style={getGradientStyle()}>
      <div className={styles.gridPattern} />
      <div className={styles.gradientOverlay} />
      
      {BUBBLE_PRESETS.map((bubble) => {
        // Interpola la posición vertical desde startY hasta endY
        const yPos = interpolate(
          frame,
          [0, durationInFrames],
          [bubble.startY, bubble.endY],
          { extrapolateRight: "clamp" }
        );

        // Agrega una oscilación senoidal horizontal (sway)
        const xOffset = Math.sin((frame / bubble.speed) + bubble.phase) * bubble.amp;
        const xPos = `calc(${bubble.startX}% + ${xOffset}px)`;

        return (
          <div
            key={bubble.id}
            className={styles.bubble}
            style={{
              width: bubble.size,
              height: bubble.size,
              top: `${yPos}%`,
              left: xPos,
            }}
          />
        );
      })}
    </div>
  );
};
