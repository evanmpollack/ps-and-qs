import LinkedList from "./linkedlist.mjs";

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
        const head = this.peek();
        this.#linkedList.removeFirst();
        return head.data;
    }

    peek() {
        return this.#linkedList.head();
    }

    size() {
        return this.#linkedList.size();
    }

    toString() {
        return this.#linkedList
            .toString()
            .replace('null', 'end')
            .replaceAll('->', '<-');
    }
}