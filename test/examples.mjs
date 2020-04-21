
import assert from "assert";
import Heapify from "../heapify.mjs";
import mocha from "mocha";

const {describe, it} = mocha;

describe("Examples", () => {

    /*
     * This example shows how to use Heapify with custom objects. The idea here is using their ids as keys so we're still
     * able to take advantage of the speed of typed arrays, but still have some way of translating the ids back to objects
     * when needed.
     */
    it("Handling custom objects", () => {
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
        const queue = new Heapify();
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
    });
});
