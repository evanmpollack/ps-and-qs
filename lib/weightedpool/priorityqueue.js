import Heap from './heap.js';

/**
 * Partial Implementation of a standard queue based on the Priority Queue ADT
 *  - Backed by heaps
 */
export default class PriorityQueue {
    #maxHeap;
    #comparator;

    /**
     * Gets the size of the priority queue.
     * 
     * @returns {Number}
     */
    get size() {
        return this.#maxHeap.length;
    }

    /**
     * Determines whether or not the priority queue is empty.
     * 
     * @returns {Boolean}
     */
    get empty() {
        return !this.size;
    }

    constructor(array, comparator) {
        this.#comparator = comparator;
        this.#maxHeap = Heap.heapify(array, this.#comparator);
    }

    /**
     * Inserts an element into the priority queue based on the given comparator.
     * 
     * @param {any} data - element to enqueue
     */
    enqueue(data) {
        Heap.push(this.#maxHeap, data, this.#comparator);
    }

    /**
     * Removes the element with the most priority based on the given comparator.
     * 
     * @returns {any}
     */
    dequeue() {
        return Heap.pop(this.#maxHeap, this.#comparator);
    }
}