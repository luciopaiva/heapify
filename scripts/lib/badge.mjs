import { dirname, join } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Returns the repository root path, resolved relative to any script's import.meta.url.
 * @param {string} importMetaUrl - pass `import.meta.url` from the calling script
 * @returns {string}
 */
export function resolveRoot(importMetaUrl) {
    return join(dirname(fileURLToPath(importMetaUrl)), "..");
}

// Verdana 11px, ~6.5px per char average
const CHAR_WIDTH = 6.5;
const PADDING = 10;

/**
 * Builds a flat two-section SVG badge.
 * @param {string} label - left section text
 * @param {string} value - right section text
 * @param {string} color - right section fill colour (hex or named)
 * @returns {string} SVG markup
 */
export function generateBadgeSvg(label, value, color) {
    const labelWidth = Math.round(label.length * CHAR_WIDTH + PADDING);
    const valueWidth = Math.round(value.length * CHAR_WIDTH + PADDING);
    const totalWidth = labelWidth + valueWidth;

    const labelX = Math.round(labelWidth / 2);
    const valueX = labelWidth + Math.round(valueWidth / 2);

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
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
}

/**
 * Writes an SVG badge file into the `badges/` directory at the repo root.
 * @param {string} root - repo root path (from resolveRoot)
 * @param {string} filename - output filename, e.g. "coverage.svg"
 * @param {string} svg - SVG markup string
 */
export function writeBadge(root, filename, svg) {
    const badgesDir = join(root, "badges");
    mkdirSync(badgesDir, { recursive: true });
    writeFileSync(join(badgesDir, filename), svg, "utf8");
}
