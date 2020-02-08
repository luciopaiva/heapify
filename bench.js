
import FlatQueue from 'flatqueue';
import TinyQueue from 'tinyqueue';
import BinaryHeap from "./";

const N = 1000000;
const K = 1000;

const data = [];
// for (let i = 0; i < N; i++) data[i] = {value: Math.random()};
for (let i = 0; i < N; i++) data[i] = {value: Math.floor(100 * Math.random())};

// TINY QUEUE ---------------------------------------------------------

const q = new TinyQueue([], (a, b) => a.value - b.value);

console.time(`tinyqueue push ${N}`);
for (let i = 0; i < N; i++) q.push(data[i]);
console.timeEnd(`tinyqueue push ${N}`);

console.time(`tinyqueue pop ${N}`);
for (let i = 0; i < N; i++) q.pop();
console.timeEnd(`tinyqueue pop ${N}`);

console.time(`tinyqueue push/pop ${N}`);
for (let i = 0; i < N; i += K) {
    for (let j = 0; j < K; j++) q.push(data[i + j]);
    for (let j = 0; j < K; j++) q.pop();
}
console.timeEnd(`tinyqueue push/pop ${N}`);

// FLAT QUEUE ---------------------------------------------------------

const f = new FlatQueue();

console.time(`flatqueue push ${N}`);
for (let i = 0; i < N; i++) f.push(i, data[i].value);
console.timeEnd(`flatqueue push ${N}`);

console.time(`flatqueue pop ${N}`);
for (let i = 0; i < N; i++) f.pop();
console.timeEnd(`flatqueue pop ${N}`);

console.time(`flat push/pop ${N}`);
for (let i = 0; i < N; i += K) {
    for (let j = 0; j < K; j++) f.push(i, data[i + j].value);
    for (let j = 0; j < K; j++) f.pop();
}
console.timeEnd(`flat push/pop ${N}`);

// NEW QUEUE ---------------------------------------------------------

const heap = new BinaryHeap(N);

console.time(`newqueue push ${N}`);
for (let i = 0; i < N; i++) heap.push(i, data[i].value);
console.timeEnd(`newqueue push ${N}`);

console.time(`newqueue pop ${N}`);
for (let i = 0; i < N; i++) heap.pop();
console.timeEnd(`newqueue pop ${N}`);

console.time(`newqueue push/pop ${N}`);
for (let i = 0; i < N; i += K) {
    for (let j = 0; j < K; j++) heap.push(i, data[i + j].value);
    for (let j = 0; j < K; j++) heap.pop();
}
console.timeEnd(`newqueue push/pop ${N}`);
