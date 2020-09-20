/* eslint-disable no-console */
/* global goog */

import "google-closure-library";
import Benchmark from "./benchmark.mjs";

goog.require("goog.structs.Heap");

export default class ClosureBenchmark extends Benchmark {

    constructor(...args) {
        super("Closure", ...args);
        this.reset();
    }

    reset() {
        this.q = new goog.structs.Heap();

        this.buildQ = new goog.structs.Heap();
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.buildQ.insert(this.indexes[i], this.data[i]);
        }
    }

    buildTest() {
        this.q.insertAll(this.buildQ);
    }

    pushTest(data) {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.insert(data[i], i);
        }
    }

    popTest() {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.remove();
        }
    }

    pushPopBatchTest(data) {
        for (let i = 0; i < this.numberOfKeys; i += this.batchSize) {
            for (let j = 0; j < this.batchSize; j++) {
                this.q.insert(data[i + j], i);
            }
            for (let j = 0; j < this.batchSize; j++) {
                this.q.remove();
            }
        }
    }

    preparePushPopInterleaved(data, prepareSize) {
        for (let i = 0; i < prepareSize; i++) {
            this.q.insert(data[i], i);
        }
    }

    pushPopInterleaved(data, prepareSize, remainingSize) {
        for (let i = prepareSize; i < remainingSize; i++) {
            this.q.insert(data[i], i);
            this.q.remove();
        }
    }

    preparePushPopRandom(data, prepareSize) {
        // add a few before starting
        for (let i = 0; i < prepareSize; i++) {
            this.q.insert(data[i], i);
        }
        const remainingSize = this.numberOfKeys - prepareSize;

        const walk = [];
        const pop = this.q.remove.bind(this.q);
        for (let i = prepareSize; i < remainingSize; i++) {
            walk.push(Math.random() < 0.5 ? this.q.insert.bind(this.q, data[i], i) : pop);
        }
        return walk;
    }

    pushPopRandom(walk) {
        for (let i = 0; i < walk.length; i++) {
            walk[i]();
        }
    }
}
