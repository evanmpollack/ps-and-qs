import PriorityQueue from "./lib/weightedpool/priorityqueue.js";
import Heap from "./lib/weightedpool/heap.js";

// const pq = new PriorityQueue([0, 1, 2, 3, 4, 5]);
// pq.enqueue(10);
// console.log(pq.dequeue());

const comparator = (a, b) => b - a;

const heap = Heap.heapify([0, 1, 2, 3, 4, 5], comparator);
// heap.insert(10);
Heap.push(heap, 10, comparator);
Heap.push(heap, 20, comparator);
console.log(heap);
console.log(Heap.pop(heap, comparator));
console.log(heap);