
const ONE_MILLI_IN_NANOS = 1000000n;

export default abstract class Benchmark<TData> {

    name: string;
    indexes: number[];
    data: TData[];
    numberOfKeys: number;
    batchSize: number;
    times: Map<string, bigint[]>;

    constructor(name: string, indexes: number[], data: TData[], numberOfKeys: number, batchSize: number) {
        this.name = name;
        this.indexes = indexes;
        this.data = data;
        this.numberOfKeys = numberOfKeys;
        this.batchSize = batchSize;

        this.times = new Map();
    }

    abstract reset(): void;

    run(count: number): void {
        for (let i = 0; i < count; i++) {
            this.runBuildTest();
            this.runPushTest();
            this.runPopTest();
            this.runPushPopBatchTest();
            this.runPushPopInterleaved();
            this.runPushPopRandom();
        }
    }

    getTimes(): Map<string, bigint> {
        const result = new Map<string, bigint>();
        for (const [key, values] of this.times.entries()) {
            const medianInMillis = values.sort()[values.length >>> 1] / ONE_MILLI_IN_NANOS;
            result.set(key, medianInMillis);
        }
        return result;
    }

    runBuildTest(): void {
        this.time("build", () => this.buildTest(this.indexes, this.data));
    }

    abstract buildTest(indexes: number[], data: TData[]): void;

    runPushTest(): void {
        this.time("push", () => this.pushTest(this.data));
    }

    abstract pushTest(data: TData[]): void;

    runPopTest(): void {
        this.time("pop", () => this.popTest());
    }

    abstract popTest(): void;

    runPushPopBatchTest(): void {
        this.time("push/pop batch", () => this.pushPopBatchTest(this.data));
    }

    abstract pushPopBatchTest(data: TData[]): void;

    runPushPopInterleaved(): void {
        // initialize with 10% of total keys
        const prepareSize = Math.trunc(this.numberOfKeys / 10);
        this.preparePushPopInterleaved(this.data, prepareSize);

        const remainingKeys = this.numberOfKeys - prepareSize;

        this.time("push/pop interleaved",
            () => this.pushPopInterleaved(this.data, prepareSize, remainingKeys));

        // get rid of the initial pops
        this.reset();
    }

    abstract preparePushPopInterleaved(data: TData[], prepareSize: number): void;

    abstract pushPopInterleaved(data: TData[], prepareSize: number, remainingSize: number): void;

    runPushPopRandom(): void {
        // initialize with 10% of total keys
        const prepareSize = Math.trunc(this.numberOfKeys / 10);
        const walk = this.preparePushPopRandom(this.data, prepareSize);
        this.time("push/pop random", () => this.pushPopRandom(walk));

        // get rid of any remaining pops not popped yet
        this.reset();
    }

    abstract preparePushPopRandom(data: TData[], prepareSize: number): Array<() => void>;

    abstract pushPopRandom(walk: Array<() => void>): void;

    time(tag: string, fn: () => void): void {
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
