import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { CinematicImage } from "./components/CinematicImage";
import { AtmosphericOverlay } from "./components/AtmosphericOverlay";
import { DynamicSubtitle } from "./components/DynamicSubtitle";

export const StorytimeSummaryVideo = ({
  title = "El Perfume - Resumen",
  chapterTitle = "CAPÍTULO 1: EL NACIMIENTO",
  scenes = [],
  backgroundAudio = "",
  voiceoverAudio = "",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();

  // Calcular el progreso global del video (para barra de retención de YouTube Automation)
  const progress = Math.min(1, frame / durationInFrames);

  // Calcular marcas de tiempo y frames de inicio para cada escena en orden secuencial
  let currentFrame = 0;
  const scenesWithTiming = scenes.map((scene) => {
    const startFrame = currentFrame;
    // Si la escena tiene durationInSeconds, lo pasamos a frames. Si tiene durationInFrames, usamos ese valor. Default: 6 seg.
    const duration = scene.durationInFrames || Math.round((scene.durationInSeconds || 6) * fps);
    currentFrame += duration;
    return {
      ...scene,
      startFrame,
      duration,
    };
  });

  const resolveAudioSrc = (src) => {
    if (!src) return null;
    return src.startsWith("http") ? src : staticFile(src);
  };

  const bgAudioSrc = resolveAudioSrc(backgroundAudio);
  const voAudioSrc = resolveAudioSrc(voiceoverAudio);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
      {/* 1. Reproductor de Audio Global (Cuando se incorpore la voz en off de ElevenLabs o música sombría) */}
      {bgAudioSrc && <Audio src={bgAudioSrc} volume={0.25} loop />}
      {voAudioSrc && <Audio src={voAudioSrc} volume={1.0} />}

      {/* 2. Renderizado Secuencial de Escenas (Ken Burns + Atmósfera + Subtítulos Karaoke) */}
      {scenesWithTiming.map((scene, index) => {
        const sfxSrc = resolveAudioSrc(scene.sfx);
        const sceneVoSrc = resolveAudioSrc(scene.voiceover || scene.audio);
        return (
          <Sequence
            key={index}
            from={scene.startFrame}
            durationInFrames={scene.duration}
            name={`Escena ${index + 1}: ${scene.subtitle ? scene.subtitle.substring(0, 20) : ""}`}
          >
            {/* Capa Visual: Imagen con Efecto Ken Burns dinámico */}
            <CinematicImage
              imageSrc={scene.image || "templates/storytime-summary/images/scene_1.jpg"}
              animation={scene.animation || (index % 2 === 0 ? "zoom-in" : "zoom-out")}
            />

            {/* Capa de Atmósfera: Viñeta oscura, partículas flotantes y neblina sensorial */}
            <AtmosphericOverlay
              showVignette={true}
              showDust={scene.showDust !== false}
              showTitleBar={scene.showTitle !== false}
              chapterTitle={scene.chapterTitle || chapterTitle || title}
            />

            {/* Capa de Retención: Subtítulos dinámicos de alto contraste */}
            {scene.subtitle && (
              <DynamicSubtitle
                text={scene.subtitle}
                highlightWords={scene.highlights || []}
                position={scene.subtitlePosition || "bottom"}
                fontSize={48}
                highlightColor={scene.highlightColor || "#FFD700"}
              />
            )}

            {/* Capa de Efectos de Sonido (SFX en transiciones) */}
            {sfxSrc && <Audio src={sfxSrc} volume={scene.sfxVolume || 0.4} />}
            {/* Capa de Voz en off específica para cada escena (perfectamente sincronizada) */}
            {sceneVoSrc && <Audio src={sceneVoSrc} volume={1.0} />}
          </Sequence>
        );
      })}

      {/* 3. Truco Pro de YouTube Automation: Barra de Retención elegante superior (Indica progreso visual al espectador) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 6,
          width: `${progress * 100}%`,
          backgroundColor: "#D4AF37", // Dorado premium
          boxShadow: "0 0 10px #FFD700, 0 2px 5px rgba(0,0,0,0.8)",
          zIndex: 100,
        }}
      />
    </AbsoluteFill>
  );
};
