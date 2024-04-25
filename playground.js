import PriorityQueue from "./lib/weightedpool/priorityqueue.js";
import Heap from "./lib/weightedpool/heap.js";
import WeightedPromisePool from "./lib/weightedpool/weightedpromisepool.js";

// const pq = new PriorityQueue([0, 1, 2, 3, 4, 5]);
// pq.enqueue(10);
// console.log(pq.dequeue());

// const comparator = (a, b) => b - a;

// const heap = Heap.heapify([0, 1, 2, 3, 4, 5], comparator);
// // heap.insert(10);
// Heap.push(heap, 10, comparator);
// Heap.push(heap, 20, comparator);
// console.log(heap);
// console.log(Heap.pop(heap, comparator));
// console.log(heap);

const task = () => new Promise((resolve) => setTimeout(() => resolve('done'), 1000));

const tasks = [
    {
        priority: 2,
        task: task
    }, 
    {
        priority: 1,
        task: task
    },
    {
        priority: 5,
        task: task
    },
    {
        priority: 72,
        task: task
    }, 
    {
        priority: 1,
        task: task
    },
    {
        priority: 27,
        task: task
    },
    {
        priority: 55,
        task: task
    }, 
    {
        priority: 6,
        task: task
    },
    {
        priority: 7,
        task: task
    }
];

// const pq = new PriorityQueue(tasks, (a, b) => b.priority - a.priority)
// console.log(pq.dequeue());
const wp = new WeightedPromisePool(Array.from(tasks), {
    concurrencyLimit: 2,
    comparator: (a, b) => {
        return b.priority - a.priority
    }
});

console.time('wp');
const results = await wp.start();
console.log(results);
console.timeEnd('wp');

console.time('pall');
const limit = 2;
const results2 = [];
for (let i=0; i<tasks.length; i+=limit) {
    results2.push(...(await Promise.allSettled(tasks
        .slice(i, i + limit)
        .map(supplier => supplier.task()))));
}
console.log(results2);
console.timeEnd('pall');