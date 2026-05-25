import { Composition, registerRoot } from "remotion";
import { QuizVideo } from "./QuizVideo";
import "./index.css";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="QuizVideo"
        component={QuizVideo}
        durationInFrames={540} // 18 segundos a 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "países",
          title: "¿QUÉ PAÍS ES?",
          hookText: "¡Sólo el 1% adivina el país! 🌎",
          ctaText: "¡Comenta tu respuesta! 👇",
          emoji: "🌎",
          answer: "CHILE",
          hint: "_ H _ L _",
          flagUrl: "https://flagcdn.com/w640/cl.png",
          funFact: "¡Chile es el país más largo y angosto del mundo!"
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
