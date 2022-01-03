export declare class MinQueue {
    private readonly _capacity;
    private readonly _keys;
    private readonly _priorities;
    private length;
    private _hasPoppedElement;
    constructor(capacity?: number, keys?: number[], priorities?: number[], KeysBackingArrayType?: Uint32ArrayConstructor, PrioritiesBackingArrayType?: Uint32ArrayConstructor);
    get capacity(): number;
    clear(): void;
    /**
     * Bubble an item up until its heap property is satisfied.
     */
    private bubbleUp;
    /**
     * Bubble an item down until its heap property is satisfied.
     */
    private bubbleDown;
    /**
     * @param key the identifier of the object to be pushed into the heap
     * @param priority the priority associated with the key
     */
    push(key: number, priority: number): void;
    /**
     * @return the key with the highest priority, or undefined if the heap is empty
     */
    pop(): number | undefined;
    peekPriority(): number;
    peek(): number;
    removePoppedElement(): void;
    get size(): number;
    dumpRawPriorities(): string;
}
