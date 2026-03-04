
/* eslint-disable no-console */

import ClosureBenchmark from "./closure-benchmark.js";
import FastPriorityQueueBenchmark from "./fast-priority-queue-benchmark.js";
import FlatQueueBenchmark from "./flat-queue-benchmark.js";
import HeapifyBenchmark from "./heapify-benchmark.js";
import TinyQueueBenchmark from "./tiny-queue-benchmark.js";
import Benchmark from "./benchmark.js";

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

function consolidate(benchs: Benchmark<unknown>[]): void {
    const benchTimes = benchs.map(bench => bench.getTimes());
    const tags = Array.from(benchTimes[0].keys());
    const names = benchs.
        map(bench => bench.name).
        map(name => name.padStart(10)).
        join(" ");
    console.info(`${" ".repeat(25)} ${names}`);
    for (const tag of tags) {
        const times = benchTimes.map(timesByTag => timesByTag.get(tag));
        const values = times.map(time => (time == null || time < 1n ? "-" : time.toString()).padStart(10)).join(" ");
        console.info(`${tag.padEnd(25)} ${values}`);
    }
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

consolidate(benchs);
