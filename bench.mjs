
import FlatQueue from 'flatqueue';
import TinyQueue from 'tinyqueue';
import Heapify from "./heapify.mjs";

const N = 1000000;
const K = 1000;

const indexes = Array(N);
const data = Array(N);
const dataObjs = Array(N);
for (let i = 0; i < N; i++) {
    const value = Math.floor(100 * Math.random());
    data[i] = value;
    indexes[i] = i + 1;
    dataObjs[i] = { value };
}

// TINY QUEUE ---------------------------------------------------------

const q = new TinyQueue([], (a, b) => a.value - b.value);

console.time(`tinyqueue push ${N}`);
for (let i = 0; i < N; i++) q.push(dataObjs[i]);
console.timeEnd(`tinyqueue push ${N}`);

console.time(`tinyqueue pop ${N}`);
for (let i = 0; i < N; i++) q.pop();
console.timeEnd(`tinyqueue pop ${N}`);

console.time(`tinyqueue push/pop ${N}`);
for (let i = 0; i < N; i += K) {
    for (let j = 0; j < K; j++) q.push(dataObjs[i + j]);
    for (let j = 0; j < K; j++) q.pop();
}
console.timeEnd(`tinyqueue push/pop ${N}`);

// FLAT QUEUE ---------------------------------------------------------

const f = new FlatQueue();

console.time(`flatqueue push ${N}`);
for (let i = 0; i < N; i++) f.push(i, data[i]);
console.timeEnd(`flatqueue push ${N}`);

console.time(`flatqueue pop ${N}`);
for (let i = 0; i < N; i++) f.pop();
console.timeEnd(`flatqueue pop ${N}`);

console.time(`flatqueue push/pop ${N}`);
for (let i = 0; i < N; i += K) {
    for (let j = 0; j < K; j++) f.push(i, data[i + j]);
    for (let j = 0; j < K; j++) f.pop();
}
console.timeEnd(`flatqueue push/pop ${N}`);

// NEW QUEUE ---------------------------------------------------------

const heap = new Heapify(N);

// build should be compared with push() in the other implementations
console.time(`heapify build ${N}`);
new Heapify(N, indexes, data);
console.timeEnd(`heapify build ${N}`);

console.time(`heapify push ${N}`);
for (let i = 0; i < N; i++) heap.push(i, data[i]);
console.timeEnd(`heapify push ${N}`);

console.time(`heapify pop ${N}`);
for (let i = 0; i < N; i++) heap.pop();
console.timeEnd(`heapify pop ${N}`);

console.time(`heapify push/pop ${N}`);
for (let i = 0; i < N; i += K) {
    for (let j = 0; j < K; j++) heap.push(i, data[i + j]);
    for (let j = 0; j < K; j++) heap.pop();
}
console.timeEnd(`heapify push/pop ${N}`);
