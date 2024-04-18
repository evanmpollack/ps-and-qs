import Heap from './heap.js';

/**
 * Default comparator compares numbers in descending order
 * @param {Number} taskA 
 * @param {Number} taskB
 * @returns A positive number if taskB > taskA, zero if taskB = taskA, a negative number if taskB < taskA
 */
const DEFAULT_COMPARATOR = (taskA, taskB) => taskB - taskA;

export default class PriorityQueue {
    #maxHeap;
    #_comparator;

    // Move to pool to avoid confusing constructor?
    set #comparator(comparator) {
        if (!(comparator instanceof Function)) throw new TypeError('Comparator must be a function');
        this.#_comparator = comparator;
    }

    get #comparator() {
        return this.#_comparator;
    }

    get size() {
        return this.#maxHeap.size;
    }

    get empty() {
        return !this.size;
    }

    // Set default?
    constructor(array, comparator=DEFAULT_COMPARATOR) {
        // Comparator must be validated before heapify operation
        this.#comparator = comparator;
        this.#maxHeap = Heap.heapify(array, this.#comparator);
    }

    enqueue(data) {
        Heap.push(this.#maxHeap, data, this.#comparator);
    }

    dequeue() {
        return Heap.pop(this.#maxHeap, this.#comparator);
    }
}