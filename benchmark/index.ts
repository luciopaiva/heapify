/* eslint-disable no-console */

import { type BenchmarkData, generateMarkdownTable, updateReadme, writeCsv } from "./utils/publish.js";
import { dirname, resolve } from "node:path";
import Benchmark from "./benchmark.js";
import ClosureBenchmark from "./candidates/closure.js";
import FastPriorityQueueBenchmark from "./candidates/fast-priority-queue.js";
import { fileURLToPath } from "node:url";
import FlatQueueBenchmark from "./candidates/flat-queue.js";
import HeapifyBenchmark from "./candidates/heapify.js";
import TinyQueueBenchmark from "./candidates/tiny-queue.js";

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

function consolidate(benchs: Benchmark<unknown>[]): BenchmarkData {
    const benchTimes = benchs.map(bench => bench.getTimes());
    const tags = Array.from(benchTimes[0].keys());
    const names = benchs.map(bench => bench.name);

    const paddedNames = names.map(name => name.padStart(10)).join(" ");
    console.info(`${" ".repeat(25)} ${paddedNames}`);

    const rows: Array<{ tag: string; values: string[] }> = [];
    for (const tag of tags) {
        const times = benchTimes.map(timesByTag => timesByTag.get(tag));
        const values = times.map(time => time === null || time === undefined || time < 1n ? "-" : time.toString());
        const paddedValues = values.map(v => v.padStart(10)).join(" ");
        console.info(`${tag.padEnd(25)} ${paddedValues}`);
        rows.push({ tag, values });
    }

    return { names, rows };
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
