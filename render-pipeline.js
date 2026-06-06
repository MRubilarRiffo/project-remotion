import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { webpackOverride } from "./webpack-override.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de archivos de bases de datos para renderizar por lotes
const DATA_SOURCES = [
  { file: "./src/data/math.json", category: "matemáticas", compId: "MathQuizVideo" }
];

const start = async () => {
  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Creado directorio de salida: ${outputDir}`);
  }

  const entryPoint = path.join(__dirname, "src", "Root.jsx");
  console.log(`📦 Empaquetando composición Remotion desde: ${entryPoint}...`);

  // 1. Crear el bundle (compilación de webpack de la app de Remotion)
  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride,
  });
  console.log("✓ Proyecto empaquetado con éxito.");

  // 2. Iterar por cada archivo de datos configurado
  for (const source of DATA_SOURCES) {
    const dataPath = path.resolve(__dirname, source.file);
    const compositionId = source.compId;

    if (!fs.existsSync(dataPath)) {
      console.warn(`⚠️ Archivo de datos no encontrado: ${source.file}. Saltando...`);
      continue;
    }

    console.log(`\n📖 Leyendo preguntas de: ${source.file}`);
    const questions = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    for (let index = 0; index < questions.length; index++) {
      const q = questions[index];
      // Si no hay 'answer', usamos el ID o el nombre de la ecuación para el archivo
      const answerText = q.answer || `math_id_${q.id}`;
      const safeAnswerName = answerText.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const outputFilename = `quiz_${q.category || "general"}_${safeAnswerName}.mp4`;
      const outputPath = path.join(outputDir, outputFilename);

      console.log(`\n🎬 Generando video [${index + 1}/${questions.length}]: ${outputFilename} usando la composición ${compositionId}`);

      // Configurar inputProps dinámicos para este renderizado específico
      const inputProps = {
        category: q.category || "general",
        title: q.title || "ADIVINA",
        hookText: q.hookText, // Se agrega para que sea variable desde el JSON
        emoji: q.emoji || "❓",
        answer: q.answer,
        hint: q.hint,
        flagUrl: q.flag || q.image, // Soporta ambas llaves
        funFact: q.funFact || "",
        // Propiedades específicas del Quiz Matemático
        equation: q.equation,
        options: q.options,
        answerIndex: q.answerIndex
      };

      // 3. Seleccionar la composición con las props específicas
      console.log("🔍 Seleccionando composición e inyectando propiedades...");
      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: compositionId,
        inputProps,
      });

      // 4. Renderizar el video a disco usando FFmpeg internamente
      console.log("⚡ Iniciando renderizado de frames y mezcla de audio con FFmpeg...");
      // await renderMedia({
      //   composition,
      //   serveUrl: bundleLocation,
      //   codec: "h264",
      //   outputLocation: outputPath,
      //   inputProps,
      //   // Configuración para redes sociales (rápido y comprimido para móvil)
      //   crf: 20, // Factor de compresión balanceado (calidad excelente / peso reducido)
      //   pixelFormat: "yuv420p", // Formato de pixel compatible con la mayoría de reproductores móviles
      //   concurrency: 1, // Previene colapsos de memoria en Chromium (Target closed)
      //   timeoutInMilliseconds: 120000 // 2 minutos de timeout por seguridad
      // });
      await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: "h264",
        outputLocation: outputPath,
        inputProps,
        // Configuración para redes sociales (rápido y comprimido para móvil)
        videoBitrate: "8M", // Reemplaza crf: 20 (obligatorio para aceleración por hardware)
        pixelFormat: "yuv420p", // Formato de pixel compatible con la mayoría de reproductores móviles
        concurrency: 3, // Previene colapsos de memoria en Chromium (Target closed)
        timeoutInMilliseconds: 120000, // 2 minutos de timeout por seguridad
        // Habilitar aceleración de hardware para la codificación FFmpeg (si está disponible)
        hardwareAcceleration: "if-possible",
        // Habilitar GPU en Chromium para acelerar renderizado de frames y animaciones
        chromiumOptions: {
          gl: "angle", // Recomendado para Windows / desarrollo local
        },
      });

      console.log(`✓ ¡Video renderizado con éxito! Guardado en: ${outputPath}`);
    }
  }

  console.log("\n🎉 ¡Pipeline completado! Todos los videos se han generado en la carpeta /output/");
};

start().catch((err) => {
  console.error("❌ Error en el pipeline de renderizado:", err);
  process.exit(1);
});
