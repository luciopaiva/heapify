/* eslint-disable no-console */

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

export interface BenchmarkData {
    names: string[];
    rows: Array<{ tag: string; values: string[] }>;
}

const START_MARKER = "<!-- BENCHMARK_TABLE_START -->";
const END_MARKER = "<!-- BENCHMARK_TABLE_END -->";

export function writeCsv(data: BenchmarkData, outputPath: string): void {
    const header = ["Operation", ...data.names].join(",");
    const lines = data.rows.map(row => [row.tag, ...row.values].join(","));
    writeFileSync(outputPath, `${[header, ...lines].join("\n")}\n`, "utf-8");
    console.info(`\nCSV written to ${outputPath}`);
}

export function generateMarkdownTable(data: BenchmarkData): string {
    const headers = ["Operation", ...data.names];
    const allRows = data.rows.map(r => [r.tag, ...r.values]);

    const colWidths = headers.map((h, i) => {
        const maxValueWidth = Math.max(...allRows.map(row => (row[i] ?? "-").length));
        return Math.max(h.length, maxValueWidth);
    });

    const formatRow = (cells: string[]) => `| ${cells.map((c, i) => c.padEnd(colWidths[i])).join(" | ")} |`;
    const separator =
        `|${colWidths.map(w => "-".repeat(w + 2)).join("|")}|`;

    return [
        formatRow(headers),
        separator,
        ...data.rows.map(row => formatRow([row.tag, ...row.values])),
    ].join("\n");
}

export function updateReadme(markdownTable: string, readmePath: string): void {
    const readme = readFileSync(readmePath, "utf-8");
    const startIdx = readme.indexOf(START_MARKER);
    const endIdx = readme.indexOf(END_MARKER);

    if (startIdx === -1 || endIdx === -1) {
        throw new Error("Benchmark table markers not found in README.md");
    }

    const commitHash = execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
    const isoDate = new Date().toISOString();

    const newSection = [
        "",
        markdownTable,
        "",
        `_Generated from commit \`${commitHash}\` on ${isoDate}._`,
        "",
    ].join("\n");

    const newReadme =
        readme.slice(0, startIdx + START_MARKER.length) +
        newSection +
        readme.slice(endIdx);

    writeFileSync(readmePath, newReadme, "utf-8");
    console.info("README.md updated with new benchmark results.");
}
