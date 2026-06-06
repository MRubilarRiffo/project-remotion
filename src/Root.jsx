import { Composition, registerRoot } from "remotion";

import { MathQuizVideo } from "./MathQuizVideo";
import "./index.css";

export const RemotionRoot = () => {
  return (
    <>

      <Composition
        id="MathQuizVideo"
        component={MathQuizVideo}
        durationInFrames={180} // 6 segundos a 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "matemáticas",
          title: "🧠 RETO MATEMÁTICO",
          hookText: "¡Sólo el 1% resuelve esto! 🤯",
          ctaText: "¡Comenta tu respuesta! 👇",
          emoji: "🧠",
          equation: "5 + 5 x 5 = ?",
          options: ["A) 30", "B) 50", "C) 25"],
          videoName: "287447_medium.mp4"
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
