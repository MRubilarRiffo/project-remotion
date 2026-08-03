import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export const CinematicImage = ({ 
  imageSrc, 
  animation = "zoom-in", 
  scaleFrom = 1.0, 
  scaleTo = 1.18, 
  panX = 0, 
  panY = 0 
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Interpolación de escala (Ken Burns Effect)
  const scale = interpolate(
    frame,
    [0, durationInFrames],
    animation === "zoom-out" ? [scaleTo, scaleFrom] : [scaleFrom, scaleTo],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  // Desplazamiento panorámico (Pan X / Pan Y)
  const translateX = interpolate(
    frame,
    [0, durationInFrames],
    animation === "pan-left" ? [0, -50] : animation === "pan-right" ? [-50, 0] : [0, panX],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const translateY = interpolate(
    frame,
    [0, durationInFrames],
    animation === "pan-up" ? [0, -40] : animation === "pan-down" ? [-40, 0] : [0, panY],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Subtle opacity fade-in at the very beginning of the clip (first 15 frames = 0.5s at 30fps)
  const fadeIn = interpolate(frame, [0, 15], [0.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  // Determinar si la imagen viene de URL externa o del public/ folder de Remotion
  const resolvedSrc = imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#050505",
      }}
    >
      <Img
        src={resolvedSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: "center center",
          opacity: fadeIn,
          filter: "contrast(1.1) saturate(1.05)",
        }}
      />
    </div>
  );
};
