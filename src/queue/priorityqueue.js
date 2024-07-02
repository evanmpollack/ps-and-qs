import EmptyQueueError from '../error/emptyqueueerror.js';

/**
 * Partial implementation of a priority queue based on the Priority Queue ADT
 *  - Backed by binary heap
 */
export default class PriorityQueue {
    #heap;
    #comparator;

    /**
     * Gets the size of the priority queue.
     */
    get size() {
        return this.#heap.length;
    }

    /**
     * Determines whether or not the priority queue is empty.
     */
    get empty() {
        return !this.size;
    }
    
    /**
     * Initializes an empty priority queue. Ordering is imposed by the
     * given comparator.
     * 
     * @param {Function} comparator 
     */
    constructor(comparator) {
        this.#heap = [];
        this.#comparator = comparator;
    }

    /**
     * Creation method to build a priority queue from an iterable.
     * Ordering defined by comparator.
     * 
     * @param {Iterable | AsyncIterable} iterable 
     * @param {Function} comparator 
     * @returns {Promise<PriorityQueue>}
     */
    static async fromIterable(iterable, comparator) {
        const copy = [];
        for await (const item of iterable) {
            copy.push(item);
        }
        const instance = new PriorityQueue(comparator);
        instance.#heap = PriorityQueue.#heapify(copy, instance.#comparator);
        return instance;
    }

    /**
     * Inserts an element into the priority queue based on the given comparator.
     * 
     * @param {any} data
     */
    enqueue(data) {
        this.#heap.push(data);
        PriorityQueue.#siftUp(this.#heap, this.#comparator);
    }

    /**
     * Removes and returns the element with the most priority based on the given comparator.
     * 
     * @returns {any}
     */
    dequeue() {
        if (this.empty) throw new EmptyQueueError();
        PriorityQueue.#swap(this.#heap, 0, this.#heap.length - 1);
        const last = this.#heap.pop();
        PriorityQueue.#siftDown(this.#heap, 0, this.#comparator);
        return last;
    }

    /**
     * Applies the bottom-up heap construction algorithm to an array using the given comparator.
     * 
     * @param {Array} array 
     * @param {Function} comparator 
     * @returns {Array}
     */
    static #heapify(array, comparator) {
        let lastInternalIndex = Math.floor((array.length / 2)) - 1;
        for (let i=lastInternalIndex; i>=0; i--) PriorityQueue.#siftDown(array, i, comparator);
        return array;
    }

    /**
     * Moves the last element up the heap (decreases index/key) as long as it has a parent
     * and should be closer to the root of the heap than the parent according to the provided comparator.
     * 
     * @param {Array} array 
     * @param {Function} comparator 
     */
    static #siftUp(array, comparator) {
        let index = array.length - 1;
        const parentIndex = (index) => Math.floor((index - 1) / 2);
        // hasParent && currentValue > parent
        while(parentIndex(index) >= 0 && comparator(array[index], array[parentIndex(index)]) < 0) {
            this.#swap(array, index, parentIndex(index));
            index = parentIndex(index);
        }
    }

    /**
     * Moves an element down the heap (increases index/key) as long as it has children 
     * and should be further from the root of the heap than the selected child according
     * to the given comparator.
     * 
     * @param {Array} array 
     * @param {Number} index 
     * @param {Function} comparator 
     */
    static #siftDown(array, index, comparator) {
        const leftChildIndex = (index) => (2 * index) + 1;
        const rightChildIndex = (index) => (2 * index) + 2;
        // hasLeftChild
        while (leftChildIndex(index) < array.length) {
            // nextChildIndex should always be the index of the child with the most priority based on the given comparator
            const nextChildIndex = (() => {
                // hasRightChild && rightChild > leftChild
                const useRightChildIndex = rightChildIndex(index) < array.length && 
                    comparator(array[rightChildIndex(index)], array[leftChildIndex(index)]) < 0;
                return (useRightChildIndex) ? rightChildIndex(index) : leftChildIndex(index);
            })();

            // currentValue < nextChild
            if (comparator(array[index], array[nextChildIndex]) > 0) {
                this.#swap(array, index, nextChildIndex);
                index = nextChildIndex;
            } else {
                break;
            }
        }
    }

    /**
     * Swaps the values at the given indices in the array.
     * 
     * @param {Array} array 
     * @param {Number} i 
     * @param {Number} j 
     */
    static #swap(array, i, j) {
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    /**
     * Performs traversal using the ordering defined by the comparator.
     * 
     * Note: sorting a heap is O(nlog(n)) regardless if you copy the heap and repeatedly dequeue
     * or if you sort the array using standard Array methods.
     * 
     * Current Complexity: O(nlog(n) + O(n)) => O(nlog(n))
     * 
     * Copy approaches considered:
     * - Using fromIterator: 
     *      - Doesn't work without making priority queue async iterable
     *      - Time Complexity: 
     *          - Heap Copy: O(2n) => O(n)
     *          - Read every element: O(nlog(n))
     *          - Total: O(nlog(n))
     * - Using Array.toSorted:
     *      - Doesn't work with undefined, as comparator isn't applied to undefined values even if it's accounted for in comparator
     *      - Time Complexity:
     *          - Heap Copy: O(nlog(n))
     *          - Read every element: O(n)
     *          - Total: O(nlog(n))
     * - Creating an empty priority queue and enqueuing each item in array:
     *      - Works well
     *      - Time Complexity
     *          - Heap Copy: O(n)
     *          - Read every element: O(nlog(n))
     *          - Total: O(nlog(n))
     */
    *[Symbol.iterator]() {
        const copy = new PriorityQueue(this.#comparator);
        // O(n) because enqueue will be O(1), as no shifting will have to take place due to level order traversal property
        this.#heap.forEach(item => copy.enqueue(item));
        while(!copy.empty) {
            yield copy.dequeue();
        }
    }
}