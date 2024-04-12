import PriorityQueue from "./lib/weightedpool/priorityqueue.js";
import MaxHeap from "./lib/weightedpool/maxheap.js";

const pq = new PriorityQueue([0, 1, 2, 3, 4, 5]);
pq.enqueue(10);
console.log(pq.dequeue());

const heap = new MaxHeap([0, 1, 2, 3, 4, 5]);
heap.insert(10);
console.log(heap.getMax());