
/* eslint-disable no-console */

const ONE_MILLI_IN_NANOS = 1000000n;

export default class Benchmark {

    constructor(name, indexes, data, numberOfKeys, batchSize) {
        this.name = name;
        this.indexes = indexes;
        this.data = data;
        this.numberOfKeys = numberOfKeys;
        this.batchSize = batchSize;

        /** @type {Map<String, BigInt[]>} */
        this.times = new Map();
    }

    reset() {
        throw new Error("implement me!");
    }

    run(count) {
        for (let i = 0; i < count; i++) {
            this.runBuildTest();
            this.runPushTest();
            this.runPopTest();
            this.runPushPopBatchTest();
            this.runPushPopInterleaved();
            this.runPushPopRandom();
        }
    }

    getTimes() {
        const result = new Map();
        for (const [key, values] of this.times.entries()) {
            const medianInMillis = values.sort()[values.length >>> 1] / ONE_MILLI_IN_NANOS;
            result.set(key, medianInMillis);
        }
        return result;
    }

    runBuildTest() {
        this.time("build", this.buildTest.bind(this, this.indexes, this.data));
    }

    buildTest() {
        throw new Error("implement me!");
    }

    runPushTest() {
        this.time("push", this.pushTest.bind(this, this.data));
    }

    pushTest() {
        throw new Error("implement me!");
    }

    runPopTest() {
        this.time("pop", this.popTest.bind(this));
    }

    popTest() {
        throw new Error("implement me!");
    }

    runPushPopBatchTest() {
        this.time("push/pop batch", this.pushPopBatchTest.bind(this, this.data));
    }

    pushPopBatchTest() {
        throw new Error("implement me!");
    }

    runPushPopInterleaved() {
        // initialize with 10% of total keys
        const prepareSize = Math.trunc(this.numberOfKeys / 10);
        this.preparePushPopInterleaved(this.data, prepareSize);

        const remainingKeys = this.numberOfKeys - prepareSize;

        this.time("push/pop interleaved",
            this.pushPopInterleaved.bind(this, this.data, prepareSize, remainingKeys));

        // get rid of the initial pops
        this.reset();
    }

    preparePushPopInterleaved() {
        throw new Error("implement me!");
    }

    pushPopInterleaved() {
        throw new Error("implement me!");
    }

    runPushPopRandom() {
        // initialize with 10% of total keys
        const prepareSize = Math.trunc(this.numberOfKeys / 10);
        const walk = this.preparePushPopRandom(this.data, prepareSize);
        this.time("push/pop random", this.pushPopRandom.bind(this, walk));

        // get rid of any remaining pops not popped yet
        this.reset();
    }

    preparePushPopRandom() {
        throw new Error("implement me!");
    }

    pushPopRandom() {
        throw new Error("implement me!");
    }

    time(tag, fn) {
        const start = process.hrtime.bigint();
        fn();
        const end = process.hrtime.bigint();
        let times = this.times.get(tag);
        if (!times) {
            times = [];
            this.times.set(tag, times);
        }
        times.push(end - start);
    }
}
