
import Benchmark from "./benchmark.js";
import { MinQueue } from "heapify";

export default class HeapifyBenchmark extends Benchmark<number> {

    q: MinQueue;

    constructor(indexes: number[], data: number[], numberOfKeys: number, batchSize: number) {
        super("Heapify", indexes, data, numberOfKeys, batchSize);
        this.q = new MinQueue(this.numberOfKeys);
    }

    reset(): void {
        this.q = new MinQueue(this.numberOfKeys);
    }

    buildTest(indexes: number[], data: number[]): void {
        // eslint-disable-next-line no-new
        new MinQueue(this.numberOfKeys, indexes, data);
    }

    pushTest(data: number[]): void {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.push(i, data[i]);
        }
    }

    popTest(): void {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.pop();
        }
    }

    pushPopBatchTest(data: number[]): void {
        for (let i = 0; i < this.numberOfKeys; i += this.batchSize) {
            for (let j = 0; j < this.batchSize; j++) {
                this.q.push(i, data[i + j]);
            }
            for (let j = 0; j < this.batchSize; j++) {
                this.q.pop();
            }
        }
    }

    preparePushPopInterleaved(data: number[], prepareSize: number): void {
        for (let i = 0; i < prepareSize; i++) {
            this.q.push(i, data[i]);
        }
    }

    pushPopInterleaved(data: number[], prepareSize: number, remainingSize: number): void {
        for (let i = prepareSize; i < remainingSize; i++) {
            this.q.push(i, data[i]);
            this.q.pop();
        }
    }

    preparePushPopRandom(data: number[], prepareSize: number): Array<() => void> {
        for (let i = 0; i < prepareSize; i++) {
            this.q.push(i, data[i]);
        }
        const remainingSize = this.numberOfKeys - prepareSize;

        const walk: Array<() => void> = [];
        const pop = this.q.pop.bind(this.q);
        for (let i = prepareSize; i < remainingSize; i++) {
            walk.push(Math.random() < 0.5 ? () => this.q.push(i, data[i]) : pop);
        }
        return walk;
    }

    pushPopRandom(walk: Array<() => void>): void {
        for (const element of walk) {
            element();
        }
    }
}
