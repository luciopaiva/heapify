import { join } from "node:path";
import { readFileSync } from "node:fs";
import { generateBadgeSvg, resolveRoot, writeBadge } from "./lib/badge.mjs";

const root = resolveRoot(import.meta.url);

// Read coverage summary produced by vitest --coverage with json-summary reporter
const summaryPath = join(root, "coverage", "coverage-summary.json");
const summary = JSON.parse(readFileSync(summaryPath, "utf8"));

const { total } = summary;
const { covered, total: count } = total.lines;
const pct = count > 0 ? Math.floor(covered / count * 100) : 0;

// Colour thresholds
// eslint-disable-next-line init-declarations
let color;
if (pct >= 90) {
    color = "#4c1";
} else if (pct >= 80) {
    color = "#a3c51c";
} else if (pct >= 70) {
    color = "#dfb317";
} else if (pct >= 60) {
    color = "#fe7d37";
} else {
    color = "#e05d44";
}

const svg = generateBadgeSvg("coverage", `${pct}%`, color);
writeBadge(root, "coverage.svg", svg);

// eslint-disable-next-line no-console
console.log(`Coverage badge generated: ${pct}% (${covered}/${count} lines)`);
