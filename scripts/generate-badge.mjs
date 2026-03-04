import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Read coverage summary produced by vitest --coverage with json-summary reporter
const summaryPath = join(root, "coverage", "coverage-summary.json");
const summary = JSON.parse(readFileSync(summaryPath, "utf8"));

const total = summary.total;
const { covered, total: count } = total.lines;
const pct = count > 0 ? Math.floor((covered / count) * 100) : 0;

// Colour thresholds
let color;
if (pct >= 90) color = "#4c1";
else if (pct >= 80) color = "#a3c51c";
else if (pct >= 70) color = "#dfb317";
else if (pct >= 60) color = "#fe7d37";
else color = "#e05d44";

const label = "coverage";
const value = `${pct}%`;

// Measure approximate text widths (Verdana 11px, ~6.5px per char average)
const CHAR_WIDTH = 6.5;
const PADDING = 10;
const labelWidth = Math.round(label.length * CHAR_WIDTH + PADDING);
const valueWidth = Math.round(value.length * CHAR_WIDTH + PADDING);
const totalWidth = labelWidth + valueWidth;

const labelX = Math.round(labelWidth / 2);
const valueX = labelWidth + Math.round(valueWidth / 2);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="3" width="${totalWidth}" height="20" fill="#555"/>
  <rect rx="3" x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
  <rect x="${labelWidth}" width="4" height="20" fill="${color}"/>
  <rect rx="3" width="${totalWidth}" height="20" fill="url(#s)"/>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="${labelX}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelX}" y="14">${label}</text>
    <text x="${valueX}" y="15" fill="#010101" fill-opacity=".3">${value}</text>
    <text x="${valueX}" y="14">${value}</text>
  </g>
</svg>`;

const badgesDir = join(root, "badges");
mkdirSync(badgesDir, { recursive: true });
writeFileSync(join(badgesDir, "coverage.svg"), svg, "utf8");

console.log(`Coverage badge generated: ${pct}% (${covered}/${count} lines)`);
