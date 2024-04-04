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

    // queue error tightly coupled with linked list error - check if empty instead?
    dequeue() {
        try {
            const data = this.#linkedList.head()?.data;
            this.#linkedList.removeFirst();
            return data;
        } catch(e) {
            throw new Error(e.message.replace('list', 'queue'), {
                cause: e
            });
        }
    }

    empty() {
        return !this.size();
    }

    size() {
        return this.#linkedList.size();
    }
}