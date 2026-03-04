import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TEMP_DIR = path.join(os.tmpdir(), "heapify-integration-test");
export const ROOT_DIR = path.resolve(__dirname, "../..");
export const DIST_DIR = path.join(ROOT_DIR, "dist");
export const FIXTURES_DIR = path.join(__dirname, "fixtures");

/**
 * Run a command in the temp project directory and return its stdout.
 * Throws on non-zero exit code, with stderr included in the error message.
 */
export function runInTempDir(command: string): string {
    try {
        return execSync(command, {
            cwd: TEMP_DIR,
            encoding: "utf-8",
            stdio: "pipe",
            timeout: 30_000,
        });
    } catch (e: unknown) {
        const err = e as { stderr?: string; stdout?: string; message?: string };
        const details = err.stderr || err.stdout || "";
        throw new Error(`Command failed: ${command}\n${details}`, { cause: e });
    }
}
