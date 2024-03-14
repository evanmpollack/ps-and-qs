import LinkedList from "./linkedlist.mjs";

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

    size() {
        return this.#linkedList.size();
    }

    toString() {
        return this.#linkedList
            .toString()
            .replace('null', 'end')
            .replaceAll('<-->', '<-');
    }
}