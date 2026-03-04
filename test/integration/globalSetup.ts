/**
 * Global setup for integration tests.
 *
 * Creates a temporary project directory and installs heapify from a tarball
 * (produced by `npm pack`), simulating a real `npm install` from the registry.
 *
 * Expects the project to have been built before running (`npm run build:prod`).
 */

import { DIST_DIR, ROOT_DIR, TEMP_DIR } from "./helpers";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/** Files that the prerelease script copies into dist before publishing. */
const BASE_FILES = ["package.json", "README.md", "LICENSE.md"];

export function setup() {
    // Clean any leftover temp dir from a previous run
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    fs.mkdirSync(TEMP_DIR, { recursive: true });

    // Copy base files into dist so `npm pack` produces a complete package
    for (const file of BASE_FILES) {
        fs.copyFileSync(path.join(ROOT_DIR, file), path.join(DIST_DIR, file));
    }

    // Pack the dist folder, placing the tarball in the temp dir
    execSync(`npm pack "${DIST_DIR}" --pack-destination "${TEMP_DIR}"`, {
        cwd: ROOT_DIR,
        stdio: "pipe",
    });

    const tarball = fs.readdirSync(TEMP_DIR).find(f => f.endsWith(".tgz"));
    if (!tarball) {
        throw new Error("No tarball found after npm pack");
    }

    // Create a minimal project in the temp dir
    fs.writeFileSync(
        path.join(TEMP_DIR, "package.json"),
        JSON.stringify({
            name: "heapify-integration-test",
            version: "1.0.0",
            private: true,
        }, null, 2),
    );

    // Install heapify from the tarball, plus tsx, typescript, and @types/node for the TS test
    execSync(`npm install "./${tarball}" tsx typescript @types/node`, {
        cwd: TEMP_DIR,
        stdio: "pipe",
        timeout: 60_000,
    });
}

export function teardown() {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}

export default function globalSetup() {
    setup();
    return teardown;
}
