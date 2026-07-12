import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { webpackOverride } from "./webpack-override.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_SOURCES = [
  { file: "./src/templates/viral-quiz/data/viral.json", category: "viral", compId: "ViralQuizVideo" },
];

const start = async () => {
  const entryPoint = path.join(__dirname, "src", "Root.jsx");
  console.log(`📦 Empaquetando composición Remotion desde: ${entryPoint}...`);

  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride,
  });
  console.log("✓ Proyecto empaquetado con éxito.");

  for (const source of DATA_SOURCES) {
    const dataPath = path.resolve(__dirname, source.file);
    const compositionId = source.compId;

    const templateMatch = source.file.match(/src\/templates\/([^/]+)/);
    const templateName = templateMatch ? templateMatch[1] : compositionId;

    const outputDir = path.join(__dirname, "..", "output", templateName + "-thumbnails");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Creado directorio de salida para miniaturas: ${outputDir}`);
    }

    if (!fs.existsSync(dataPath)) {
      console.warn(`⚠️ Archivo de datos no encontrado: ${source.file}. Saltando...`);
      continue;
    }

    console.log(`\n📖 Leyendo preguntas de: ${source.file}`);
    const questions = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    for (let index = 0; index < questions.length; index++) {
      const q = questions[index];
      const answerText = q.answer || `math_id_${q.id}`;
      const safeAnswerName = answerText.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const outputFilename = `${compositionId}_${q.category || "general"}_${safeAnswerName}.jpg`;
      const outputPath = path.join(outputDir, outputFilename);

      console.log(`\n🖼️ Generando miniatura [${index + 1}/${questions.length}]: ${outputFilename}`);

      const inputProps = {
        category: q.category || "general",
        title: q.title,
        hookText: q.hookText,
        emoji: q.emoji || "❓",
        answer: q.answer,
        hint: q.hint,
        flagUrl: q.flag || q.image,
        funFact: q.funFact || "",
        background: q.background,
        audioFile: q.audioFile,
        equation: q.equation,
        options: q.options,
        answerIndex: q.answerIndex,
        question: q.question,
        ctaText: q.ctaText,
        watermark: q.watermark,
        questionAudio: q.questionAudio,
        answerAudio: q.answerAudio,
        flags: q.flags,
        equations: q.equations,
        primaryColor: q.primaryColor,
        videoId: q.id ? `video-${q.id}` : `video-${index}`,
        imageUrl: q.imageUrl,
        backgroundColor: q.backgroundColor
      };

      console.log("🔍 Seleccionando composición e inyectando propiedades...");
      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: compositionId,
        inputProps,
      });

      console.log("⚡ Iniciando renderizado de la imagen...");
      await renderStill({
        composition,
        serveUrl: bundleLocation,
        output: outputPath,
        inputProps,
        frame: 90, // Capturar en el segundo 3 (antes de revelar respuesta)
        imageFormat: "jpeg",
        envVariables: {},
      });

      console.log(`✓ ¡Miniatura renderizada con éxito! Guardada en: ${outputPath}`);
    }
  }

  console.log("\n🎉 ¡Generación de miniaturas completada!");
};

start().catch((err) => {
  console.error("❌ Error en el generador de miniaturas:", err);
  process.exit(1);
});
