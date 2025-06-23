/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom", // necesario si usás DOM APIs como window
    globals: true, // para usar describe/it/expect sin importar
  },
});
