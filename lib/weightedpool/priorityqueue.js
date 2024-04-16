import MaxHeap from './maxheap.js';

/**
 * Default comparator compares numbers in descending order
 * @param {Number} n1 
 * @param {Number} n2 
 * @returns A positive number if n2 > n1, zero if n2 = n1, a negative number if n2 < n1
 */
const DEFAULT_COMPARATOR = (n1, n2) => n2 - n1;

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

    // Set default?
    constructor(array, comparator=DEFAULT_COMPARATOR) {
        // Comparator must be validated before heapify operation
        this.#comparator = comparator;
        this.#maxHeap = MaxHeap.heapify(array, this.#comparator);
    }

    enqueue(data) {
        MaxHeap.insert(this.#maxHeap, data, this.#comparator);
    }

    dequeue() {
        return MaxHeap.extractMax(this.#maxHeap, this.#comparator);
    }

    empty() {
        return !this.size();
    }

    size() {
        return this.#maxHeap.length
    }
}