import LinkedList from "./linkedlist.mjs";

export default class Queue {
    #linkedList;

    constructor() {
        this.#linkedList = new LinkedList();
    }

    enqueue(data) {
        this.#linkedList.addBack(data);
    }

    dequeue() {
        const head = this.peek();
        this.#linkedList.removeFront();
        return head;
    }

    peek() {
        return this.#linkedList.head();
    }

    toString() {
        return this.#linkedList
            .toString()
            .replace('null', 'end')
            .replaceAll('<-->', '<-');
    }
}