import MaxHeap from './maxheap.js';

export default class PriorityQueue {
    #maxHeap;

    constructor() {
        this.#maxHeap = new MaxHeap();
    }

    static fromArray(arr) {

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
        return this.#maxHeap.size();
    }
}