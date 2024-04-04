import LinkedList from "./linkedlist.js";

/**
 * Partial Implementation of a standard queue based on the Queue ADT
 *  - Backed by singly linked list
 */
export default class Queue {
    #linkedList;

    constructor() {
        this.#linkedList = new LinkedList();
    }

    /**
     * Creation method to build a queue from an array.
     * Maintains order of original array.
     * @param {Array} arr - Array to populate queue with
     */
    static fromArray(arr) {
        if (!(arr instanceof Array)) throw new TypeError('Input must be an array');
        const instance = new Queue();
        arr.forEach(element => instance.enqueue(element));
        return instance;
    }

    /**
     * Inserts an element at the rear of the queue.
     * @param {any} data - element to enqueue
     */
    enqueue(data) {
        this.#linkedList.insertLast(data);
    }

    /**
     * Removes an element from the front of the queue and returns it.
     * If queue is empty, an error is thrown.
     */
    dequeue() {
        if (this.empty()) throw new Error('Operation not allowed on queue of size 0');
        const data = this.#linkedList.head().data;
        this.#linkedList.removeFirst();
        return data;
    }

    /**
     * Determines whether or not the queue is empty.
     */
    empty() {
        return !this.size();
    }

    /**
     * Gets the size of the queue.
     */
    size() {
        return this.#linkedList.size();
    }
}