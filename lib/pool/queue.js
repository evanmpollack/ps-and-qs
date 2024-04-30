import LinkedList from './linkedlist.js';

/**
 * Partial Implementation of a standard queue based on the Queue ADT
 *  - Backed by singly linked list
 */
export default class Queue {
    #linkedList;

    /**
     * Gets the size of the queue.
     * 
     * @returns {Number}
     */
    get size() {
        return this.#linkedList.size;
    }

    /**
     * Determines whether or not the queue is empty.
     * 
     * @returns {Boolean}
     */
    get empty() {
        return !this.size;
    }

    constructor(array) {
        this.#linkedList = LinkedList.fromArray(array);
    }

    /**
     * Inserts an element at the rear of the queue.
     * 
     * @param {any} data - element to enqueue
     */
    enqueue(data) {
        this.#linkedList.insertLast(data);
    }

    /**
     * Removes an element from the front of the queue and returns it.
     * If queue is empty, an error is thrown.
     * 
     * @returns {any}
     */
    dequeue() {
        if (this.empty) throw new EmptyCollectionError();
        const data = this.#linkedList.head.data;
        this.#linkedList.removeFirst();
        return data;
    }
}