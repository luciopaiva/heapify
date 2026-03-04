import { describe, it } from "vitest";
import { runInTempDir, TEMP_DIR } from "./helpers";
import fs from "node:fs";
import path from "node:path";

describe("node CJS require", () => {
    it("requires and uses heapify via require()", () => {
        const testFile = path.join(TEMP_DIR, "test-require.cjs");
        fs.writeFileSync(testFile, `
const {MinQueue} = require("heapify");

const queue = new MinQueue();
queue.push(3, 3);
queue.push(2, 2);
queue.push(1, 1);

const results = [];
while (queue.size > 0) {
    results.push(queue.pop());
}

const ok = results.join(",") === "1,2,3";
if (!ok) {
    console.error("Test failed: got", results.join(","), "expected 1,2,3");
    process.exit(1);
}
`);
        runInTempDir(`node "${testFile}"`);
    });
});
