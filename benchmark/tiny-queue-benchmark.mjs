/* eslint-disable no-console */

import Benchmark from "./benchmark.mjs";
import TinyQueue from "tinyqueue";

export default class TinyQueueBenchmark extends Benchmark {

    constructor(...args) {
        super("TinyQueue", ...args);
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

    preparePushPopRandom(data, prepareSize) {
        // add a few before starting
        for (let i = 0; i < prepareSize; i++) {
            this.q.push(i, data[i]);
        }
        const remainingSize = this.numberOfKeys - prepareSize;

        const walk = [];
        const pop = this.q.pop.bind(this.q);
        for (let i = prepareSize; i < remainingSize; i++) {
            walk.push(Math.random() < 0.5 ? this.q.push.bind(this.q, i, data[i]) : pop);
        }
        return walk;
    }

    pushPopRandom(walk) {
        for (let i = 0; i < walk.length; i++) {
            walk[i]();
        }
    }
}
