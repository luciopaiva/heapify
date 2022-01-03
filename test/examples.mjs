
import assert from "assert";
import {MinQueue} from "../dist/heapify.js";
import mocha from "mocha";

const {describe, it} = mocha;

/**
 * This example shows how to use Heapify with custom objects. The idea here is using their ids as keys so we're still
 * able to take advantage of the speed of typed arrays, but still have some way of translating the ids back to objects
 * when needed.
 */
function customObjectsExample() {
    // some sample objects
    const objects = [
        { id: 1, priority: 10, token: "is" },
        { id: 2, priority: 131, token: "progress" },
        { id: 3, priority: 5, token: "Failure" },
        { id: 4, priority: 72, token: "in" },
        { id: 5, priority: 49, token: "success" },
    ];

    // prepare lookup table
    const objectById = new Map();
    for (const obj of objects) {
        objectById.set(obj.id, obj);
    }

    // prepare priority queue
    const queue = new MinQueue();
    for (const obj of objects) {
        queue.push(obj.id, obj.priority);
    }

    // consume from the queue
    const ids = [];
    while (queue.size > 0) {
        ids.push(queue.pop());
    }

    // print secret message
    const message = ids.map(id => objectById.get(id).token).join(" ");
    assert.strictEqual(message, "Failure is success in progress");
}

/**
 * This is an example of how to use Heapify to merge previously sorted arrays.
 * https://www.wikiwand.com/en/K-way_merge_algorithm
 */
function kWayMergeExample() {
    function *merge(sortedSequences) {
        const seqs = sortedSequences.filter(seq => seq.length > 0);
        const k = seqs.length;

        const heap = new MinQueue(k);
        const pointers = new Int32Array(k);

        for (const [i, seq] of seqs.entries()) {
            heap.push(i, seq[0]);
        }

        while (heap.size > 0) {
            const i = heap.pop();

            const seq = seqs[i];
            let pointer = pointers[i];
            const element = seq[pointer++];

            yield element;

            if (pointer < seq.length) {
                heap.push(i, seq[pointer]);
                pointers[i] = pointer;
            }
        }
    }

    const sortedSequences = [
        [],
        [0],
        [1, 1],
        [1, 2, 4],
    ];

    const merged = Array.from(merge(sortedSequences));
    const expected = sortedSequences.flat().sort((a, b) => a - b);

    assert.deepStrictEqual(merged, expected);
}

describe("Examples", () => {
    it("Handling custom objects", customObjectsExample);
    it("k-way merge", kWayMergeExample);
});
