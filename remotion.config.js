import { Config } from "@remotion/cli/config";
import { webpackOverride } from "./webpack-override.js";

// Aplicar el override de Webpack para dar soporte a CSS Modules
Config.overrideWebpackConfig(webpackOverride);

// Configuración predeterminada de renderizado
Config.setCodec("h264");
Config.setVideoImageFormat("jpeg");
Config.setConcurrency(8); // Paralelismo para renderizado más rápido
Config.setJpegQuality(80); // Buena calidad de compresión JPEG para frames individuales antes del codificado
