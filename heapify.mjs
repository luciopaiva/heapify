
// this is just to make it clear that we are using a 1-based array; changing it to zero won't work without code changes
const ROOT_INDEX = 1;
const DEFAULT_CAPACITY = 64;

class MapStub {
    set() { /* do nothing */ }
    delete() { /* do nothing */ }
    clear() { /* do nothing */ }
}

/**
 * @typedef {Object} HeapifyOptions
 * @property {Boolean} wantsKeyUpdates
 */

export default class Heapify {

    /**
     * @param {Number} capacity
     * @param {Array} keys
     * @param {Array} priorities
     * @param {*} KeysBackingArrayType
     * @param {*} PrioritiesBackingArrayType
     * @param {HeapifyOptions} options
     */
    constructor(capacity = DEFAULT_CAPACITY, keys = [], priorities = [],
        KeysBackingArrayType = Uint32Array,
        PrioritiesBackingArrayType = Uint32Array,
        options = {}) {

        this.areKeyUpdatesEnabled = Boolean(options.wantsKeyUpdates);

        this._capacity = capacity;
        this._keys = new KeysBackingArrayType(capacity + ROOT_INDEX);
        this._priorities = new PrioritiesBackingArrayType(capacity + ROOT_INDEX);
        // to keep track of whether the first element is a deleted one
        this._hasPoppedElement = false;

        /** @type {Map<Number, Number>|MapStub} */
        this._indexByKey = this.areKeyUpdatesEnabled ? new Map() : new MapStub();

        if (keys.length !== priorities.length) {
            throw new Error("Number of keys does not match number of priorities provided.");
        }
        if (capacity < keys.length) {
            throw new Error("Capacity less than number of provided keys.");
        }
        // copy data from user
        for (let i = 0; i < keys.length; i++) {
            this._writeAtIndex(i + ROOT_INDEX, keys[i], priorities[i]);
        }
        this.length = keys.length;
        for (let i = keys.length >>> 1; i >= ROOT_INDEX; i--) {
            this._bubbleDown(i);
        }
    }

    clear() {
        this.length = 0;
        this._hasPoppedElement = false;
        this._indexByKey.clear();
    }

    /**
     * @param {*} key the identifier of the object to be pushed into the heap
     * @param {Number} priority 32-bit value corresponding to the priority of this key
     */
    push(key, priority) {
        if (this.length === this._capacity) {
            throw new Error("Heap has reached capacity, can't push new items");
        }

        this.remove(key);

        if (this._hasPoppedElement) {
            // replace root element (which was deleted from the last pop)
            this._writeAtIndex(ROOT_INDEX, key, priority);

            this._bubbleDown(ROOT_INDEX);
            this._hasPoppedElement = false;
        } else {
            const pos = this.length + ROOT_INDEX;
            this._writeAtIndex(pos, key, priority);
            this._bubbleUp(pos);
        }

        this.length++;
    }

    pop() {
        if (this.length === 0) {
            return undefined;
        }
        this._removePoppedElement();

        this.length--;
        this._hasPoppedElement = true;

        const key = this._keys[ROOT_INDEX];
        this._indexByKey.delete(key);
        return key;
    }

    peek() {
        this._removePoppedElement();
        return this._keys[ROOT_INDEX];
    }

    peekPriority() {
        this._removePoppedElement();
        return this._priorities[ROOT_INDEX];
    }

    remove(key) {
        if (this.areKeyUpdatesEnabled) {
            this._removePoppedElement();

            const index = this._indexByKey.get(key);
            if (index === undefined) {
                return;  // item not found
            }

            this._removeAtIndex(index);
            this._indexByKey.delete(key);
        }
    }

    containsKey(key) {
        return this._indexByKey.has(key);
    }

    dumpRawKeys() {
        this._removePoppedElement();

        const result = Array(this.length);
        for (let i = 0; i < this.length; i++) {
            result[i] = this._keys[i + ROOT_INDEX];
        }
        return `[${result.join(" ")}]`;
    }

    dumpRawPriorities() {
        this._removePoppedElement();

        const result = Array(this.length);
        for (let i = 0; i < this.length; i++) {
            result[i] = this._priorities[i + ROOT_INDEX];
        }
        return `[${result.join(" ")}]`;
    }

    /**
     * Bubble an item down until its heap property is satisfied.
     *
     * @param {Number} index
     * @private
     */
    _bubbleDown(index) {
        const key = this._keys[index];
        const priority = this._priorities[index];

        const halfLength = ROOT_INDEX + (this.length >>> 1);  // no need to check the last level
        const boundaryIndex = this.length + ROOT_INDEX;
        while (index < halfLength) {
            const left = index << 1;

            // pick the left child
            let childPriority = this._priorities[left];
            let childKey = this._keys[left];
            let childIndex = left;

            // if there's a right child, choose the child with the smallest priority
            const right = left + 1;
            if (right < boundaryIndex) {
                const rightPriority = this._priorities[right];
                if (rightPriority < childPriority) {
                    childPriority = rightPriority;
                    childKey = this._keys[right];
                    childIndex = right;
                }
            }

            if (childPriority >= priority) {
                break;  // if children have higher priority, heap property is satisfied
            }

            // bubble the child up to where the parent is
            this._writeAtIndex(index, childKey, childPriority);

            // repeat for the next level
            index = childIndex;
        }

        // we finally found the place where the initial item should be; write it there
        this._writeAtIndex(index, key, priority);
    }

    /**
     * Bubble an item up until its heap property is satisfied.
     *
     * @param {Number} index
     * @private
     */
    _bubbleUp(index) {
        const key = this._keys[index];
        const priority = this._priorities[index];

        while (index > ROOT_INDEX) {
            // get its parent item
            const parentIndex = index >>> 1;
            if (this._priorities[parentIndex] <= priority) {
                break;  // if parent priority is smaller, heap property is satisfied
            }
            // bubble parent down so the item can go up
            this._writeAtIndex(index, this._keys[parentIndex], this._priorities[parentIndex]);

            // repeat for the next level
            index = parentIndex;
        }

        // we finally found the place where the initial item should be; write it there
        this._writeAtIndex(index, key, priority);
    }

    _copyItem(sourceIndex, targetIndex) {
        const key = this._keys[sourceIndex];
        const priority = this._priorities[sourceIndex];
        this._writeAtIndex(targetIndex, key, priority);
    }

    _removeAtIndex(index) {
        // remove by replacing it with last item
        const lastIndex = this.length - 1 + ROOT_INDEX;
        this._copyItem(lastIndex, index);
        this.length--;
        if (index !== ROOT_INDEX &&  // items at root position do not have a parent
            this._priorities[index] < this._priorities[index >>> 1]) {  // item priority is lower than parent's
            this._bubbleUp(index);
        } else {
            this._bubbleDown(index);
        }
    }

    _removePoppedElement() {
        if (this._hasPoppedElement) {
            // since root element was already deleted from pop, replace with last and bubble down
            const lastIndex = this.length + ROOT_INDEX;  // actually one beyond last (length was already decremented)
            this._copyItem(lastIndex, ROOT_INDEX);
            this._bubbleDown(ROOT_INDEX);
            this._hasPoppedElement = false;
        }
    }

    _writeAtIndex(index, key, priority) {
        this._keys[index] = key;
        this._priorities[index] = priority;
        this._indexByKey.set(key, index);
    }

    get capacity() {
        return this._capacity;
    }

    get size() {
        return this.length;
    }
}
