
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
 * @property {Number} capacity
 * @property {Array} keys
 * @property {Array} priorities
 * @property {Boolean} wantsKeyUpdates
 * @property {Boolean} autoGrow
 * @property {*} keysBackingArrayType
 * @property {*} prioritiesBackingArrayType
 */

const DEFAULT_OPTIONS = Object.freeze(/** @type {HeapifyOptions} */ {
    capacity: DEFAULT_CAPACITY,
    keys: [],
    priorities: [],
    wantsKeyUpdates: false,
    autoGrow: true,
    keysBackingArrayType: Uint32Array,
    prioritiesBackingArrayType: Uint32Array,
});

export default class Heapify {

    /**
     * @param {Number|HeapifyOptions} capacityOrOptions
     */
    constructor(capacityOrOptions = DEFAULT_OPTIONS) {
        if (arguments.length > 1) {
            throw new Error("Invalid number of arguments");
        }
        const options = { ...DEFAULT_OPTIONS };  // take a copy
        if (typeof capacityOrOptions === "number") {
            options.capacity = capacityOrOptions;
        } else {
            Object.assign(options, capacityOrOptions);
        }
        this._areKeyUpdatesEnabled = Boolean(options.wantsKeyUpdates);
        this._autoGrow = Boolean(options.autoGrow);

        this._capacity = Math.max(options.capacity, options.keys.length);

        this._KeysArrayType = options.keysBackingArrayType;
        this._PrioritiesArrayType = options.prioritiesBackingArrayType;
        this._allocateBackingArrays();

        // to keep track of whether the first element is a deleted one
        this._hasPoppedElement = false;

        /** @type {Map<Number, Number>|MapStub} */
        this._indexByKey = this._areKeyUpdatesEnabled ? new Map() : new MapStub();

        if (options.keys.length !== options.priorities.length) {
            throw new Error("Number of keys does not match number of priorities provided.");
        }
        // copy data from user
        for (let i = 0; i < options.keys.length; i++) {
            this._writeAtIndex(i + ROOT_INDEX, options.keys[i], options.priorities[i]);
        }
        this._size = options.keys.length;
        for (let i = options.keys.length >>> 1; i >= ROOT_INDEX; i--) {
            this._bubbleDown(i);
        }
    }

    clear() {
        this._size = 0;
        this._hasPoppedElement = false;
        this._indexByKey.clear();
    }

    /**
     * @param {*} key the identifier of the object to be pushed into the heap
     * @param {Number} priority 32-bit value corresponding to the priority of this key
     */
    push(key, priority) {
        if (this._size === this._capacity) {
            if (this._autoGrow) {
                this._doubleCapacity();
            } else {
                throw new Error("Heap has reached capacity, can't push new items");
            }
        }

        this.remove(key);

        if (this._hasPoppedElement) {
            // replace root element (which was deleted from the last pop)
            this._writeAtIndex(ROOT_INDEX, key, priority);

            this._bubbleDown(ROOT_INDEX);
            this._hasPoppedElement = false;
        } else {
            const pos = this._size + ROOT_INDEX;
            this._writeAtIndex(pos, key, priority);
            this._bubbleUp(pos);
        }

        this._size++;
    }

    pop() {
        if (this._size === 0) {
            return undefined;
        }
        this._removePoppedElement();

        this._size--;
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
        if (this._areKeyUpdatesEnabled) {
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

        const result = Array(this._size);
        for (let i = 0; i < this._size; i++) {
            result[i] = this._keys[i + ROOT_INDEX];
        }
        return `[${result.join(" ")}]`;
    }

    dumpRawPriorities() {
        this._removePoppedElement();

        const result = Array(this._size);
        for (let i = 0; i < this._size; i++) {
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

        const halfSize = ROOT_INDEX + (this._size >>> 1);  // no need to check the last level
        const boundaryIndex = this._size + ROOT_INDEX;
        while (index < halfSize) {
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
        const lastIndex = this._size - 1 + ROOT_INDEX;
        this._copyItem(lastIndex, index);
        this._size--;
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
            const lastIndex = this._size + ROOT_INDEX;  // actually one beyond last (size was already decremented)
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

    _doubleCapacity() {
        this._capacity <<= 1;
        const [oldKeys, oldPriorities] = [this._keys, this._priorities];
        this._allocateBackingArrays();

        for (let i = 0; i < this._size; i++) {
            this._keys[i] = oldKeys[i];
        }
        for (let i = 0; i < this._size; i++) {
            this._priorities[i] = oldPriorities[i];
        }
    }

    _allocateBackingArrays() {
        this._keys = new this._KeysArrayType(this._capacity + ROOT_INDEX);
        this._priorities = new this._PrioritiesArrayType(this._capacity + ROOT_INDEX);
    }

    get capacity() {
        return this._capacity;
    }

    get size() {
        return this._size;
    }
}
