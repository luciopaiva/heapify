
import * as assert from "assert";
import {MinQueue} from "../src/heapify";

/* eslint-disable max-lines-per-function */
describe("MinQueue", () => {
    /* eslint-enable max-lines-per-function */

    test("create simple priority queue", () => {
        const queue = new MinQueue();
        assert(queue instanceof MinQueue);
    });

    test("default capacity", () => {
        const queue = new MinQueue();
        assert.strictEqual(queue.capacity, 64);
    });

    test("create priority queue with specified capacity", () => {
        const queue = new MinQueue(123);
        assert.strictEqual(queue.capacity, 123);
        assert.strictEqual(queue.size, 0);
    });

    test("create priority queue with given keys and priorities", () => {
        const queue = new MinQueue(100, [1, 2], [50, 1]);
        assert.strictEqual(queue.size, 2);
        const key = queue.peek();
        assert.strictEqual(key, 2);
    });

    test("should only create priority queue with same number of keys and priorities", () => {
        assert.throws(() => new MinQueue(30, [1, 2], [3, 4, 5]));
    });

    test("should only create priority queue if has enough capacity", () => {
        assert.throws(() => new MinQueue(1, [1, 2], [50, 1]));
    });

    test("push item", () => {
        const queue = new MinQueue();
        assert.strictEqual(queue.size, 0);
        queue.push(1, 10);
        assert.strictEqual(queue.size, 1);
    });

    test("should not be able to push new items beyond capacity", () => {
        const queue = new MinQueue(1);
        assert.strictEqual(queue.size, 0);
        queue.push(1, 10);
        assert.strictEqual(queue.size, 1);
        assert.throws(() => queue.push(2, 20));
        assert.strictEqual(queue.size, 1);
    });

    test("pop item", () => {
        const queue = new MinQueue();
        queue.push(123, 456);
        assert.strictEqual(queue.size, 1);
        const key = queue.pop();
        assert.strictEqual(queue.size, 0);
        assert.strictEqual(key, 123);
    });

    test("should pop undefined when queue is empty", () => {
        const queue = new MinQueue();
        assert.strictEqual(queue.pop(), undefined);
    });

    test("peek item", () => {
        const queue = new MinQueue();
        queue.push(123, 456);
        assert.strictEqual(queue.size, 1);
        const key = queue.peek();
        assert.strictEqual(queue.size, 1);
        assert.strictEqual(key, 123);
    });

    test("peek priority of item", () => {
        const queue = new MinQueue();
        queue.push(123, 456);
        assert.strictEqual(queue.size, 1);
        const priority = queue.peekPriority();
        assert.strictEqual(queue.size, 1);
        assert.strictEqual(priority, 456);
    });

    test("should support 32-bit keys", () => {
        const VALID_32BIT_KEY = 2 ** 32 - 1;  // greatest 32-bit value
        const INVALID_32BIT_KEY = VALID_32BIT_KEY + 1;

        const queue = new MinQueue();

        queue.push(VALID_32BIT_KEY, 456);
        const key1 = queue.pop();
        assert.strictEqual(key1, VALID_32BIT_KEY);

        /*
         * let's make sure it's passing for the right reason
         * 2**32 should truncate the 33rd bit and return 0
         */
        queue.push(INVALID_32BIT_KEY, 456);
        const key2 = queue.pop();
        assert.strictEqual(key2, 0);
    });

    test("should support 32-bit priorities", () => {
        const VALID_32BIT_PRIORITY = 2 ** 32 - 1;  // greatest 32-bit value
        const INVALID_32BIT_PRIORITY = VALID_32BIT_PRIORITY + 1;

        const queue = new MinQueue();

        queue.push(123, VALID_32BIT_PRIORITY);
        const priority1 = queue.peekPriority();
        assert.strictEqual(priority1, VALID_32BIT_PRIORITY);

        queue.clear();

        /*
         * let's make sure it's passing for the right reason
         * 2**32 should truncate the 33rd bit and return 0
         */
        queue.push(123, INVALID_32BIT_PRIORITY);
        const priority2 = queue.peekPriority();
        assert.strictEqual(priority2, 0);
    });

    test("pop root and then its child", () => {
        // this triggers the logic that moves a child to the top, but still without any bubbling to fix the heap
        const queue = new MinQueue();
        queue.push(1, 10);
        queue.push(2, 20);
        assert.strictEqual(queue.pop(), 1);
        assert.strictEqual(queue.pop(), 2);
    });

    test("bubble down to the left after pop", () => {
        // similar to the previous test, but now we need an item to be bubbled down after the first item is removed
        const queue = new MinQueue();

        /*
         *       10
         *     20  30
         *   40
         */
        queue.push(1, 10);
        queue.push(2, 20);
        queue.push(3, 30);
        queue.push(4, 40);
        assert.strictEqual(queue.dumpRawPriorities(), "[10 20 30 40]");

        /*
         * removing 10, now 40 is moved to the top and needs to be bubbled down
         * and we should now be triggering that logic
         */
        queue.pop();
        assert.strictEqual(queue.dumpRawPriorities(), "[20 40 30]");
    });

    test("bubble down to the right after pop", () => {
        // similar to the previous test, but now we need an item to be bubbled down to the right
        const queue = new MinQueue();

        /*
         *       10
         *     30  20
         *   40
         */
        queue.push(1, 10);
        queue.push(2, 30);
        queue.push(3, 20);
        queue.push(4, 40);
        assert.strictEqual(queue.dumpRawPriorities(), "[10 30 20 40]");

        /*
         * removing 10, now 40 is moved to the top and needs to be bubbled down,
         * but this time we'll trigger the logic that moves it to the right
         */
        queue.pop();
        assert.strictEqual(queue.dumpRawPriorities(), "[20 30 40]");
    });

    test("bubble down after pop, but stopping before a leaf", () => {

        /*
         * similar to the previous test, but now we need an item to be bubbled
         * down to the left and stop somewhere before reaching a leaf, so we
         * can test the logic that evaluates when to stop bubbling
         */
        const queue = new MinQueue();

        /*
         *         10
         *     20      30
         *   40  35
         */
        queue.push(1, 10);
        queue.push(2, 20);
        queue.push(3, 30);
        queue.push(4, 40);
        queue.push(5, 35);
        assert.strictEqual(queue.dumpRawPriorities(), "[10 20 30 40 35]");

        /*
         * removing 10, now 35 is moved to the top and needs to be bubbled down,
         * but it should only goes as far as the second level
         */
        queue.pop();
        assert.strictEqual(queue.dumpRawPriorities(), "[20 35 30 40]");
    });

    test("bubble up when inserting a higher priority item in a non-empty queue", () => {
        const queue = new MinQueue();

        queue.push(1, 20);
        // now we insert a higher priority and it should bubble to the top
        queue.push(2, 10);
        assert.strictEqual(queue.dumpRawPriorities(), "[10 20]");
    });

    test("bubble down after a fast pop", () => {

        /*
         * this reproduces a situation caused by a bug introduced in 0.4.0 in
         * which a fast pop followed by a push breaks the bubble down algorithm
         */
        const queue = new MinQueue();
        queue.push(1, 1);
        queue.push(3, 3);
        queue.push(2, 2);
        // this is where the fast pop decreases length, but keeps the popped root there
        assert.strictEqual(queue.pop(), 1);

        /*
         * This inserts 4 at the root and then bubbles it down. Since length was incorrectly
         * not incremented yet (v0.4.0), the algorithm misses element 2, bubbling 4 down to
         * the left instead of to the right as it should.
         */
        queue.push(4, 4);
        // v0.4.0 returns 3 here
        assert.strictEqual(queue.pop(), 2);
    });
});
