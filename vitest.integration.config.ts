import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["test/integration/**/*.test.ts"],
        globalSetup: "test/integration/globalSetup.ts",
        testTimeout: 30_000,
    },
});
