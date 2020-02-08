
import BinaryHeap from './';
import test from 'tape';

const data = [];
for (let i = 0; i < 100; i++) {
    data.push(Math.floor(100 * Math.random()));
}

const sorted = data.slice().sort((a, b) => a - b);

test('maintains a priority queue', (t) => {
    const queue = new BinaryHeap(100);
    for (let i = 0; i < data.length; i++) queue.push(i, data[i]);

    t.equal(queue.peekPriority(), sorted[0]);
    t.equal(data[queue.peek()], sorted[0]);

    const result = [];
    while (queue.length) result.push(data[queue.pop()]);

    t.same(result, sorted);

    t.end();
});

test('handles edge cases with few elements', (t) => {
    const queue = new BinaryHeap();

    queue.push(0, 2);
    queue.push(1, 1);
    queue.pop();
    queue.pop();
    queue.pop();
    queue.push(2, 2);
    queue.push(3, 1);
    t.equal(queue.pop(), 3);
    t.equal(queue.pop(), 2);
    t.equal(queue.pop(), undefined);

    t.end();
});
