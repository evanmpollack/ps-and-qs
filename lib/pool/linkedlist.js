import Node from './node.js';

/**
 * Partial implementation of a singly linked list based on the List ADT
 */
export default class LinkedList {
    #head;
    #tail;
    #size;

    constructor() {
        this.#head = null;
        this.#tail = null;
        this.#size = 0;
    }

    size() {
        return this.#size;
    }

    head() {
        return this.#head;
    }

    tail() {
        return this.#tail;
    }

    insertLast(data) {
        const node = new Node(data);
        node.next = null;
        if (this.#tail) this.#tail.next = node;
        this.#tail = node;
        this.#head = this.#head ?? this.#tail;
        this.#incrementSize();
    }

    removeFirst() {
        this.#validateSize();
        const next = this.#head.next;
        this.#head.next = null;
        if (this.#head === this.#tail) this.#tail = null;
        this.#head = next;
        this.#decrementSize();
    }

    #incrementSize() {
        this.#size++;
    }

    #decrementSize() {
        this.#size--;
    }

    #validateSize() {
        if (this.#size !== 0) return;
        throw new Error('Operation not allowed on list of size 0');
    }
}