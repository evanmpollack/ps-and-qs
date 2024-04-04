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

    static fromArray(arr) {
        if (!(arr instanceof Array)) throw new TypeError('Input must be an array');
        const instance = new Queue();
        arr.forEach(element => instance.enqueue(element));
        return instance;
    }

    enqueue(data) {
        this.#linkedList.insertLast(data);
    }

    dequeue() {
        if (this.empty()) throw new Error('Operation not allowed on queue of size 0');
        const data = this.#linkedList.head().data;
        this.#linkedList.removeFirst();
        return data;
    }

    empty() {
        return !this.size();
    }

    size() {
        return this.#linkedList.size();
    }
}