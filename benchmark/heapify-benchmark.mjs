/* eslint-disable no-console */

import Benchmark from "./benchmark.mjs";
import Heapify from "../heapify.mjs";

export default class HeapifyBenchmark extends Benchmark {

    constructor(...args) {
        super("Heapify", ...args);
        this.reset();
    }

    reset() {
        this.q = new Heapify(this.numberOfKeys);
    }

    buildTest(indexes, data) {
        // eslint-disable-next-line no-new
        new Heapify(this.numberOfKeys, indexes, data);
    }

    pushTest(data) {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.push(i, data[i]);
        }
    }

    popTest() {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.pop();
        }
    }

    pushPopBatchTest(data) {
        for (let i = 0; i < this.numberOfKeys; i += this.batchSize) {
            for (let j = 0; j < this.batchSize; j++) {
                this.q.push(i, data[i + j]);
            }
            for (let j = 0; j < this.batchSize; j++) {
                this.q.pop();
            }
        }
    }

    preparePushPopInterleaved(data, prepareSize) {
        for (let i = 0; i < prepareSize; i++) {
            this.q.push(i, data[i]);
        }
    }

    pushPopInterleaved(data, prepareSize, remainingSize) {
        for (let i = prepareSize; i < remainingSize; i++) {
            this.q.push(i, data[i]);
            this.q.pop();
        }
    }
}
