
# Heapify

[![codecov](https://img.shields.io/codecov/c/github/luciopaiva/heapify)](https://codecov.io/gh/luciopaiva/heapify)
[![travis](https://api.travis-ci.com/luciopaiva/heapify.svg?branch=master)](https://travis-ci.com/luciopaiva/heapify) 
[![version](https://img.shields.io/npm/v/heapify?color=brightgreen&label=version)](https://www.npmjs.com/package/heapify)

🚑 🚴 🚌 🚕 🚗 🚚 🚛

A very fast JavaScript priority queue, implemented using a binary heap, which in turn is implemented using two underlying parallel [typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray). No dependencies whatsoever; just plain, vanilla JS.

It's the fastest publicly available JavaScript library implementation of a priority queue. Here's an average benchmark comparing Heapify with [TinyQueue](https://github.com/mourner/tinyqueue/) and [FlatQueue](https://github.com/mourner/flatqueue), running for 1 million elements:

```
              build     push       pop     push+pop
TinyQueue     110ms    110ms     624ms        205ms
FlatQueue      85ms     85ms     157ms        112ms
Heapify        32ms     41ms     150ms        112ms 
```

*Host machine: 2.4 GHz Dual-Core Intel Core i7, 16 GB RAM.*

*Note: the build operation doesn't actually exist in TinyQueue and FlatQueue, so it has to be replaced with a manual push operation. That's why build times for those two cases are the same as for push.*

Supported operations:

- push: O(log n)
- pop: O(log n)
- peek: O(1)

Features:

- runs on browser and Node.js with support to ES6 modules
- tiny code base (under 100 LoC)
- no dependencies
- supports several types of priorities and keys

Upcoming features:

- standalone heap structures
- max heaps
- unique items
- accessing arbitrary items
- changing the priority of arbitrary items
- objects as keys (with performance hit)
- dynamic size

## How to install

    npm i heapify

Or if you're a yarn person:

    yarn add heapify

If you're on a browser, there's also the option of using a CDN:

    import Heapify from "https://unpkg.com/heapify";

And to import a specific version:

    import Heapify from "https://unpkg.com/heapify";

## How to use

```javascript
import Heapify from "heapify";

const queue = new Heapify();
queue.push(1, 10);
queue.push(2, 5);
queue.pop();  // 2
queue.peek();  // 1
queue.clear();
queue.pop();  // undefined
```

## Running tests

    npm run test

For benchmark tests:

    npm run bench

## API

### Heapify(capacity, KeysBackingArrayType, PrioritiesBackingArrayType)

Creates a new priority queue. Parameters are:

- `capacity`: the size of the underlying typed arrays backing the heap. Defaults to 64;
- `KeysBackingArrayType`: the array type to be used for keys. Defaults to `Uint32Array`;
- `PrioritiesBackingArrayType`: the array type to be used for priorities. Defaults to `Uint32Array`.

### clear()

Effectively empties the queue. The heap capacity is not changed, nor its elements get erased in any way; it's just the variable that tracks the length that gets cleared to zero, so it's a very cheap operation.

### peek()

Gets the key with the smallest priority, but does not remove it from the queue.

### peekPriority()

Gets the _priority_ of the key with the smallest priority, but does not remove the item from the queue.

### pop()

Removes the smallest priority item from the queue, returning its key.

### push(key, priority)

Adds a new item to the queue with a given `key` and `priority`. Will throw an error if the queue is already at its capacity.

### toString()

Returns a string with an array representation of all priorities in the queue. For instance, given the following priority heap:

```
    10
  30  20
40
```

The returned string will be `[10 30 20 40]`. See tests for more examples.
