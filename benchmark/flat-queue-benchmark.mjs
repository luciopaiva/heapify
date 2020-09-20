/* eslint-disable no-console */

import Benchmark from "./benchmark.mjs";
import FlatQueue from "flatqueue";

export default class FlatQueueBenchmark extends Benchmark {

    constructor(...args) {
        super("FlatQueue", ...args);
        this.reset();
    }

    reset() {
        this.q = new FlatQueue();
    }

    buildTest() {
        // override parent class and do nothing
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
