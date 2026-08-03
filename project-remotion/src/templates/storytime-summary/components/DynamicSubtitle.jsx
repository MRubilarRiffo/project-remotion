import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const DynamicSubtitle = ({ 
  text, 
  highlightWords = [], 
  position = "bottom", 
  fontSize = 44,
  textColor = "#FFFFFF",
  highlightColor = "#FFD700" // Amarillo oro brillante por defecto para captar atención
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animación de entrada con spring para que el subtítulo aparezca con suavidad y dinamismo
  const entryScale = spring({
    frame,
    fps,
    config: {
      damping: 15,
      mass: 0.6,
      stiffness: 120,
    },
  });

  const translateY = interpolate(frame, [0, 10], [30, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const opacity = interpolate(frame, [0, 8, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dividir texto en palabras e identificar si deben resaltarse con color e impulso visual
  const words = text.split(" ").map((word, idx) => {
    // Limpiar puntuación para comprobar coincidencia con palabras destacadas
    const cleanWord = word.replace(/[.,¡!¿?;:"'()—]/g, "").toLowerCase();
    const isHighlight = highlightWords.some((hw) => hw.toLowerCase() === cleanWord);

    return (
      <span
        key={idx}
        style={{
          display: "inline-block",
          margin: "0 7px",
          color: isHighlight ? highlightColor : textColor,
          fontWeight: isHighlight ? "900" : "700",
          textShadow: isHighlight
            ? "0 0 20px rgba(255, 215, 0, 0.5), 0 3px 6px rgba(0, 0, 0, 0.95)"
            : "0 3px 8px rgba(0, 0, 0, 0.95), 0 0 2px black",
          transform: isHighlight ? `scale(${Math.min(1.1, entryScale + 0.05)})` : "scale(1)",
          transition: "none", // Remotion regla de oro: Prohibidas transiciones CSS
        }}
      >
        {word}
      </span>
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        width: "85%",
        left: "7.5%",
        bottom: position === "bottom" ? 80 : position === "center" ? "45%" : 120,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        zIndex: 20,
        opacity,
        transform: `scale(${entryScale}) translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(5, 5, 5, 0.82)",
          padding: "16px 36px",
          borderRadius: "12px",
          border: "1px solid rgba(255, 215, 0, 0.25)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.8)",
          maxWidth: "1200px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          fontFamily: "'Inter', 'Montserrat', 'Segoe UI', sans-serif",
          fontSize: `${fontSize}px`,
          lineHeight: "1.4",
        }}
      >
        {words}
      </div>
    </div>
  );
};
