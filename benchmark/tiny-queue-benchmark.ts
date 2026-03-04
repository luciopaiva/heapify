
import Benchmark from "./benchmark.js";
import TinyQueue from "tinyqueue";

type Item = { value: number };

export default class TinyQueueBenchmark extends Benchmark<Item> {

    q: TinyQueue<Item>;

    constructor(indexes: number[], data: Item[], numberOfKeys: number, batchSize: number) {
        super("TinyQueue", indexes, data, numberOfKeys, batchSize);
        this.q = new TinyQueue<Item>([], (a, b) => a.value - b.value);
    }

    reset(): void {
        this.q = new TinyQueue<Item>([], (a, b) => a.value - b.value);
    }

    buildTest(): void {
        // override parent class and do nothing
    }

    pushTest(data: Item[]): void {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.push(data[i]);
        }
    }

    popTest(): void {
        for (let i = 0; i < this.numberOfKeys; i++) {
            this.q.pop();
        }
    }

    pushPopBatchTest(data: Item[]): void {
        for (let i = 0; i < this.numberOfKeys; i += this.batchSize) {
            for (let j = 0; j < this.batchSize; j++) {
                this.q.push(data[i + j]);
            }
            for (let j = 0; j < this.batchSize; j++) {
                this.q.pop();
            }
        }
    }

    preparePushPopInterleaved(data: Item[], prepareSize: number): void {
        for (let i = 0; i < prepareSize; i++) {
            this.q.push(data[i]);
        }
    }

    pushPopInterleaved(data: Item[], prepareSize: number, remainingSize: number): void {
        for (let i = prepareSize; i < remainingSize; i++) {
            this.q.push(data[i]);
            this.q.pop();
        }
    }

    preparePushPopRandom(data: Item[], prepareSize: number): Array<() => void> {
        // add a few before starting
        for (let i = 0; i < prepareSize; i++) {
            this.q.push(data[i]);
        }
        const remainingSize = this.numberOfKeys - prepareSize;

        const walk: Array<() => void> = [];
        const pop = this.q.pop.bind(this.q);
        for (let i = prepareSize; i < remainingSize; i++) {
            walk.push(Math.random() < 0.5 ? () => this.q.push(data[i]) : pop);
        }
        return walk;
    }

    pushPopRandom(walk: Array<() => void>): void {
        for (const element of walk) {
            element();
        }
    }
}
