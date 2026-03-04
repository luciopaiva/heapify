import { generateBadgeSvg, resolveRoot, writeBadge } from "./lib/badge.mjs";
import { join } from "node:path";
import { readFileSync } from "node:fs";

const root = resolveRoot(import.meta.url);

// Read version from package.json
const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const svg = generateBadgeSvg("version", `v${version}`, "#4c1");
writeBadge(root, "version.svg", svg);

// eslint-disable-next-line no-console
console.log(`Version badge generated: v${version}`);
