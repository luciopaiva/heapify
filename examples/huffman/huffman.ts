/**
 * Huffman coding implemented using heapify's MinQueue.
 *
 * The MinQueue is the engine of the tree-building phase: it always extracts
 * the two lowest-frequency nodes so they become siblings in the tree, which
 * is exactly what makes Huffman codes optimal.
 */
import { MinQueue } from "../../src/heapify.ts";

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

export interface HuffmanNode {
    readonly freq: number;
    readonly char: string | null;  // null for internal (merged) nodes
    readonly left: number;         // child index into the node array, -1 if none
    readonly right: number;
}

export interface HuffmanTree {
    readonly nodes: HuffmanNode[];
    readonly root: number;
    readonly codes: ReadonlyMap<string, string>;
}

// ---------------------------------------------------------------------------
// Frequency table
// ---------------------------------------------------------------------------

export function buildFrequencyTable(text: string): Map<string, number> {
    const table = new Map<string, number>();
    for (const ch of text) {
        table.set(ch, (table.get(ch) ?? 0) + 1);
    }
    return table;
}

// ---------------------------------------------------------------------------
// Tree construction — this is where MinQueue shines
// ---------------------------------------------------------------------------

export function buildHuffmanTree(freqs: Map<string, number>): HuffmanTree {
    if (freqs.size === 0) {
        throw new Error("Cannot build a Huffman tree from an empty frequency table.");
    }

    const nodes: HuffmanNode[] = [];

    // The queue never holds more than freqs.size elements at one time: we
    // start with N leaves, and every merge removes two and adds one (-1 net).
    const queue = new MinQueue(freqs.size);

    // Push every character as a leaf node.
    for (const [char, freq] of freqs) {
        const idx = nodes.length;
        nodes.push({ freq, char, left: -1, right: -1 });
        queue.push(idx, freq);
    }

    // Repeatedly merge the two cheapest nodes into a new internal one.
    while (queue.size > 1) {
        const leftIdx  = queue.pop()!;
        const rightIdx = queue.pop()!;
        const combined = nodes[leftIdx].freq + nodes[rightIdx].freq;
        const newIdx   = nodes.length;
        nodes.push({ freq: combined, char: null, left: leftIdx, right: rightIdx });
        queue.push(newIdx, combined);
    }

    const root  = queue.pop()!;
    const codes = assignCodes(nodes, root);
    return { nodes, root, codes };
}

// ---------------------------------------------------------------------------
// Code table generation (DFS over the finished tree)
// ---------------------------------------------------------------------------

function assignCodes(nodes: HuffmanNode[], root: number): Map<string, string> {
    const codes = new Map<string, string>();

    function dfs(idx: number, prefix: string): void {
        const node = nodes[idx];
        if (node.char !== null) {
            // Edge case: only one distinct symbol → give it a single zero-bit code.
            codes.set(node.char, prefix.length > 0 ? prefix : "0");
            return;
        }
        if (node.left  !== -1) dfs(node.left,  prefix + "0");
        if (node.right !== -1) dfs(node.right, prefix + "1");
    }

    dfs(root, "");
    return codes;
}

// ---------------------------------------------------------------------------
// Encode / decode
// ---------------------------------------------------------------------------

export function encode(text: string, codes: ReadonlyMap<string, string>): string {
    const parts: string[] = [];
    for (const ch of text) {
        const code = codes.get(ch);
        if (code === undefined) throw new Error(`No code found for character: '${ch}'`);
        parts.push(code);
    }
    return parts.join("");
}

export function decode(bits: string, nodes: HuffmanNode[], root: number): string {
    if (bits.length === 0) return "";

    // Single-symbol edge case: root is itself a leaf.
    if (nodes[root].char !== null) {
        return nodes[root].char!.repeat(bits.length);
    }

    const chars: string[] = [];
    let cur = root;
    for (const bit of bits) {
        const node = nodes[cur];
        cur = bit === "0" ? node.left : node.right;
        const child = nodes[cur];
        if (child.char !== null) {
            chars.push(child.char);
            cur = root;
        }
    }
    return chars.join("");
}
