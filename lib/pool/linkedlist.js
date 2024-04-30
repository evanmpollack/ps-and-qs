import Node from './node.js';
import EmptyCollectionError from '../error/emptycollectionerror.js';

/**
 * Partial implementation of a singly linked list based on the List ADT
 */
export default class LinkedList {
    // private properties to prevent them from being set outside of the class
    #head;
    #tail;
    #size;

    /**
     * Gets the head node of the linked list.
     * 
     * @returns {Node}
     */
    get head() {
        return this.#head;
    }

    /**
     * Gets the tail node of the linked list.
     * 
     * @returns {Node}
     */
    get tail() {
        return this.#tail;
    }

    /**
     * Gets the size of the linked list.
     * 
     * @returns {Number}
     */
    get size() {
        return this.#size;
    }

    constructor() {
        this.#head = null;
        this.#tail = null;
        this.#size = 0;
    }

    /**
     * Creation method to build a linked list from an array.
     * Maintains order of original array.
     * 
     * @param {Array} array - Array to populate linked list with
     */
    static fromArray(array) {
        const instance = new LinkedList();
        array.forEach(item => instance.insertLast(item));
        return instance;
    }

    /**
     * Inserts a value at the tail of the linked list.
     * 
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
        if (!this.#size) throw new EmptyCollectionError('linked list');
        const next = this.#head.next;
        this.#head.next = null;
        if (this.#head === this.#tail) this.#tail = null;
        this.#head = next;
        this.#size--;
    }
}