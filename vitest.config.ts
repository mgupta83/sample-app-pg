import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@app/interfaces": resolve(__dirname, "packages/interfaces/src/index.ts"),
      "@app/time-impl": resolve(__dirname, "packages/time-impl/src/index.ts"),
    },
  },
  test: {
    globals: false,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "deploy/",
        "**/*.test.ts",
        "**/*.config.*",
        "**/prepare-deploy.mjs",
      ],
    },
  },
});
