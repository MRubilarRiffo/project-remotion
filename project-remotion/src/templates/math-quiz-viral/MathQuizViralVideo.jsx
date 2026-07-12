import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, Sequence, staticFile, interpolate, spring } from "remotion";
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

const PALETTES = [
  "#E91E63", // Pink/Red
  "#2196F3", // Blue
  "#9C27B0", // Purple
  "#FF9800", // Orange
  "#4CAF50", // Green
  "#00BCD4", // Cyan
  "#3F51B5", // Indigo
  "#FF5722", // Deep Orange
  "#009688", // Teal
  "#8BC34A", // Light Green
];

export const MathQuizViralVideo = ({
  id = 1,
  title = "EL 99% DE ADULTOS FALLA ESTO 🤯",
  equation = "50 + 50 x 0 + 1 = ?",
  options = ["A) 1", "B) 101", "C) 51"],
  answerIndex = 2,
  audioFile = "q1.wav",
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealFrame = fps * 6; // Reveal at 6 seconds
  const totalFrames = fps * 8; // Total 8 seconds

  const progressWidth = interpolate(frame, [0, revealFrame], [100, 0], {
    extrapolateRight: "clamp",
  });

  const questionScale = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  const answerPop = spring({
    frame: frame - revealFrame,
    fps,
    config: { damping: 10, mass: 1, stiffness: 100 },
  });

  const activeColor = backgroundColor || PALETTES[(id - 1) % PALETTES.length];

  return (
    <AbsoluteFill style={{ backgroundColor: activeColor, fontFamily: "sans-serif", overflow: "hidden" }}>
      <Sunburst color={activeColor} />

      {/* Hook Title */}
      <div style={{
        position: "absolute",
        top: 130,
        width: "100%",
        textAlign: "center",
        fontSize: 70,
        fontWeight: "900",
        color: "#FFF",
        textShadow: "-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 8px 15px rgba(0,0,0,0.5)",
        padding: "0 40px",
        transform: `scale(${questionScale})`,
        lineHeight: 1.2,
      }}>
        {title}
      </div>

      {/* Equation display in the center (replacing image) */}
      <div style={{
        position: "absolute",
        top: 450,
        left: "50%",
        transform: "translateX(-50%)",
        width: 850,
        height: 400,
        backgroundColor: "rgba(0,0,0,0.75)",
        borderRadius: 40,
        border: "10px solid #FFF",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          fontSize: 110,
          fontWeight: "900",
          color: "#FACC15", // yellow
          textShadow: "0 5px 15px rgba(0,0,0,0.5)",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          letterSpacing: 2,
        }}>
          {equation}
        </div>
      </div>

      {/* Options */}
      <div style={{
        position: "absolute",
        top: 1020,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
      }}>
        {options.map((opt, i) => {
          const isCorrect = i === answerIndex;
          const showCorrect = frame >= revealFrame && isCorrect;

          return (
            <div key={i} style={{
              width: 850,
              padding: "35px 40px",
              backgroundColor: showCorrect ? "#4CAF50" : "#FFF",
              color: showCorrect ? "#FFF" : "#000",
              borderRadius: 40,
              fontSize: 55,
              fontWeight: "bold",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              border: `6px solid ${showCorrect ? "#2E7D32" : "#000"}`,
              display: "flex",
              alignItems: "center",
              transform: showCorrect ? `scale(${1 + (answerPop * 0.1)})` : "none",
              zIndex: showCorrect ? 10 : 1,
            }}>
              {opt}
            </div>
          );
        })}
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

      {/* Audio: Background Music */}
      <Sequence from={0} layout="none">
        <Audio src={staticFile(`templates/math-quiz-viral/audio/bgm.mp3`)} volume={0.25} loop />
      </Sequence>

      {/* Audio: Voiceover */}
      {audioFile && (
        <Sequence from={0} layout="none">
          <Audio src={staticFile(`templates/math-quiz-viral/audio/${audioFile}`)} />
        </Sequence>
      )}

      {/* Audio: Tick Tock Timer */}
      <Sequence from={0} durationInFrames={revealFrame} layout="none">
        <Audio src={staticFile(`templates/viral-quiz/audio/tick.wav`)} volume={0.35} loop />
      </Sequence>

      {/* Audio: Correct Ding */}
      <Sequence from={revealFrame} layout="none">
        <Audio src={staticFile(`templates/viral-quiz/audio/pop.wav`)} volume={1.0} />
      </Sequence>
    </AbsoluteFill>
  );
};
