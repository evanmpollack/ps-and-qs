import EmptyQueueError from '../error/emptyqueueerror.js';

/**
 * @typedef {Object} Node
 * @property {any} data
 * @property {?Node} next
 */

export default class Queue {
    /** @type {Node} */
    #head;
    /** @type {Node} */
    #tail;
    /** @type {number} */
    #size;

    /**
     * Gets the size of the queue.
     */
    get size() {
        return this.#size;
    }

    /**
     * Determines whether or not the queue is empty.
     */
    get empty() {
        return !this.size;
    }

    /**
     * Initializes a FIFO queue.
     * 
     * @constructor Queue
     */
    constructor() {
        this.#head = null;
        this.#tail = null;
        this.#size = 0;
    }

    /**
     * Creation method to build a queue from an iterable.
     * Maintains order of original iterable.
     * 
     * @param {Iterable | AsyncIterable} iterable
     * @returns {Promise<Queue>}
     */
    static async fromIterable(iterable) {
        const instance = new Queue();
        for await (const item of iterable) {
            instance.enqueue(item);
        }
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