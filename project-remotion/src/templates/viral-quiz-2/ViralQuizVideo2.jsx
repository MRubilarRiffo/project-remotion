import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, Audio, Sequence, staticFile, interpolate, spring } from "remotion";
import React from "react";

const Sunburst = ({ color }) => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 300], [0, 90]);

  return (
    <div
      style={{
        position: "absolute",
        width: "200%",
        height: "200%",
        top: "-50%",
        left: "-50%",
        background: `repeating-conic-gradient(
          from 0deg,
          ${color} 0deg 15deg,
          rgba(255,255,255,0.2) 15deg 30deg
        )`,
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
};

export const ViralQuizVideo2 = ({
  question = "¿Quién pintó la Mona Lisa?",
  options = ["A) Vincent van Gogh", "B) Leonardo da Vinci", "C) Pablo Picasso"],
  answerIndex = 1,
  imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
  backgroundColor = "#FFC107",
  audioFile = "q1.wav",
  ctaColor = "#FFEB3B",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealFrame = fps * 6; // Reveal at 6 seconds

  const progressWidth = interpolate(frame, [0, revealFrame], [100, 0], {
    extrapolateRight: "clamp",
  });

  const questionScale = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor, fontFamily: "sans-serif", overflow: "hidden" }}>
      <Sunburst color={backgroundColor} />

      {/* Title */}
      <div style={{
        position: "absolute",
        top: 100,
        width: "100%",
        textAlign: "center",
        fontSize: 85,
        fontWeight: "900",
        color: "#FFF",
        textShadow: "-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 8px 15px rgba(0,0,0,0.5)",
        padding: "0 40px",
        transform: `scale(${questionScale})`,
        lineHeight: 1.2,
      }}>
        {question}
      </div>

      {/* Image */}
      <div style={{
        position: "absolute",
        top: 500,
        left: "50%",
        transform: "translateX(-50%)",
        width: 600,
        height: 450,
        borderRadius: 20,
        overflow: "hidden",
        border: "10px solid #FFF",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      }}>
        <Img src={staticFile(`templates/viral-quiz-2/images/${imageUrl}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Options */}
      <div style={{
        position: "absolute",
        top: 1050,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
      }}>
        {options.map((opt, i) => {
          return (
            <div key={i} style={{
              width: 800,
              padding: "30px 40px",
              backgroundColor: "#FFF",
              color: "#000",
              borderRadius: 40,
              fontSize: 50,
              fontWeight: "bold",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
              border: `5px solid #000`,
              display: "flex",
              alignItems: "center",
            }}>
              {opt}
            </div>
          );
        })}
      </div>

      {/* CTA para Comentar */}
      <div style={{
        position: "absolute",
        bottom: 220,
        width: "100%",
        textAlign: "center",
        fontSize: 60,
        fontWeight: "900",
        color: ctaColor,
        textShadow: "-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 8px 15px rgba(0,0,0,0.5)",
        transform: `scale(${1 + Math.sin(frame / 5) * 0.05})`,
      }}>
        ¡DEJA TU RESPUESTA EN LOS COMENTARIOS! 👇
      </div>

      {/* Progress Bar */}
      <div style={{
        position: "absolute",
        bottom: 100,
        left: "50%",
        transform: "translateX(-50%)",
        width: 900,
        height: 60,
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 30,
        border: "5px solid #000",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${progressWidth}%`,
          backgroundColor: "#4CAF50",
          borderRight: "5px solid #000",
        }} />
      </div>

      {/* Audio: Voiceover */}
      {audioFile && (
        <Sequence from={0} layout="none">
          <Audio src={staticFile(`templates/viral-quiz-2/audio/${audioFile}`)} />
        </Sequence>
      )}

      {/* Audio: Background Music */}
      <Sequence from={0} layout="none">
        <Audio src={staticFile(`templates/viral-quiz-2/audio/bgm.mp3`)} volume={0.25} loop />
      </Sequence>

      {/* Audio: Tick Tock Timer */}
      <Sequence from={0} durationInFrames={revealFrame} layout="none">
        <Audio src={staticFile(`templates/viral-quiz-2/audio/tick.wav`)} volume={0.35} loop />
      </Sequence>
    </AbsoluteFill>
  );
};
