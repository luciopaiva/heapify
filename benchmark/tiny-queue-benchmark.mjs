/* eslint-disable no-console */

import Benchmark from "./benchmark.mjs";
import TinyQueue from "tinyqueue";

export default class TinyQueueBenchmark extends Benchmark {

    constructor(...args) {
        super("tinyqueue", ...args);
        this.reset();
    }

    reset() {
        this.q = new TinyQueue([], (a, b) => a.value - b.value);
    }

    buildTest() {
        // override parent class and do nothing
    }

    pushTest(data) {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.push(data[i]);
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
                this.q.push(data[i + j]);
            }
            for (let j = 0; j < this.batchSize; j++) {
                this.q.pop();
            }
        }
    }

    preparePushPopInterleaved(data, prepareSize) {
        for (let i = 0; i < prepareSize; i++) {
            this.q.push(data[i]);
        }
    }

    pushPopInterleaved(data, prepareSize, remainingSize) {
        for (let i = prepareSize; i < remainingSize; i++) {
            this.q.push(data[i]);
            this.q.pop();
        }
    }
}
