import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const AtmosphericOverlay = ({ showVignette = true, showDust = true, showTitleBar = false, chapterTitle = "" }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Animación de respiración del humo / neblina (oscilación suave y determinista)
  const fogOpacity = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.15, 0.35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Generador pseudoaleatorio simple para partículas deterministas (SIN Math.random)
  const getDeterministicParticle = (index) => {
    const seedX = (index * 137 + 49) % width;
    const seedY = (index * 251 + 97) % height;
    const size = (index % 3) + 2;
    const speed = ((index % 5) + 1) * 0.4;
    return { seedX, seedY, size, speed };
  };

  const particles = Array.from({ length: 25 }).map((_, i) => {
    const { seedX, seedY, size, speed } = getDeterministicParticle(i);
    // Animación flotante ascendente y lateral en función del frame
    const currentY = (seedY - frame * speed + height * 2) % height;
    const currentX = seedX + Math.sin((frame * 0.03) + i) * 15;
    const opacity = interpolate(
      Math.sin((frame * 0.05) + i),
      [-1, 1],
      [0.1, 0.6],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: currentX,
          top: currentY,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "#E0D5B5",
          boxShadow: "0 0 4px #D4C599",
          opacity: showDust ? opacity : 0,
        }}
      />
    );
  });

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}>
      {/* Capa de polvo flotante */}
      {particles}

      {/* Capa de neblina verde/dorada colonial mística (Hedor de París / Atmósfera de El Perfume) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(20, 25, 15, 0.6) 90%)",
          opacity: fogOpacity,
          mixBlendMode: "overlay",
        }}
      />

      {/* Viñeta oscura gótica para centrar la atención y dar aspecto de película retro / pintura al óleo */}
      {showVignette && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            boxShadow: "inset 0 0 150px rgba(0, 0, 0, 0.85), inset 0 0 40px rgba(0, 0, 0, 0.95)",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%, transparent 75%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      )}

      {/* Barra de título de capítulo en la esquina superior (Opcional) */}
      {showTitleBar && chapterTitle && (
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 50,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 24px",
            backgroundColor: "rgba(10, 10, 10, 0.75)",
            borderLeft: "4px solid #D4AF37", // Dorado clásico
            borderRadius: "0 6px 6px 0",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel', 'Trajan Pro', 'Georgia', serif",
              color: "#F3E5AB", // Tono pergamino / oro
              fontSize: 24,
              fontWeight: "bold",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {chapterTitle}
          </span>
        </div>
      )}
    </div>
  );
};
