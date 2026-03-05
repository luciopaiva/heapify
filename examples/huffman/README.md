# Huffman Coding — heapify example

This example implements **lossless Huffman compression** end-to-end, using
heapify's `MinQueue` as the data structure that drives tree construction.

## What is Huffman coding?

Huffman coding is an optimal prefix-free compression algorithm. It replaces
each symbol with a variable-length binary code: **frequent symbols get short
codes, rare symbols get long ones**. At decode time the original data can be
reconstructed perfectly from the compressed bit-stream.

A classic text that takes 8 bits per character in ASCII can typically be
compressed to 4–5 bits per character with Huffman codes.

## How the priority queue is used

Building a Huffman tree is the textbook application of a min-priority queue:

1. **Build a frequency table** — count how often each distinct symbol appears.
2. **Seed the queue** — push every symbol as a leaf node, using its frequency
   as the priority.
3. **Merge loop** — while more than one node remains:
   - `pop()` the two lowest-frequency nodes (left, right).
   - Create a new internal node whose frequency is their sum.
   - `push()` the new node back into the queue.
4. The single remaining node is the tree root.

Steps 2–3 are exactly the interleaved push/pop pattern where heapify is [at
its fastest](../../README.md#benchmark).

The node indices stored as **keys** in the `MinQueue` serve as pointers into a
flat node array — a natural fit for heapify's typed-array-backed design.

## Files

| File | Purpose |
|------|---------|
| `huffman.ts` | Algorithm: frequency table, tree construction, encode, decode |
| `index.ts` | Demo: prints the code table, compression stats, and verifies the round-trip |

## Running

```bash
npm install
npm start
```

No build step is required. `tsx` executes the TypeScript sources directly and
resolves the relative import of `../../src/heapify.ts`.

## Sample output

```
════════════════════════════════════════════════════════════════════
  Huffman Coding — powered by heapify MinQueue
════════════════════════════════════════════════════════════════════

● SAMPLE TEXT

  "Alice was beginning to get very tired of sitting by her sister on the ba…"

  Total characters : 527
  Distinct symbols : 32

● BUILDING HUFFMAN TREE

  MinQueue capacity set to 32 (one slot per distinct symbol).
  Merging nodes — O(n log n) push/pop interleaved operations…

  Tree built in 0.211 ms.
  Total nodes in tree : 63 (32 leaves + 31 internal)

● CODE TABLE  (sorted by code length, then by character)

  Symbol    Freq   Code                 Bits
  --------------------------------------------
  SPACE       99   00                      2
  'e'         49   1111                    4
  't'         37   1011                    4
  ...

● ENCODING

  Original  : 527 chars × 8 bits = 4216 bits
  Encoded   : 2232 bits
  Avg code  : 4.235 bits / symbol
  Ratio     : 52.9% of original  →  47.1% savings

● DECODING

  Decoded text matches original: ✓  YES
```
