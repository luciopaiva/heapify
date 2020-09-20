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
