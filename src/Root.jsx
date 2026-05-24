import { Composition, registerRoot } from "remotion";
import { QuizVideo } from "./QuizVideo";
import "./index.css";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="QuizVideo"
        component={QuizVideo}
        durationInFrames={480} // 16 segundos a 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          category: "países",
          title: "🌎 ADIVINA EL PAÍS",
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
