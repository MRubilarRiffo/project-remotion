export const webpackOverride = (currentConfiguration) => {
  console.log("🛠️  APLICANDO WEBPACK OVERRIDE PARA CSS MODULES...");
  // Filtrar las reglas CSS por defecto de Remotion para evitar conflictos
  const rules = (currentConfiguration.module?.rules || []).filter((rule) => {
    if (rule && rule.test && rule.test.toString().includes("css")) {
      return false;
    }
    return true;
  });

  // Regla para CSS Modules: Archivos que terminen en .module.css
  rules.push({
    test: /\.module\.css$/i,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          esModule: false, // Permitir importaciones por defecto directas (import styles from ...)
          modules: {
            localIdentName: "[name]__[local]--[hash:base64:5]",
          },
        },
      },
    ],
  });

  // Regla para CSS Global: Archivos .css generales excluyendo los .module.css
  rules.push({
    test: /\.css$/i,
    exclude: /\.module\.css$/i,
    use: ["style-loader", "css-loader"],
  });

  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules,
    },
  };
};
