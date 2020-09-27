/* global BigUint64Array, BigInt64Array */

import assert from "assert";
import Heapify from "../heapify.mjs";
import mocha from "mocha";

const {describe, it} = mocha;

/* eslint-disable max-lines-per-function */
describe("Heapify", () => {
    /* eslint-enable max-lines-per-function */

    it("should create a priority queue", () => {
        const queue = new Heapify();
        assert(queue instanceof Heapify);
    });

    it("should have a default capacity", () => {
        const queue = new Heapify();
        assert.strictEqual(queue.capacity, 64);
    });

    it("should create a priority queue with a specified capacity", () => {
        const queue = new Heapify(123);
        assert.strictEqual(queue.capacity, 123);
        assert.strictEqual(queue.size, 0);
    });

    it("should create a priority queue with a specified capacity via object", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            capacity: 123
        });
        assert.strictEqual(queue.capacity, 123);
        assert.strictEqual(queue.size, 0);
    });

    it("should throw if more than one argument provided to constructor", () => {
        assert.throws(() => new Heapify(1, 2));
    });

    it("should create a priority queue with given keys and priorities", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            capacity: 2,
            keys: [1, 2],
            priorities: [50, 1],
        });
        assert.strictEqual(queue.size, 2);
        assert.strictEqual(queue.dumpRawKeys(), "[2 1]");
        assert.strictEqual(queue.dumpRawPriorities(), "[1 50]");
    });

    it("should only create a priority queue with same number of keys and priorities", () => {
        assert.throws(() => new Heapify(/** @type {HeapifyOptions} */ {
            capacity: 3,
            keys: [1, 2],
            priorities: [3, 4, 5],
        }));
        assert.throws(() => new Heapify(/** @type {HeapifyOptions} */ {
            capacity: 3,
            keys: [1, 2, 3],
            priorities: [3, 4],
        }));
    });

    it("should accept different array types", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            keys: [1, 2, 0x10003],  // 0x10003 should get truncated to 3 due to the use of the 16-bit array type
            priorities: [0x10, 0x20, 0x10030],  // 0x10030 should get truncated to 3 due to the 16-bit array type
            keysBackingArrayType: Uint16Array,
            prioritiesBackingArrayType: Uint16Array,
        });
        assert.strictEqual(queue.dumpRawKeys(), "[1 2 3]");
        assert.strictEqual(queue.dumpRawPriorities(), "[16 32 48]");
    });

    it("should work with Uint8Array types", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            keys: [1, 2, 3],
            priorities: [20, 30, 10],
            keysBackingArrayType: Uint8Array,
            prioritiesBackingArrayType: Uint8Array,
        });
        assert.strictEqual(queue.dumpRawKeys(), "[3 2 1]");
    });

    it("should work with Uint8ClampedArray types", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            keys: [1, 2, 3],
            priorities: [20, 30, 10],
            keysBackingArrayType: Uint8ClampedArray,
            prioritiesBackingArrayType: Uint8ClampedArray,
        });
        assert.strictEqual(queue.dumpRawKeys(), "[3 2 1]");
    });

    it("should work with Int8Array types", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            keys: [-1, 2, -3],
            priorities: [20, -30, -10],
            keysBackingArrayType: Int8Array,
            prioritiesBackingArrayType: Int8Array,
        });
        assert.strictEqual(queue.dumpRawKeys(), "[2 -1 -3]");
    });

    it("should work with Uint16Array types", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            keys: [1, 2, 3],
            priorities: [20, 30, 10],
            keysBackingArrayType: Uint16Array,
            prioritiesBackingArrayType: Uint16Array,
        });
        assert.strictEqual(queue.dumpRawKeys(), "[3 2 1]");
    });

    it("should work with Int16Array types", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            keys: [-1, -2, 3],
            priorities: [20, -30, -10],
            keysBackingArrayType: Int16Array,
            prioritiesBackingArrayType: Int16Array,
        });
        assert.strictEqual(queue.dumpRawKeys(), "[-2 -1 3]");
    });

    it("should work with Uint32Array types", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            keys: [1, 2, 3],
            priorities: [20, 30, 10],
            keysBackingArrayType: Uint32Array,
            prioritiesBackingArrayType: Uint32Array,
        });
        assert.strictEqual(queue.dumpRawKeys(), "[3 2 1]");
    });

    it("should work with Int32Array types", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            keys: [1, -2, -3],
            priorities: [20, -30, -10],
            keysBackingArrayType: Int32Array,
            prioritiesBackingArrayType: Int32Array,
        });
        assert.strictEqual(queue.dumpRawKeys(), "[-2 1 -3]");
    });

    it("should work with Float32Array types", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            keys: [1, -2, 3],
            priorities: [10.2, 30.1, 10.1],
            keysBackingArrayType: Float32Array,
            prioritiesBackingArrayType: Float32Array,
        });
        assert.strictEqual(queue.dumpRawKeys(), "[3 -2 1]");
    });

    it("should work with Float64Array types", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            keys: [1, 2, -3],
            priorities: [10.2, -30.1, -10.1],
            keysBackingArrayType: Float64Array,
            prioritiesBackingArrayType: Float64Array,
        });
        assert.strictEqual(queue.dumpRawKeys(), "[2 1 -3]");
    });

    it("should work with BigUint64Array types", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            keys: [1n, 2n, 3n],
            priorities: [20n, 30n, 10n],
            keysBackingArrayType: BigUint64Array,
            prioritiesBackingArrayType: BigUint64Array,
        });
        assert.strictEqual(queue.dumpRawKeys(), "[3 2 1]");
    });

    it("should work with BigInt64Array types", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            keys: [1n, -2n, -3n],
            priorities: [20n, -30n, -10n],
            keysBackingArrayType: BigInt64Array,
            prioritiesBackingArrayType: BigInt64Array,
        });
        assert.strictEqual(queue.dumpRawKeys(), "[-2 1 -3]");
    });

    it("should override capacity if number of keys provided is greater", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            capacity: 1,
            keys: [1, 2],
            priorities: [50, 1]
        });
        assert.strictEqual(queue.capacity, 2);
    });

    it("should be able to push new items", () => {
        const queue = new Heapify();
        assert.strictEqual(queue.size, 0);
        queue.push(1, 10);
        assert.strictEqual(queue.size, 1);
    });

    it("should be able to push beyond capacity if auto grow is enabled", () => {

        /**
         * Will push two items and verify that size and capacity are ok
         */
        function pushTwice(queue) {
            assert.strictEqual(queue.size, 0);
            assert.strictEqual(queue.capacity, 1);
            queue.push(1, 10);
            assert.strictEqual(queue.size, 1);
            assert.strictEqual(queue.capacity, 1);
            queue.push(2, 20);
            assert.strictEqual(queue.size, 2);
            assert.strictEqual(queue.capacity, 2);
        }

        // test explicitly passing autoGrow true
        const queue1 = new Heapify(/** @type {HeapifyOptions} */ {
            capacity: 1,
            autoGrow: true,
        });
        pushTwice(queue1);

        // test the default value, which should be true
        const queue2 = new Heapify(/** @type {HeapifyOptions} */ {
            capacity: 1,
        });
        pushTwice(queue2);
    });

    it("queue should double capacity when full and auto grow is on", () => {
        let next = 1;
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            capacity: 1,
            autoGrow: true,
        });

        /**
         * Will push a dummy item to the queue
         */
        function push() {
            queue.push(next, next);
            next++;
        }

        push();
        assert.strictEqual(queue.capacity, 1);
        push();
        assert.strictEqual(queue.capacity, 2);
        push();
        assert.strictEqual(queue.capacity, 4);
        push();
        push();
        assert.strictEqual(queue.capacity, 8);
    });

    it("should not be able to push beyond capacity if auto grow is disabled", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            capacity: 1,
            autoGrow: false,
        });
        assert.strictEqual(queue.size, 0);
        queue.push(1, 10);
        assert.strictEqual(queue.size, 1);
        assert.throws(() => queue.push(2, 20));
        assert.strictEqual(queue.size, 1);
    });

    it("should be able to pop an item", () => {
        const queue = new Heapify();
        queue.push(123, 456);
        assert.strictEqual(queue.size, 1);
        const key = queue.pop();
        assert.strictEqual(queue.size, 0);
        assert.strictEqual(key, 123);
    });

    it("should pop undefined when queue is empty", () => {
        const queue = new Heapify();
        assert.strictEqual(queue.pop(), undefined);
    });

    it("should be able to peek an item", () => {
        const queue = new Heapify();
        queue.push(123, 456);
        assert.strictEqual(queue.size, 1);
        const key = queue.peek();
        assert.strictEqual(queue.size, 1);
        assert.strictEqual(key, 123);
    });

    it("should be able to peek the priority of an item", () => {
        const queue = new Heapify();
        queue.push(123, 456);
        assert.strictEqual(queue.size, 1);
        const priority = queue.peekPriority();
        assert.strictEqual(queue.size, 1);
        assert.strictEqual(priority, 456);
    });

    it("should support 32-bit keys", () => {
        const VALID_32BIT_KEY = 2 ** 32 - 1;  // greatest 32-bit value
        const INVALID_32BIT_KEY = VALID_32BIT_KEY + 1;

        const queue = new Heapify();

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

    it("should support 32-bit priorities", () => {
        const VALID_32BIT_PRIORITY = 2 ** 32 - 1;  // greatest 32-bit value
        const INVALID_32BIT_PRIORITY = VALID_32BIT_PRIORITY + 1;

        const queue = new Heapify();

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

    it("should correctly pop root and then its child", () => {
        // this triggers the logic that moves a child to the top, but still without any bubbling to fix the heap
        const queue = new Heapify();
        queue.push(1, 10);
        queue.push(2, 20);
        assert.strictEqual(queue.pop(), 1);
        assert.strictEqual(queue.pop(), 2);
    });

    it("should correctly bubble down to the left after pop", () => {
        // similar to the previous test, but now we need an item to be bubbled down after the first item is removed
        const queue = new Heapify();

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

    it("should correctly bubble down to the right after pop", () => {
        // similar to the previous test, but now we need an item to be bubbled down to the right
        const queue = new Heapify();

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

    it("should correctly bubble down after pop, but stopping before a leaf", () => {

        /*
         * similar to the previous test, but now we need an item to be bubbled
         * down to the left and stop somewhere before reaching a leaf, so we
         * can test the logic that evaluates when to stop bubbling
         */
        const queue = new Heapify();

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

    it("should correctly bubble up when inserting a higher priority item in a non-empty queue", () => {
        const queue = new Heapify();

        queue.push(1, 20);
        // now we insert a higher priority and it should bubble to the top
        queue.push(2, 10);
        assert.strictEqual(queue.dumpRawPriorities(), "[10 20]");
    });

    it("should remove item by key in queue with a single item", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            wantsKeyUpdates: true
        });

        queue.push(1, 10);
        assert.strictEqual(queue.containsKey(1), true);
        queue.remove(1);
        assert.strictEqual(queue.containsKey(1), false);
        assert.strictEqual(queue.size, 0);
        assert.strictEqual(queue.pop(), undefined);
    });

    it("should remove item by key in last position in queue with more than one item", () => {
        const priorities = [10, 20, 30];
        const keys = Array.from(priorities, (_, i) => i + 1);
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            capacity: keys.length,
            keys,
            priorities,
            wantsKeyUpdates: true,
        });

        // remove right child
        queue.remove(3);
        assert.strictEqual(queue.dumpRawPriorities(), "[10 20]");

        // remove left child
        queue.remove(2);
        assert.strictEqual(queue.dumpRawPriorities(), "[10]");
    });

    it("should remove item by key, requiring bubbling down", () => {
        const priorities = [10, 20, 30];
        const keys = Array.from(priorities, (_, i) => i + 1);
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            capacity: keys.length,
            keys,
            priorities,
            wantsKeyUpdates: true,
        });

        /*
         * Here we remove the item with priority 10, which happens to be at the root index. We expect that the
         * algorithm replaces it with the last item (priority 30) and then bubble it down so that the item with
         * priority 20 assumes the root position.
         */
        queue.remove(1);

        assert.strictEqual(queue.dumpRawPriorities(), "[20 30]");
    });

    it("should remove item by key, requiring bubbling up", () => {
        const priorities = [1, 10, 5, 20, 30, 6];
        const keys = Array.from(priorities, (_, i) => i + 1);
        const queue = new Heapify({
            capacity: keys.length,
            keys,
            priorities,
            wantsKeyUpdates: true,
        });

        /*
         * Here we remove the item with priority 20. The last item (the one with priority 6) should be used to
         * overwrite that position, and then it should be bubbled up since its new parent (priority 10) is greater.
         */
        queue.remove(4);

        assert.strictEqual(queue.dumpRawPriorities(), "[1 6 5 10 30]");
    });

    it("should do nothing when removing non-existent key", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            wantsKeyUpdates: true
        });

        queue.remove(1);
        assert.strictEqual(queue.size, 0);

        queue.push(2, 10);

        queue.remove(1);
        assert.strictEqual(queue.dumpRawPriorities(), "[10]");
        assert.strictEqual(queue.pop(), 2);
    });

    it("should correctly pop-remove-pop", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            wantsKeyUpdates: true
        });

        queue.push(1, 10);
        queue.push(2, 20);
        queue.push(3, 30);

        // removes key 1, but the optimized logic won't heapify yet
        queue.pop();
        // now remove key 2
        queue.remove(2);
        // we should see key 3 popping here, not key 2
        assert.strictEqual(queue.pop(), 3);
    });

    it("should not duplicate existing key", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            wantsKeyUpdates: true
        });
        queue.push(1, 10);
        queue.push(1, 10);
        assert.strictEqual(queue.dumpRawPriorities(), "[10]");
    });

    it("should update key priority in queue of size 1", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            wantsKeyUpdates: true
        });
        queue.push(1, 10);
        queue.push(1, 20);
        assert.strictEqual(queue.dumpRawPriorities(), "[20]");
        queue.push(1, 15);
        assert.strictEqual(queue.dumpRawPriorities(), "[15]");
    });

    it("should update key priority that requires item to change position in queue", () => {
        const queue = new Heapify(/** @type {HeapifyOptions} */ {
            wantsKeyUpdates: true
        });

        queue.push(1, 10);
        queue.push(2, 20);
        assert.strictEqual(queue.dumpRawKeys(), "[1 2]");
        assert.strictEqual(queue.dumpRawPriorities(), "[10 20]");

        queue.push(2, 5);
        assert.strictEqual(queue.dumpRawKeys(), "[2 1]");
        assert.strictEqual(queue.dumpRawPriorities(), "[5 10]");

        queue.push(2, 15);
        assert.strictEqual(queue.dumpRawKeys(), "[1 2]");
        assert.strictEqual(queue.dumpRawPriorities(), "[10 15]");

        queue.push(3, 12);
        assert.strictEqual(queue.dumpRawKeys(), "[1 2 3]");
        assert.strictEqual(queue.dumpRawPriorities(), "[10 15 12]");

        queue.push(1, 30);
        assert.strictEqual(queue.dumpRawKeys(), "[3 2 1]");
        assert.strictEqual(queue.dumpRawPriorities(), "[12 15 30]");
    });
});
