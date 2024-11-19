import { defineConfig } from "vite";

export default defineConfig({
  base: "/projetoCalculadoraInvestimentos/",
  resolve: {
    alias: {
      "chart.js": "/node_modules/chart.js/dist/chart.mjs", // Resolve corretamente
    },
  },
});
