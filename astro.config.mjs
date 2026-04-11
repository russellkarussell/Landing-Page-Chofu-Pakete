import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  site: "https://meine-waermepumpe.at",
  output: "hybrid",
  adapter: node({ mode: "middleware" }),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve("./src"),
        "@shared": path.resolve("./shared"),
        "@assets": path.resolve("./attached_assets"),
      },
    },
  },
  build: {
    assets: "assets",
  },
  outDir: "./dist/public",
});
