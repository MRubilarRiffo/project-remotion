import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Background } from "./components/Background";
import { IntroScene } from "./scenes/IntroScene";
import { QuizScene } from "./scenes/QuizScene";
import { RevealScene } from "./scenes/RevealScene";
import { CtaScene } from "./scenes/CtaScene";
import styles from "./QuizVideo.module.css";

export const QuizVideo = ({
  category = "países",
  title = "¿QUÉ PAÍS ES?",
  hookText = "¡Sólo el 1% adivina el país! 🌎",
  ctaText = "¡Comenta tu respuesta! 👇",
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

      {/* 3. Escena 1: Intro / Hook (0s - 2.5s | Frames 0 - 75) */}
      <Sequence from={0} durationInFrames={75}>
        <Audio src="https://remotion.media/whoosh.wav" volume={0.8} />
        <IntroScene hookText={hookText} emoji={emoji} />
      </Sequence>

      {/* Efecto whoosh para la transición hacia QuizScene */}
      <Sequence from={65} durationInFrames={30} layout="none">
        <Audio src="https://remotion.media/whoosh.wav" volume={0.6} />
      </Sequence>

      {/* 4. Escena 2: Quiz + Temporizador (2.5s - 11.5s | Frames 75 - 345) */}
      <Sequence from={75} durationInFrames={270}>
        <QuizScene 
          flagUrl={flagUrl} 
          hint={hint} 
          answer={answer} 
          categoryTitle={title} 
        />
      </Sequence>

      {/* 5. Escena 3: Revelación de Respuesta (11.5s - 15.5s | Frames 345 - 465) */}
      <Sequence from={345} durationInFrames={120}>
        <RevealScene 
          flagUrl={flagUrl} 
          hint={hint} 
          answer={answer} 
          funFact={funFact} 
        />
      </Sequence>

      {/* 6. Escena 4: Call to Action Final (15.5s - 18s | Frames 465 - 540) */}
      <Sequence from={465} durationInFrames={75}>
        <CtaScene ctaText={ctaText} />
      </Sequence>
    </AbsoluteFill>
  );
};
