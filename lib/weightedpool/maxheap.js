/**
 * Partial implementation of a max heap based on the max heap data type
 */
export default class MaxHeap {
    #_heapArray;

    // validate and heapify
    set #heap(array) {
        if (!(array instanceof Array)) throw new TypeError('Input must be an array');
        this.#_heapArray = MaxHeap.#heapify(array);
    }

    get #heap() {
        return this.#_heapArray;
    }

    get size() {
        return this.#heap.length;
    }

    constructor(array=[]) {
        this.#heap = array;
    }

    // Instance methods to perform actions on heap

    insert(data) {
        this.#heap.push(data);
        MaxHeap.#siftUp(this.#heap);
    }

    getMax() {
        this.#validateSize();
        return this.#heap[0];
    }

    extractMax() {
        this.#validateSize();
        MaxHeap.#swap(this.#heap, 0, this.size - 1);
        const max = this.#heap.pop();
        MaxHeap.#siftDown(this.#heap, 0);
        return max;
    }

    // Instance helper methods to prevent illegal state

    #validateSize() {
        if (this.size) return;
        throw new Error('Operation not allowed on heap of size 0'); 
    }

    // Static helper methods to preserve max heap invariance

    static #heapify(array) {
        const lastInternalIndex = Math.floor((array.length / 2)) - 1;
        for (let i = lastInternalIndex; i >= 0; i--) MaxHeap.#siftDown(array, i);
        return array;
    }

    static #siftDown(array, index) {
        while(MaxHeap.#hasLeftChild(array.length, index)) {
            const largerChildIndex = (() => {
                const rightChildLarger = MaxHeap.#hasRightChild(array.length, index) && MaxHeap.#getRightChild(array, index) > MaxHeap.#getLeftChild(array, index);
                return (rightChildLarger) ? MaxHeap.#getRightChildIndex(index) : MaxHeap.#getLeftChildIndex(index);
            })();

            if (array[index] < array[largerChildIndex]) {
                MaxHeap.#swap(array, index, largerChildIndex);
                index = largerChildIndex;
            } else {
                break;
            }
        }
    }

    static #siftUp(array) {
        let index = array.length - 1;
        while(MaxHeap.#hasParent(index) && MaxHeap.#getParent(array, index) < array[index]) {
            let parentIndex = MaxHeap.#getParentIndex(index);
            MaxHeap.#swap(array, index, parentIndex);
            index = parentIndex;
        }
    }

    static #getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }

    static #getParent(array, i) {
        return array[this.#getParentIndex(i)];
    }

    static #hasParent(i) {
        return this.#getParentIndex(i) >= 0;
    }

    static #getLeftChildIndex(i) {
        return (2 * i) + 1;
    }

    static #getLeftChild(array, i) {
        return array[this.#getLeftChildIndex(i)];
    }

    static #hasLeftChild(length, i) {
        return this.#getLeftChildIndex(i) < length;
    }

    static #getRightChildIndex(i) {
        return (2 * i) + 2;
    }

    static #getRightChild(array, i) {
        return array[this.#getRightChildIndex(i)];
    }

    static #hasRightChild(length, i) {
        return this.#getRightChildIndex(i) < length;
    }

    static #swap(array, i, j) {
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}