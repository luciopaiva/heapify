
# Heapify

🚑 🚴 🚌 🚕 🚗 🚚 🚛

A very fast JavaScript priority queue, implemented using a binary heap, which in turn is implemented using two underlying parallel [typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray). No dependencies whatsoever; just plain, vanilla JS.

It's the fastest publicly available JavaScript library implementation of a priority queue. Here's benchmark comparing Heapify with two other known libraries implementing heaps, running for 1 million elements:

```
              push       pop      push+pop
TinyQueue   70.619ms  415.536ms  115.207ms
FlatQueue  106.833ms  141.341ms   95.777ms
Heapify     37.245ms  123.545ms   95.354ms 
```

Supported operations:

- push: O(log n)
- pop: O(log n)
- peek: O(1)

## How to install

    npm i heapify

Or

    yarn add heapify

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
