export default class Heapify {
    private _capacity: number;
    private _keys: Uint32Array;
    private _priorities: Uint32Array;
    private _hasPoppedElement: boolean;
    length: number;
    constructor(capacity?: number, keys?: any[], priorities?: any[], KeysBackingArrayType?: Uint32ArrayConstructor, PrioritiesBackingArrayType?: Uint32ArrayConstructor);
    get capacity(): number;
    clear(): void;
    /**
     * Bubble an item up until its heap property is satisfied.
     *
     * @param {Number} index
     * @private
     */
    private bubbleUp(index: number): void;
    /**
     * Bubble an item down until its heap property is satisfied.
     *
     * @param {Number} index
     * @private
     */
    private bubbleDown(index: number): void;
    /**
     * @param {*} key the identifier of the object to be pushed into the heap
     * @param {Number} priority 32-bit value corresponding to the priority of this key
     */
    push(key: number, priority: number): void;
    pop(): number;
    peekPriority(): number;
    peek(): number;
    private removePoppedElement(): void;
    get size(): number;
    dumpRawPriorities(): string;
}
