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

    /**
     * Gets the size of the linked list.
     */
    size() {
        return this.#size;
    }

    /**
     * Gets the head of the linked list.
     * @returns {Node}
     */
    head() {
        return this.#head;
    }

    /**
     * Gets the tail of the linked list.
     * @returns {Node}
     */
    tail() {
        return this.#tail;
    }

    /**
     * Inserts a value at the tail of the linked list.
     * @param {any} data 
     */
    insertLast(data) {
        const node = new Node(data);
        node.next = null;
        if (this.#tail) this.#tail.next = node;
        this.#tail = node;
        this.#head = this.#head ?? this.#tail;
        this.#size++;
    }

    /**
     * Removes a value from the head of the linked list.
     */
    removeFirst() {
        if (!this.#size) throw new Error('Operation not allowed on list of size 0');
        const next = this.#head.next;
        this.#head.next = null;
        if (this.#head === this.#tail) this.#tail = null;
        this.#head = next;
        this.#size--;
    }
}