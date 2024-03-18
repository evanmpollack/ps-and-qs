import Node from './node.mjs';

// Partial implementation of a Doubly Linked List
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

    addFront(data) {
        const node = new Node();
        node.data = data;
        node.next = this.#head;
        node.prev = null;

        // Edge case: head is null (size 0->1)
        if (this.#head !== null) this.head.prev = node;
        
        this.#head = node;
        this.#tail = this.#tail ?? node;
        
        this.#incrementSize();
    }

    addBack(data) {
        const node = new Node();
        node.data = data;
        node.next = null;
        node.prev = this.#tail;
        
        // Edge case: tail is null (size 0->1)
        if (this.#tail !== null) this.#tail.next = node;
        
        this.#head = this.#head ?? node;
        this.#tail = node;
        
        this.#incrementSize();
    }

    removeFront() {
        this.#validateSize();
        if (this.#size > 1) {
            const next = this.#head.next;
            next.prev = null;
            this.#head = next;
        }
        this.#decrementSize();
    }

    removeBack() {
        this.#validateSize();
        const prev = this.#tail.prev;
        prev.next = null;
        this.#tail = prev;
        this.#decrementSize();
    }

    toString() {
        let output = '';
        let node = this.#head;
        while (node !== null) {
            output += `${node.data}<-->`;
            node = node.next;
        }

        return output + 'null';
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