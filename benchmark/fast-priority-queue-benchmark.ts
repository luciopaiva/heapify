
import Benchmark from "./benchmark.js";
import FastPriorityQueue from "fastpriorityqueue";

export default class FastPriorityQueueBenchmark extends Benchmark<number> {

    q: FastPriorityQueue<number>;

    constructor(indexes: number[], data: number[], numberOfKeys: number, batchSize: number) {
        super("FastPQ", indexes, data, numberOfKeys, batchSize);
        this.q = new FastPriorityQueue<number>();
    }

    reset(): void {
        this.q = new FastPriorityQueue<number>();
    }

    buildTest(_indexes: number[], data: number[]): void {
        this.q.heapify(Array.from(data));
    }

    pushTest(data: number[]): void {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.add(data[i]);
        }
    }

    popTest(): void {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.poll();
        }
    }

    pushPopBatchTest(data: number[]): void {
        for (let i = 0; i < this.numberOfKeys; i += this.batchSize) {
            for (let j = 0; j < this.batchSize; j++) {
                this.q.add(data[i + j]);
            }
            for (let j = 0; j < this.batchSize; j++) {
                this.q.poll();
            }
        }
    }

    preparePushPopInterleaved(data: number[], prepareSize: number): void {
        for (let i = 0; i < prepareSize; i++) {
            this.q.add(data[i]);
        }
    }

    pushPopInterleaved(data: number[], prepareSize: number, remainingSize: number): void {
        for (let i = prepareSize; i < remainingSize; i++) {
            this.q.add(data[i]);
            this.q.poll();
        }
    }

    preparePushPopRandom(data: number[], prepareSize: number): Array<() => void> {
        // add a few before starting
        for (let i = 0; i < prepareSize; i++) {
            this.q.add(data[i]);
        }
        const remainingSize = this.numberOfKeys - prepareSize;

        const walk: Array<() => void> = [];
        const pop = this.q.poll.bind(this.q);
        for (let i = prepareSize; i < remainingSize; i++) {
            walk.push(Math.random() < 0.5 ? () => this.q.add(data[i]) : pop);
        }
        return walk;
    }

    pushPopRandom(walk: Array<() => void>): void {
        for (const element of walk) {
            element();
        }
    }
}
