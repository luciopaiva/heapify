
![Heapify](https://raw.githubusercontent.com/luciopaiva/heapify/master/logo.png)

[![codecov](https://img.shields.io/codecov/c/github/luciopaiva/heapify)](https://codecov.io/gh/luciopaiva/heapify)
[![travis](https://api.travis-ci.com/luciopaiva/heapify.svg?branch=master)](https://travis-ci.com/luciopaiva/heapify) 
[![version](https://img.shields.io/npm/v/heapify?color=brightgreen&label=version)](https://www.npmjs.com/package/heapify)

🚑 🚴 🚌 🚕 🚗 🚚 🚛

A very fast JavaScript priority queue, implemented using a binary heap, which in turn is implemented using two underlying parallel [typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray). No dependencies whatsoever; just plain, vanilla JS.

It's the fastest publicly available JavaScript library implementation of a priority queue. Here's a benchmark comparing Heapify with other popular libraries:

```
                             Closure  FlatQueue  TinyQueue    Heapify
build                            201          -          -         18
push                             222         66         75         24
pop                              496        137        917        110
push/pop batch                   279         83        280         89
push/pop interleaved             315         50        265         34
push/pop random                  186         50        257         48
```

See the [benchmark](#benchmark) section below for more details.

Heapify's design strives for reliability, with strong test coverage and focus on code readability. It should be easy to understand what the library is doing. The library is also very lean, with no dependencies and a small and concise source code. 

# Table of contents

- [Features](#features)
- [How to install](#how-to-install)
- [Basic usage](#basic-usage)
- [Contributing](#contributing)
- [API](#api)
  - [new Heapify()](#new-heapifycapacity--64-keys---priorities---keysbackingarraytype--uint32array-prioritiesbackingarraytype--uint32array)
  - [capacity](#capacity)
  - [clear()](#clear)
  - [peek()](#peek)
  - [peekPriority()](#peekpriority)
  - [pop()](#pop)
  - [push(key, priority)](#pushkey-priority)
  - [size](#size)
- [Benchmark](#benchmark)

## Features

Supported queue operations:

- push: O(log n)
- pop: O(log n) in the general case, O(1) if not preceded by a pop
- peek: O(1) in the general case, O(log n) if preceded by a pop
- peekPriority: O(1) in the general case, O(log n) if preceded by a pop
- creation with pre-existing list of priorities: O(n)

Other features:

- runs on browser and Node.js with support to ES6 modules
- tiny code base (under 200 LoC)
- no dependencies
- supports several types of priorities and keys

## How to install

```sh
npm i heapify
```

Or if you're a yarn person:

```sh
yarn add heapify
```

If you're on a browser, there's also the option of using a CDN:

```js
import Heapify from "https://unpkg.com/heapify"
```

And to import a specific version:

```js
import Heapify from "https://unpkg.com/heapify@0.2.1"
```

## Basic usage

```js
import Heapify from "heapify";

const queue = new Heapify();
queue.push(1, 10);
queue.push(2, 5);
queue.pop();  // 2
queue.peek();  // 1
queue.clear();
queue.pop();  // undefined
```

See the API section below for more details.

## Contributing

You are welcome to contribute, but please take the time to read and follow [these guidelines](CONTRIBUTING.md).

## API

### new Heapify(capacity = 64, keys = [], priorities = [], KeysBackingArrayType = Uint32Array, PrioritiesBackingArrayType = Uint32Array)

Creates a new priority queue. Parameters are:

- `capacity`: the size of the underlying typed arrays backing the heap;
- `keys`: an optional array of pre-existing keys. Provide `[]` to skip this field;
- `priorities`: an optional array of pre-existing priorities. Must match number of keys above. Provide `[]` to skip this field;
- `KeysBackingArrayType`: the array type to be used for keys;
- `PrioritiesBackingArrayType`: the array type to be used for priorities.

Example:

```js
const queue1 = new Heapify(32);
const queue2 = new Heapify(16, [], [], Uint16Array, Uint32Array);
```

### capacity

A read-only property that returns the maximum capacity of the queue. Example:

```js
const queue = new Heapify(32);
queue.capacity;  // 32
```

### clear()

Effectively empties the queue. The heap capacity is not changed, nor its elements get erased in any way; it's just the variable that tracks the length that gets cleared to zero, so it's a very cheap operation.

Example:

```js
const queue = new Heapify();
queue.push(1, 10);
console.info(queue.size);  // 1
queue.clear();
console.info(queue.size);  // 0
```

### peek()

Gets the key with the smallest priority, but does not remove it from the queue.

Example:

```js
const queue = new Heapify();
queue.push(1, 10);
queue.peek();  // 1
```

### peekPriority()

Gets the _priority_ of the key with the smallest priority, but does not remove the item from the queue.

Example:

```js
const queue = new Heapify();
queue.push(1, 10);
queue.peekPriority();  // 10
```

### pop()

Removes the smallest priority item from the queue, returning its key. Returns `undefined` if the queue is empty. 

Example:

```js
const queue = new Heapify();
queue.push(1, 10);
queue.pop();  // 1
```

### push(key, priority)

Adds a new item to the queue with a given `key` and `priority`. Will throw an error if the queue is already at its capacity.

Example:

```js
const queue = new Heapify();
queue.push(1, 10);
queue.size;  // 1
queue.peek();  // 1
queue.peekPriority();  // 10
```

### size

A read-only property that returns the current size of the queue.

Example:

```js
const queue = new Heapify();
queue.size;  // 0
queue.push(1, 10);
queue.size;  // 1
queue.pop();
queue.size;  // 0
```

## Benchmark

Here's a table comparing Heapify with other implementations (times are in milliseconds):

```
                             Closure     FastPQ  FlatQueue  TinyQueue    Heapify
build                            201         15          -          -         18
push                             222         47         66         75         24
pop                              496        143        137        917        110
push/pop batch                   279        128         83        280         89
push/pop interleaved             315         65         50        265         34
push/pop random                  186         45         50        257         48
```

Host machine: Node.js 13.8.0, 2.6 GHz 6-Core Intel Core i7, 32 GB 2400 MHz DDR4 RAM.

Operations:
- build - build queue from scratch by providing a collection of keys and priorities, all at once;
- push - insert a single element into the queue;
- pop - remove a single element from the queue;
- push/pop batch - performs batches of 1k pushes followed by 1k pops;
- push/pop interleaved - starting with a partially filled queue, this test inserts a random element and then immediately removes the lowest priority value from the queue;
- push/pop random - starting with a partially filled queue, this test runs either a push or a pop at random.

Each test performs 1 million operations and is repeated 5 times. The median value is used as the result.

Tested libraries:

- [Google Closure library](https://github.com/google/closure-library/blob/master/closure/goog/structs/heap.js) - a hugely popular library, but is the worst implementation with respect to performance;
- [Fast Priority Queue](https://github.com/lemire/FastPriorityQueue.js) - runs comparably fast, but doesn't support inserting keys as well, so its implementation significantly limits what the user is able to achieve with it;
- [FlatQueue](https://github.com/mourner/flatqueue) and [TinyQueue](https://github.com/mourner/flatqueue) - two very nice queue implementations by Vladimir Agafonkin. They don't support the build method and that's why they're missing this benchmark. FlatQueue performs considerably well for an implementation that is not based on typed arrays.
