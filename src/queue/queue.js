import EmptyQueueError from '../error/emptyqueueerror.js';

/**
 * Partial implementation of a standard queue based on the Queue ADT
 *  - Backed by singly linked list
 */
export default class Queue {
    #head;
    #tail;
    #size;

    /**
     * Gets the size of the queue.
     * 
     * @returns {Number}
     */
    get size() {
        return this.#size;
    }

    /**
     * Determines whether or not the queue is empty.
     * 
     * @returns {Boolean}
     */
    get empty() {
        return !this.size;
    }

    constructor() {
        this.#head = null;
        this.#tail = null;
        this.#size = 0;
    }

    /**
     * Creation method to build a queue from an array.
     * Maintains order of original array.
     * 
     * @param {Array} array
     */
    static fromArray(array) {
        const instance = new Queue();
        array.forEach(item => instance.enqueue(item));
        return instance;
    }

    /**
     * Inserts an element at the rear of the queue.
     * 
     * @param {any} data
     */
    enqueue(data) {
        const node = { data: data, next: null };
        if (this.#tail) this.#tail.next = node;
        this.#tail = node;
        this.#head = this.#head ?? this.#tail;
        this.#size++;
    }

    /**
     * Removes and returns the element from the front of the queue.
     * If queue is empty, an error is thrown.
     * 
     * @returns {any}
     */
    dequeue() {
        if (this.empty) throw new EmptyQueueError();
        const { data, next } = this.#head;
        this.#head.next = null;
        if (this.#head === this.#tail) this.#tail = null;
        this.#head = next;
        this.#size--;
        return data;
    }

    /**
     * Performs traversal from the head.
     */
    *[Symbol.iterator]() {
        let node = this.#head;
        while(node) {
            yield node.data;
            node = node.next;
        }
    }
}