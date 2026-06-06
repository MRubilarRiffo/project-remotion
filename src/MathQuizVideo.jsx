import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio, Video } from "@remotion/media";
import { IntroScene } from "./scenes/IntroScene";
import { MathQuizScene } from "./scenes/MathQuizScene";
import { CtaScene } from "./scenes/CtaScene";
import styles from "./MathQuizVideo.module.css";

export const MathQuizVideo = ({
  category = "matemáticas",
  title = "🧠 RETO MATEMÁTICO",
  hookText = "¡Sólo el 1% resuelve esto! 🤯",
  ctaText = "¡COMENTA TU RESPUESTA! 👇",
  emoji = "🧠",
  equation = "5 + 5 x 5 = ?",
  options = ["A) 30", "B) 50", "C) 25"],
  videoName = "287447_medium.mp4"
}) => {
  // Ajuste de tiempos para que el video dure 6 segundos (180 frames)
  return (
    <AbsoluteFill className={styles.container}>
      {/* 1. Fondo Dinámico (Satisfying Video) y overlay oscuro */}
      <Video
        src={staticFile(`video/${videoName}`)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        muted
        loop
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.4)" }} />

      {/* 2. Audio Genérico (El 99% se equivoca...) */}
      <Audio src={staticFile("audio/voiceover_generic.wav")} />

      {/* 3. Escena 1: Intro / Hook (0s - 1.5s | Frames 0 - 45) */}
      <Sequence from={0} durationInFrames={45}>
        <Audio src="https://remotion.media/whoosh.wav" volume={0.7} playbackRate={1.5} />
        <IntroScene hookText={hookText} emoji={emoji} />
      </Sequence>

      {/* 4. Escena 2: Math Quiz + Temporizador (1.5s - 4.5s | Frames 45 - 135) */}
      <Sequence from={45} durationInFrames={90}>
        <MathQuizScene
          categoryTitle={title}
          equation={equation}
          options={options}
        />
      </Sequence>

      {/* 5. Escena 3: Call to Action Final (Zeigarnik Effect) (4.5s - 6.0s | Frames 135 - 180) */}
      <Sequence from={135} durationInFrames={45}>
        <CtaScene ctaText={ctaText} />
      </Sequence>
    </AbsoluteFill>
  );
};

