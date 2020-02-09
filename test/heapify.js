
import assert from "assert";
import mocha from "mocha";
import Heapify from "../heapify.js";

const {describe, it} = mocha;

describe("Heapify", function () {
    it("should create a priority queue", function () {
        const queue = new Heapify();
        assert(queue instanceof Heapify);
    });

    it("should create a priority queue with a specified capacity", function () {
        const queue = new Heapify(123);
        assert.strictEqual(queue.capacity, 123);
        assert.strictEqual(queue.length, 0);
    });

    it("should be able to push new items", function () {
        const queue = new Heapify();
        assert.strictEqual(queue.length, 0);
        queue.push(1, 10);
        assert.strictEqual(queue.length, 1);
    });

    it("should not be able to push new items over capacity", function () {
        const queue = new Heapify(1);
        assert.strictEqual(queue.length, 0);
        queue.push(1, 10);
        assert.strictEqual(queue.length, 1);
        assert.throws(() => queue.push(2, 20));
        assert.strictEqual(queue.length, 1);
    });

    it("should be able to pop an item", function () {
        const queue = new Heapify();
        queue.push(123, 456);
        assert.strictEqual(queue.length, 1);
        const key = queue.pop();
        assert.strictEqual(queue.length, 0);
        assert.strictEqual(key, 123);
    });

    it("should be able to peek an item", function () {
        const queue = new Heapify();
        queue.push(123, 456);
        assert.strictEqual(queue.length, 1);
        const key = queue.peek();
        assert.strictEqual(queue.length, 1);
        assert.strictEqual(key, 123);
    });

    it("should be able to peek the priority of an item", function () {
        const queue = new Heapify();
        queue.push(123, 456);
        assert.strictEqual(queue.length, 1);
        const priority = queue.peekPriority();
        assert.strictEqual(queue.length, 1);
        assert.strictEqual(priority, 456);
    });

    it("should support 32-bit keys", function () {
        const VALID_32BIT_KEY = 2 ** 32 - 1;  // greatest 32-bit value
        const INVALID_32BIT_KEY = VALID_32BIT_KEY + 1;

        const queue = new Heapify();

        queue.push(VALID_32BIT_KEY, 456);
        const key1 = queue.pop();
        assert.strictEqual(key1, VALID_32BIT_KEY);

        // let's make sure it's passing for the right reason
        // 2**32 should truncate the 33rd bit and return 0
        queue.push(INVALID_32BIT_KEY, 456);
        const key2 = queue.pop();
        assert.strictEqual(key2, 0);
    });

    it("should support 32-bit priorities", function () {
        const VALID_32BIT_PRIORITY = 2 ** 32 - 1;  // greatest 32-bit value
        const INVALID_32BIT_PRIORITY = VALID_32BIT_PRIORITY + 1;

        const queue = new Heapify();

        queue.push(123, VALID_32BIT_PRIORITY);
        const priority1 = queue.peekPriority();
        assert.strictEqual(priority1, VALID_32BIT_PRIORITY);

        queue.clear();

        // let's make sure it's passing for the right reason
        // 2**32 should truncate the 33rd bit and return 0
        queue.push(123, INVALID_32BIT_PRIORITY);
        const priority2 = queue.peekPriority();
        assert.strictEqual(priority2, 0);
    });
});
