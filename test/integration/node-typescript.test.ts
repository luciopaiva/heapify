import { describe, it } from "vitest";
import { runInTempDir, TEMP_DIR } from "./helpers";
import fs from "node:fs";
import path from "node:path";

describe("node TypeScript import", () => {
    it("type-checks and runs heapify from TypeScript", () => {
        // Write a tsconfig that includes the test file, so `tsc -p` picks it up
        const testFile = path.join(TEMP_DIR, "test-typescript.ts");
        fs.writeFileSync(
            path.join(TEMP_DIR, "tsconfig.json"),
            JSON.stringify({
                compilerOptions: {
                    module: "commonjs",
                    moduleResolution: "node",
                    target: "es2015",
                    esModuleInterop: true,
                    strict: true,
                    skipLibCheck: true,
                },
                files: ["test-typescript.ts"],
            }, null, 2),
        );

        fs.writeFileSync(testFile, `
import {MinQueue} from "heapify";

const queue = new MinQueue();
queue.push(3, 3);
queue.push(2, 2);
queue.push(1, 1);

const results: number[] = [];
while (queue.size > 0) {
    results.push(queue.pop()!);
}

const ok: boolean = results.join(",") === "1,2,3";
if (!ok) {
    console.error("Test failed: got", results.join(","), "expected 1,2,3");
    process.exit(1);
}
`);
        // Type-check with tsc (using -p so tsconfig.json is respected)
        runInTempDir("npx tsc --noEmit -p tsconfig.json");

        // Execute with tsx
        runInTempDir("npx tsx test-typescript.ts");
    });
});
