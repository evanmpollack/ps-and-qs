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
        const instance = new Queue();
        arr.forEach(element => instance.enqueue(element));
        return instance;
    }

    enqueue(data) {
        this.#linkedList.insertLast(data);
    }

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

    size() {
        return this.#linkedList.size();
    }
}