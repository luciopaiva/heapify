import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: "src/heapify.ts",
            name: "Heapify",
            formats: ["umd", "es"],
            fileName: (format) => format === "es" ? "heapify.mjs" : "heapify.js",
        },
        outDir: "dist",
        sourcemap: true,
    },
    plugins: [dts()],
    test: {
        globals: true,
        include: ["test/**/*.test.ts"],
    },
});
