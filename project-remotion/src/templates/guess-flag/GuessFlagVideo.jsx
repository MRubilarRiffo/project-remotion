import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio, Video } from "@remotion/media";
import { GuessScene } from "./scenes/GuessScene";
import { CtaScene } from "./scenes/CtaScene";
import styles from "./GuessFlagVideo.module.css";

export const GuessFlagVideo = ({
  hookText = "EL 99% FALLA ESTA BANDERA 🌎",
  ctaText = "¡COMENTA TU RESPUESTA! 👇",
  flagUrl = "https://flagcdn.com/w640/ca.png",
  hint = "C_N__A",
  background = "templates/math-quiz/video/186371-877727709_medium.mp4",
  audioFile = "shock.wav"
}) => {
  // Video duration: 6 seconds (180 frames at 30 fps)
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

      {/* Voiceover Hook */}
      <Audio src={staticFile(`templates/guess-flag/audio/${audioFile}`)} />

      {/* Scene 1: Flag Guessing + Timer (0s - 4.5s | Frames 0 - 135) */}
      <Sequence from={0} durationInFrames={135}>
        <Audio src="https://remotion.media/whoosh.wav" volume={0.7} playbackRate={1.5} />
        <GuessScene 
          hookText={hookText}
          flagUrl={flagUrl}
          hint={hint}
        />
      </Sequence>

      {/* Scene 2: Call to Action (4.5s - 6.0s | Frames 135 - 180) */}
      <Sequence from={135} durationInFrames={45}>
        <CtaScene ctaText={ctaText} />
      </Sequence>
    </AbsoluteFill>
  );
};
