import { defineConfig } from "@rolldown/node";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  input: resolve(__dirname, "packages/core-functions/dist/index.js"),
  output: {
    dir: resolve(__dirname, "deploy/dist"),
    format: "esm",
    entryFileNames: "index.js",
    sourcemap: true,
  },
  external: ["@azure/functions"],
  treeshake: true,
});
