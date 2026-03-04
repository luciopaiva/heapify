
/* eslint-disable no-console */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Benchmark from "./benchmark.js";
import ClosureBenchmark from "./closure-benchmark.js";
import FastPriorityQueueBenchmark from "./fast-priority-queue-benchmark.js";
import FlatQueueBenchmark from "./flat-queue-benchmark.js";
import HeapifyBenchmark from "./heapify-benchmark.js";
import TinyQueueBenchmark from "./tiny-queue-benchmark.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");

const PUBLISH = process.argv.includes("--publish");

const NUMBER_OF_KEYS = 1000000;
const BATCH_SIZE = 1000;
const BENCH_RUN_COUNT = 5;

const indexes: number[] = [];
const data: number[] = [];
const dataObjs: { value: number }[] = [];
for (let i = 0; i < NUMBER_OF_KEYS; i++) {
    const value = Math.floor(100 * Math.random());
    data.push(value);
    indexes.push(i + 1);
    dataObjs.push({ value });
}

interface BenchmarkData {
    names: string[];
    rows: Array<{ tag: string; values: string[] }>;
}

function consolidate(benchs: Benchmark<unknown>[]): BenchmarkData {
    const benchTimes = benchs.map(bench => bench.getTimes());
    const tags = Array.from(benchTimes[0].keys());
    const names = benchs.map(bench => bench.name);

    const paddedNames = names.map(name => name.padStart(10)).join(" ");
    console.info(`${" ".repeat(25)} ${paddedNames}`);

    const rows: Array<{ tag: string; values: string[] }> = [];
    for (const tag of tags) {
        const times = benchTimes.map(timesByTag => timesByTag.get(tag));
        const values = times.map(time =>
            time === null || time === undefined || time < 1n ? "-" : time.toString());
        const paddedValues = values.map(v => v.padStart(10)).join(" ");
        console.info(`${tag.padEnd(25)} ${paddedValues}`);
        rows.push({ tag, values });
    }

    return { names, rows };
}

function writeCsv(data: BenchmarkData, outputPath: string): void {
    const header = ["Operation", ...data.names].join(",");
    const lines = data.rows.map(row => [row.tag, ...row.values].join(","));
    writeFileSync(outputPath, [header, ...lines].join("\n") + "\n", "utf-8");
    console.info(`\nCSV written to ${outputPath}`);
}

function generateMarkdownTable(data: BenchmarkData): string {
    const headers = ["Operation", ...data.names];
    const allRows = data.rows.map(r => [r.tag, ...r.values]);

    const colWidths = headers.map((h, i) => {
        const maxValueWidth = Math.max(...allRows.map(row => (row[i] ?? "-").length));
        return Math.max(h.length, maxValueWidth);
    });

    const formatRow = (cells: string[]) =>
        "| " + cells.map((c, i) => c.padEnd(colWidths[i])).join(" | ") + " |";
    const separator =
        "|" + colWidths.map(w => "-".repeat(w + 2)).join("|") + "|";

    return [
        formatRow(headers),
        separator,
        ...data.rows.map(row => formatRow([row.tag, ...row.values])),
    ].join("\n");
}

function updateReadme(markdownTable: string, readmePath: string): void {
    const START_MARKER = "<!-- BENCHMARK_TABLE_START -->";
    const END_MARKER = "<!-- BENCHMARK_TABLE_END -->";

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

const benchs: Benchmark<unknown>[] = [
    new ClosureBenchmark(indexes, data, NUMBER_OF_KEYS, BATCH_SIZE),
    new FastPriorityQueueBenchmark(indexes, data, NUMBER_OF_KEYS, BATCH_SIZE),
    new FlatQueueBenchmark(indexes, data, NUMBER_OF_KEYS, BATCH_SIZE),
    new TinyQueueBenchmark(indexes, dataObjs, NUMBER_OF_KEYS, BATCH_SIZE),
    new HeapifyBenchmark(indexes, data, NUMBER_OF_KEYS, BATCH_SIZE),
];

for (const bench of benchs) {
    bench.run(BENCH_RUN_COUNT);
    console.info(`${bench.name} done (${BENCH_RUN_COUNT} runs)`);
}

const benchmarkData = consolidate(benchs);

writeCsv(benchmarkData, resolve(PROJECT_ROOT, "benchmark-results.csv"));

if (PUBLISH) {
    const markdownTable = generateMarkdownTable(benchmarkData);
    updateReadme(markdownTable, resolve(PROJECT_ROOT, "README.md"));
}
