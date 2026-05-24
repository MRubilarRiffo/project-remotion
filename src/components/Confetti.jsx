import { useCurrentFrame, useVideoConfig, random, AbsoluteFill } from "remotion";

const NUM_PARTICLES = 65;
const COLORS = ["#FF5722", "#4CAF50", "#FFEB3B", "#00BCD4", "#E91E63", "#9C27B0", "#FF9800", "#3F51B5"];

export const Confetti = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const relFrame = frame - startFrame;

  // No renderizar si no ha empezado la explosión
  if (relFrame < 0) {
    return null;
  }

  // Generación determinista de partículas utilizando la semilla `random` de Remotion
  const particles = Array.from({ length: NUM_PARTICLES }).map((_, index) => {
    const seed = `confetti-${index}`;
    
    // Posición inicial en X (repartida por todo el ancho de la pantalla)
    const startX = random(`${seed}-x`) * width;
    
    // Empezar ligeramente arriba de la pantalla
    const startY = -50 - random(`${seed}-y`) * 150;
    
    // Velocidad de caída
    const speedY = 5 + random(`${seed}-speedY`) * 10;
    
    // Gravedad de caída
    const gravity = 0.15 + random(`${seed}-gravity`) * 0.15;
    
    // Velocidad de rotación
    const rotSpeed = 3 + random(`${seed}-rot`) * 8;
    const initialRot = random(`${seed}-init-rot`) * 360;

    // Oscilación de viento horizontal
    const windFreq = 15 + random(`${seed}-wind-freq`) * 20;
    const windAmp = 20 + random(`${seed}-wind-amp`) * 30;

    const color = COLORS[Math.floor(random(`${seed}-color`) * COLORS.length)];
    const size = 12 + random(`${seed}-size`) * 14;
    
    // Forma: 0 = Rectángulo, 1 = Círculo, 2 = Triángulo
    const shape = Math.floor(random(`${seed}-shape`) * 3);

    // Calcular posición actual basada en relFrame de forma determinista
    const currentY = startY + speedY * relFrame + 0.5 * gravity * relFrame * relFrame;
    const currentX = startX + Math.sin(relFrame / windFreq) * windAmp;
    const rotation = initialRot + relFrame * rotSpeed;

    return {
      id: index,
      x: currentX,
      y: currentY,
      size,
      color,
      rotation,
      shape,
    };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {particles
        .filter((p) => p.y < height + 50) // Filtrar partículas que ya salieron de la pantalla
        .map((p) => {
          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                backgroundColor: p.shape !== 2 ? p.color : "transparent",
                borderRadius: p.shape === 1 ? "50%" : "0%",
                transform: `rotate(${p.rotation}deg)`,
                opacity: 0.9,
              }}
            >
              {p.shape === 2 && (
                <svg
                  width={p.size}
                  height={p.size}
                  viewBox="0 0 100 100"
                  style={{ display: "block" }}
                >
                  <polygon points="50,0 0,100 100,100" fill={p.color} />
                </svg>
              )}
            </div>
          );
        })}
    </AbsoluteFill>
  );
};
