import { AbsoluteFill, staticFile, Series } from "remotion";
import { Audio, Video } from "@remotion/media";
import { GuessScene } from "./scenes/GuessScene";
import { CtaScene } from "./scenes/CtaScene";
import styles from "./GuessFlag1MinVideo.module.css";

export const GuessFlag1MinVideo = ({
  flags = [],
  background = "templates/guess-flag/video/330026_medium.mp4"
}) => {
  const introDuration = 150; // 5 seconds intro
  const outroDuration = 150; // 5 seconds outro
  const flagDuration = 153; // 5.1 seconds per flag

  return (
    <AbsoluteFill className={styles.container}>
      {/* Dynamic Background and Dark Overlay */}
      <Video
        src={staticFile(background)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        muted
        loop
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.5)" }} />

      <Series>
        {/* Intro */}
        <Series.Sequence durationInFrames={introDuration}>
          <Audio src={staticFile(`templates/guess-flag-1min/audio/intro-1min.wav`)} />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <h1 style={{ 
              color: "white", 
              fontSize: 100, 
              textAlign: "center", 
              textTransform: "uppercase", 
              fontWeight: "900", 
              textShadow: "0 10px 20px rgba(0,0,0,0.8)",
              background: "linear-gradient(to right, #ff8a00, #e52e71)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
               Reto: 10 Banderas
            </h1>
            <h2 style={{ 
              color: "yellow", 
              fontSize: 60, 
              marginTop: 40,
              fontWeight: "bold",
              textShadow: "0 5px 10px rgba(0,0,0,0.5)",
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: "20px 40px",
              borderRadius: "20px"
            }}>
               ¡Pon a prueba tu cerebro! 🧠
            </h2>
          </AbsoluteFill>
        </Series.Sequence>

        {/* Banderas */}
        {flags.map((flag, index) => (
           <Series.Sequence key={flag.id} durationInFrames={flagDuration}>
             <Audio src="https://remotion.media/whoosh.wav" volume={0.7} playbackRate={1.5} />
             {/* Medium level transition halfway */}
             {index === 5 && <Audio src={staticFile(`templates/guess-flag-1min/audio/level-medium.wav`)} />}
             <GuessScene 
               hookText={flag.hookText}
               flagUrl={flag.flag}
               hint={flag.hint}
             />
           </Series.Sequence>
        ))}

        {/* Outro CTA */}
        <Series.Sequence durationInFrames={outroDuration}>
           <Audio src={staticFile(`templates/guess-flag-1min/audio/outro-1min.wav`)} />
           <CtaScene ctaText="¿CUÁNTAS ADIVINASTE? 👇" />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
