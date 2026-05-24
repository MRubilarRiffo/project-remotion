import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Background } from "./components/Background";
import { IntroScene } from "./scenes/IntroScene";
import { QuizScene } from "./scenes/QuizScene";
import { RevealScene } from "./scenes/RevealScene";
import styles from "./QuizVideo.module.css";

export const QuizVideo = ({
  category = "países",
  title = "🌎 ADIVINA EL PAÍS",
  emoji = "🌎",
  answer = "CHILE",
  hint = "_ H _ L _",
  flagUrl = "https://flagcdn.com/w640/cl.png",
  funFact = "¡Chile es el país más largo y angosto del mundo!"
}) => {
  return (
    <AbsoluteFill className={styles.container}>
      {/* 1. Música de Fondo (Suave a lo largo de todo el video) */}
      <Audio 
        src={staticFile("music/background.mp3")} 
        volume={0.12} 
        loop 
      />

      {/* 2. Fondo Animado Común (Dura toda la composición) */}
      <Background colorTheme={category} />

      {/* 3. Escena 1: Intro (0s - 3s | Frames 0 - 90) */}
      <Sequence from={0} durationInFrames={90}>
        <Audio src="https://remotion.media/whoosh.wav" volume={0.8} />
        <IntroScene title={title} emoji={emoji} />
      </Sequence>

      {/* Efecto whoosh para la salida del título */}
      <Sequence from={75} durationInFrames={30} layout="none">
        <Audio src="https://remotion.media/whoosh.wav" volume={0.6} />
      </Sequence>

      {/* 4. Escena 2 y 3: Quiz + Temporizador (3s - 12s | Frames 90 - 360) */}
      <Sequence from={90} durationInFrames={270}>
        <QuizScene 
          flagUrl={flagUrl} 
          hint={hint} 
          answer={answer} 
          categoryTitle={title} 
        />
      </Sequence>

      {/* 5. Escena 4: Revelación de Respuesta (12s - 16s | Frames 360 - 480) */}
      <Sequence from={360} durationInFrames={120}>
        <RevealScene 
          flagUrl={flagUrl} 
          hint={hint} 
          answer={answer} 
          funFact={funFact} 
        />
      </Sequence>
    </AbsoluteFill>
  );
};
