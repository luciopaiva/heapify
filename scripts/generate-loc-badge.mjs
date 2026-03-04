import { generateBadgeSvg, resolveRoot, writeBadge } from "./lib/badge.mjs";
import { execSync } from "node:child_process";

const root = resolveRoot(import.meta.url);

// Run cloc on the source file
const output = execSync("npm run --silent loc", { cwd: root, encoding: "utf8" });

/*
 * Parse the "code" column from the TypeScript data line
 * cloc output looks like:
 *   TypeScript                       1             XX             XX             XX
 */
const match = output.match(/^TypeScript\s+\d+\s+\d+\s+\d+\s+(?<loc>\d+)/mu);
if (!match) {
    throw new Error(`Could not parse cloc output:\n${output}`);
}

const loc = parseInt(match.groups.loc, 10);

const svg = generateBadgeSvg("lines of code", String(loc), "#007ec6");
writeBadge(root, "loc.svg", svg);

// eslint-disable-next-line no-console
console.log(`Lines-of-code badge generated: ${loc} lines`);
