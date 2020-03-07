
export default class Heapify {

    constructor (capacity = 64, keys = [], priorities = [],
                 KeysBackingArrayType = Uint32Array,
                 PrioritiesBackingArrayType = Uint32Array) {
        this.capacity = capacity;
        this.keys = new KeysBackingArrayType(capacity);
        this.priorities = new PrioritiesBackingArrayType(capacity);
        if (keys.length !== priorities.length) {
            throw new Error("The length of keys and the length of priorities should be equal.");
        }
        if (capacity < keys.length) {
            throw new Error("No enough capcty when constructing the heap.");
        }
        // copy data from user
        for (let i = 0; i < keys.length; i++) {
            this.keys[i] = keys[i];
            this.priorities[i] = priorities[i];
        }
        this.length = keys.length;
        for (let i = keys.length >>> 1; i >= 0; i--) {
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

        while (index > 0) {
            // get its parent item
            const parentIndex = (index - 1) >>> 1;
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

        while (index < this.length) {
            const left = (index << 1) + 1;
            if (left >= this.length) {
                break;  // index is a leaf node, no way to bubble down any further
            }

            // pick the left child
            let childPriority = this.priorities[left];
            let childKey = this.keys[left];
            let childIndex = left;

            // if there's a right child, choose the child with the smallest priority
            const right = left + 1;
            if (right < this.length) {
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
        this.keys[this.length] = key;
        this.priorities[this.length] = priority;
        this.bubbleUp(this.length);
        this.length++;
    }

    pop() {
        if (this.length === 0) {
            return undefined;
        }
        const key = this.keys[0];

        this.length--;

        if (this.length > 0) {
            this.keys[0] = this.keys[this.length];
            this.priorities[0] = this.priorities[this.length];

            this.bubbleDown(0);
        }

        return key;
    }

    peekPriority() {
        return this.priorities[0];
    }

    peek() {
        return this.keys[0];
    }

    toString() {
        let result = Array(this.length);
        for (let i = 0; i < this.length; i++) {
            result[i] = this.priorities[i];
        }
        return `[${result.join(" ")}]`;
    }
}
