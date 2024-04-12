import MaxHeap from './maxheap.js';

export default class PriorityQueue {
    #maxHeap;

    // Set default?
    constructor(array) {
        this.#maxHeap = new MaxHeap(array);
    }

    enqueue(data) {
        this.#maxHeap.insert(data);
    }

    dequeue() {
        return this.#maxHeap.extractMax();
    }

    empty() {
        return !this.size();
    }

    size() {
        return this.#maxHeap.size;
    }
}