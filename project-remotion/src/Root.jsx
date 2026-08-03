import { Composition, registerRoot } from "remotion";


import { GuessFlagVideo } from "./templates/guess-flag/GuessFlagVideo";
import { GuessFlag1MinVideo } from "./templates/guess-flag-1min/GuessFlag1MinVideo";
import { ViralQuizVideo } from "./templates/viral-quiz/ViralQuizVideo";
import { ViralQuizVideo2 } from "./templates/viral-quiz-2/ViralQuizVideo2";
import { MathQuizViralVideo } from "./templates/math-quiz-viral/MathQuizViralVideo";
import { StorytimeSummaryVideo } from "./templates/storytime-summary/StorytimeSummaryVideo";
import storytimeData from "./templates/storytime-summary/data/storytime_data.json";
import "./index.css";

export const RemotionRoot = () => {
  return (
    <>
      {/* ═══ STORYTIME NARRATIVE RESUMEN (16:9 - Video Largo / Resumen) ═══ */}
      <Composition
        id="StorytimeSummaryVideo"
        component={StorytimeSummaryVideo}
        durationInFrames={storytimeData[0].scenes.reduce((acc, s) => acc + (s.durationInFrames || Math.round((s.durationInSeconds || 6) * 30)), 0)} // Ahora 8,554 fotogramas (4 min 45 seg) calculado dinámicamente según el audio real
        fps={30}
        width={1920} // Formato horizontal 16:9 para video largo de YouTube Automation
        height={1080}
        defaultProps={storytimeData[0]}
      />

      {/* ═══ MATH QUIZ VIRAL — 8s ═══ */}
      <Composition
        id="MathQuizViralVideo"
        component={MathQuizViralVideo}
        durationInFrames={240} // 8 segundos a 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          id: 1,
          title: "EL 99% DE ADULTOS FALLA ESTO 🤯",
          equation: "50 + 50 x 0 + 1 = ?",
          options: ["A) 1", "B) 101", "C) 51"],
          answerIndex: 2,
          audioFile: "q1.wav"
        }}
      />

      {/* ═══ VIRAL QUIZ — 8s ═══ */}
      <Composition
        id="ViralQuizVideo"
        component={ViralQuizVideo}
        durationInFrames={240} // 8 segundos a 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          question: "¿Quién pintó la Mona Lisa?",
          options: ["A) Vincent van Gogh", "B) Leonardo da Vinci", "C) Pablo Picasso"],
          answerIndex: 1,
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
          backgroundColor: "#FFC107",
          audioFile: "q1.wav"
        }}
      />

      {/* ═══ VIRAL QUIZ 2 (No Answer) — 8s ═══ */}
      <Composition
        id="ViralQuizVideo2"
        component={ViralQuizVideo2}
        durationInFrames={240} // 8 segundos a 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          question: "¿Quién pintó la Mona Lisa?",
          options: ["A) Vincent van Gogh", "B) Leonardo da Vinci", "C) Pablo Picasso"],
          answerIndex: 1,
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
          backgroundColor: "#FFC107",
          audioFile: "q1.wav",
          ctaColor: "#FFEB3B"
        }}
      />


      <Composition
        id="GuessFlagVideo"
        component={GuessFlagVideo}
        durationInFrames={180} // 6 segundos a 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          hookText: "EL 99% FALLA ESTA BANDERA 🌎",
          ctaText: "¡COMENTA TU RESPUESTA! 👇",
          flagUrl: "https://flagcdn.com/w640/ca.png",
          hint: "C_N__A",
          background: "templates/guess-flag/video/330026_medium.mp4",
          audioFile: "shock.wav"
        }}
      />

      <Composition
        id="GuessFlag1MinVideo"
        component={GuessFlag1MinVideo}
        durationInFrames={1830} // 61 segundos a 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          flags: [],
          background: "templates/guess-flag/video/330026_medium.mp4"
        }}
      />

      {/* 10 Ejemplos de Adivina la Bandera */}
      {[
        { id: "Canada", iso: "ca", hint: "C_N__A", audio: "shock.wav", hook: "EL 99% FALLA ESTA BANDERA 🌎", bg: "330026_medium.mp4" },
        { id: "Mexico", iso: "mx", hint: "M_X_C_", audio: "challenge.wav", hook: "¡SOLO PARA GENIOS! 🧠", bg: "330028_medium.mp4" },
        { id: "Brasil", iso: "br", hint: "B_A_I_", audio: "urgency.wav", hook: "¿ADIVINAS EL PAÍS? ⏳", bg: "337736_medium.mp4" },
        { id: "Espana", iso: "es", hint: "E_P_Ñ_", audio: "shock.wav", hook: "EL 99% FALLA ESTA BANDERA 🌎", bg: "346444_medium.mp4" },
        { id: "Argentina", iso: "ar", hint: "A_G__N__A", audio: "challenge.wav", hook: "¡SOLO PARA GENIOS! 🧠", bg: "330026_medium.mp4" },
        { id: "Alemania", iso: "de", hint: "A_E__N_A", audio: "urgency.wav", hook: "¿ADIVINAS EL PAÍS? ⏳", bg: "330028_medium.mp4" },
        { id: "Francia", iso: "fr", hint: "F_A__I_", audio: "shock.wav", hook: "EL 99% FALLA ESTA BANDERA 🌎", bg: "337736_medium.mp4" },
        { id: "Japon", iso: "jp", hint: "J_P__", audio: "challenge.wav", hook: "¡SOLO PARA GENIOS! 🧠", bg: "346444_medium.mp4" },
        { id: "Australia", iso: "au", hint: "A_S__A__A", audio: "urgency.wav", hook: "¿ADIVINAS EL PAÍS? ⏳", bg: "330026_medium.mp4" },
        { id: "Colombia", iso: "co", hint: "C_L__B_A", audio: "shock.wav", hook: "EL 99% FALLA ESTA BANDERA 🌎", bg: "330028_medium.mp4" },
      ].map((country) => (
        <Composition
          key={country.id}
          id={`GuessFlag-${country.id}`}
          component={GuessFlagVideo}
          durationInFrames={180} // 6 segundos a 30 fps
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            hookText: country.hook,
            ctaText: "¡COMENTA TU RESPUESTA! 👇",
            flagUrl: `https://flagcdn.com/w640/${country.iso}.png`,
            hint: country.hint,
            background: `templates/guess-flag/video/${country.bg}`,
            audioFile: country.audio
          }}
        />
      ))}
    </>
  );
};

registerRoot(RemotionRoot);