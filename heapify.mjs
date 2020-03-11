
// this is just to make it clear that we are using a 1-based array; changing it to zero won't work without code changes
const ROOT_INDEX = 1;

export default class Heapify {

    constructor (capacity = 64, keys = [], priorities = [],
                 KeysBackingArrayType = Uint32Array,
                 PrioritiesBackingArrayType = Uint32Array) {
        this.capacity = capacity;
        this.keys = new KeysBackingArrayType(capacity + ROOT_INDEX);
        this.priorities = new PrioritiesBackingArrayType(capacity + ROOT_INDEX);
        if (keys.length !== priorities.length) {
            throw new Error("Number of keys does not match number of priorities provided.");
        }
        if (capacity < keys.length) {
            throw new Error("Capacity less than number of provided keys.");
        }
        // copy data from user
        for (let i = 0; i < keys.length; i++) {
            this.keys[i + ROOT_INDEX] = keys[i];
            this.priorities[i + ROOT_INDEX] = priorities[i];
        }
        this.length = keys.length;
        for (let i = keys.length >>> 1; i >= ROOT_INDEX; i--) {
            this.bubbleDown(i);
        }
    }

    clear() {
        this.length = 0;
    }

    /**
     * Bubble an item up until its heap property is satisfied.
     *
     * @param {Number} index
     * @private
     */
    bubbleUp(index) {
        const key = this.keys[index];
        const priority = this.priorities[index];

        while (index > ROOT_INDEX) {
            // get its parent item
            const parentIndex = index >>> 1;
            if (this.priorities[parentIndex] <= priority) {
                break;  // if parent priority is smaller, heap property is satisfied
            }
            // bubble parent down so the item can go up
            this.keys[index] = this.keys[parentIndex];
            this.priorities[index] = this.priorities[parentIndex];

            // repeat for the next level
            index = parentIndex;
        }

        // we finally found the place where the initial item should be; write it there
        this.keys[index] = key;
        this.priorities[index] = priority;
    }

    /**
     * Bubble an item down until its heap property is satisfied.
     *
     * @param {Number} index
     * @private
     */
    bubbleDown(index) {
        const key = this.keys[index];
        const priority = this.priorities[index];

        const halfLength = ROOT_INDEX + (this.length >>> 1);  // no need to check the last level
        const lastIndex = this.length + ROOT_INDEX;
        while (index < halfLength) {
            const left = index << 1;
            if (left >= lastIndex) {
                break;  // index is a leaf node, no way to bubble down any further
            }

            // pick the left child
            let childPriority = this.priorities[left];
            let childKey = this.keys[left];
            let childIndex = left;

            // if there's a right child, choose the child with the smallest priority
            const right = left + 1;
            if (right < lastIndex) {
                const rightPriority = this.priorities[right];
                if (rightPriority < childPriority) {
                    childPriority = rightPriority;
                    childKey = this.keys[right];
                    childIndex = right;
                }
            }

            if (childPriority >= priority) {
                break;  // if children have higher priority, heap property is satisfied
            }

            // bubble the child up to where the parent is
            this.keys[index] = childKey;
            this.priorities[index] = childPriority;

            // repeat for the next level
            index = childIndex;
        }

        // we finally found the place where the initial item should be; write it there
        this.keys[index] = key;
        this.priorities[index] = priority;
    }

    /**
     * @param {*} key the identifier of the object to be pushed into the heap
     * @param {Number} priority 32-bit value corresponding to the priority of this key
     */
    push(key, priority) {
        if (this.length === this.capacity) {
            throw new Error("Heap has reached capacity, can't push new items");
        }
        const pos = this.length + ROOT_INDEX;
        this.keys[pos] = key;
        this.priorities[pos] = priority;
        this.bubbleUp(pos);
        this.length++;
    }

    pop() {
        if (this.length === 0) {
            return undefined;
        }
        const key = this.keys[ROOT_INDEX];

        this.length--;

        if (this.length > 0) {
            this.keys[ROOT_INDEX] = this.keys[this.length + ROOT_INDEX];
            this.priorities[ROOT_INDEX] = this.priorities[this.length + ROOT_INDEX];

            this.bubbleDown(ROOT_INDEX);
        }

        return key;
    }

    peekPriority() {
        return this.priorities[ROOT_INDEX];
    }

    peek() {
        return this.keys[ROOT_INDEX];
    }

    toString() {
        let result = Array(this.length - ROOT_INDEX);
        for (let i = 0; i < this.length; i++) {
            result[i] = this.priorities[i + ROOT_INDEX];
        }
        return `[${result.join(" ")}]`;
    }
}
