
import assert from "assert";
import mocha from "mocha";
import Heapify from "../heapify.mjs";

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

    it("should create a priority queue with given keys and priorities", function () {
        const queue = new Heapify(100, [1, 2], [50, 1]);
        assert.strictEqual(queue.length, 2);
        const key = queue.peek();
        assert.strictEqual(key, 2);
    });

    it("should only create a priority queue with same number of keys and priorities", function () {
        assert.throws(() => new Heapify(30, [1, 2], [3, 4, 5]));
    });

    it("should only create a priority queue with enough capacity", function () {
        assert.throws(() => new Heapify(1, [1, 2], [50, 1]));
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

    it("should pop undefined when queue is empty", function () {
        const queue = new Heapify();
        assert.strictEqual(queue.pop(), undefined);
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

    it("should dump priorities", function () {
        const queue = new Heapify();
        queue.push(1, 10);
        queue.push(2, 20);
        queue.push(3, 30);
        assert.strictEqual(queue.toString(), "[10 20 30]");
    });

    it("should correctly pop root and then its child", function () {
        // this triggers the logic that moves a child to the top, but still
        // without any bubbling to fix the heap
        const queue = new Heapify();
        queue.push(1, 10);
        queue.push(2, 20);
        assert.strictEqual(queue.pop(), 1);
        assert.strictEqual(queue.pop(), 2);
    });

    it("should correctly bubble down to the left after pop", function () {
        // similar to the previous test, but now we need an item to be bubbled
        // down after the first item is removed
        const queue = new Heapify();

        /*
                10
              20  30
            40
         */
        queue.push(1, 10);
        queue.push(2, 20);
        queue.push(3, 30);
        queue.push(4, 40);
        assert.strictEqual(queue.toString(), "[10 20 30 40]");

        // removing 10, now 40 is moved to the top and needs to be bubbled down
        // and we should now be triggering that logic
        queue.pop();
        assert.strictEqual(queue.toString(), "[20 40 30]");
    });

    it("should correctly bubble down to the right after pop", function () {
        // similar to the previous test, but now we need an item to be bubbled
        // down to the right
        const queue = new Heapify();

        /*
                10
              30  20
            40
         */
        queue.push(1, 10);
        queue.push(2, 30);
        queue.push(3, 20);
        queue.push(4, 40);
        assert.strictEqual(queue.toString(), "[10 30 20 40]");

        // removing 10, now 40 is moved to the top and needs to be bubbled down,
        // but this time we'll trigger the logic that moves it to the right
        queue.pop();
        assert.strictEqual(queue.toString(), "[20 30 40]");
    });

    it("should correctly bubble down after pop, but stopping before a leaf", function () {
        // similar to the previous test, but now we need an item to be bubbled
        // down to the left and stop somewhere before reaching a leaf, so we
        // can test the logic that evaluates and to stop bubbling
        const queue = new Heapify();

        /*
                  10
              20      30
            40  35
         */
        queue.push(1, 10);
        queue.push(2, 20);
        queue.push(3, 30);
        queue.push(4, 40);
        queue.push(5, 35);
        assert.strictEqual(queue.toString(), "[10 20 30 40 35]");

        // removing 10, now 35 is moved to the top and needs to be bubbled down,
        // but it should only goes as far as the second level
        queue.pop();
        assert.strictEqual(queue.toString(), "[20 35 30 40]");
    });

    it("should correctly bubble up when inserting a higher priority item in a non-empty queue", function () {
        const queue = new Heapify();

        queue.push(1, 20);
        // now we insert a higher priority and it should bubble to the top
        queue.push(2, 10);
        assert.strictEqual(queue.toString(), "[10 20]");
    });
});
