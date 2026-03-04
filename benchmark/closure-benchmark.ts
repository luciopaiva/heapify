
/* eslint-disable @typescript-eslint/no-explicit-any */

import "google-closure-library";
import Benchmark from "./benchmark.js";

declare const goog: any;

goog.require("goog.structs.Heap");

export default class ClosureBenchmark extends Benchmark<number> {

    q: any;
    buildQ: any;

    constructor(indexes: number[], data: number[], numberOfKeys: number, batchSize: number) {
        super("Closure", indexes, data, numberOfKeys, batchSize);
        this.q = new goog.structs.Heap();
        this.buildQ = new goog.structs.Heap();
        this.reset();
    }

    reset(): void {
        this.q = new goog.structs.Heap();

        this.buildQ = new goog.structs.Heap();
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.buildQ.insert(this.indexes[i], this.data[i]);
        }
    }

    buildTest(): void {
        this.q.insertAll(this.buildQ);
    }

    pushTest(data: number[]): void {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.insert(data[i], i);
        }
    }

    popTest(): void {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.remove();
        }
    }

    pushPopBatchTest(data: number[]): void {
        for (let i = 0; i < this.numberOfKeys; i += this.batchSize) {
            for (let j = 0; j < this.batchSize; j++) {
                this.q.insert(data[i + j], i);
            }
            for (let j = 0; j < this.batchSize; j++) {
                this.q.remove();
            }
        }
    }

    preparePushPopInterleaved(data: number[], prepareSize: number): void {
        for (let i = 0; i < prepareSize; i++) {
            this.q.insert(data[i], i);
        }
    }

    pushPopInterleaved(data: number[], prepareSize: number, remainingSize: number): void {
        for (let i = prepareSize; i < remainingSize; i++) {
            this.q.insert(data[i], i);
            this.q.remove();
        }
    }

    preparePushPopRandom(data: number[], prepareSize: number): Array<() => void> {
        // add a few before starting
        for (let i = 0; i < prepareSize; i++) {
            this.q.insert(data[i], i);
        }
        const remainingSize = this.numberOfKeys - prepareSize;

        const walk: Array<() => void> = [];
        const pop = this.q.remove.bind(this.q);
        for (let i = prepareSize; i < remainingSize; i++) {
            walk.push(Math.random() < 0.5 ? () => this.q.insert(data[i], i) : pop);
        }
        return walk;
    }

    pushPopRandom(walk: Array<() => void>): void {
        for (const element of walk) {
            element();
        }
    }
}
