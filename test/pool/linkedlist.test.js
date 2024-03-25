import LinkedList from "../../lib/pool/linkedlist.mjs";

/**
 * Test Plan
 * 1. removeFirst:
 *  - When list has length > 1
 *      - test that size decreases by 1
 *      - that toString doesn't contain the removed value
 *  - When list has length == 1
 *      - head === tail
        - size === 1
 *  - When list has length == 0
        - head === tail === null
        - size === 0
 * 2. insertLast
    - when list size == 0
        - size increases by 1
        - head === tail !== null
    - when list size > 0
        - head !== tail, tail is same
        - size increases by 1
 */


describe('insertLast', () => {
    describe('when element is added to list of size 0', () => {
        test('size should increase from 0 to 1', () => {
            // Initialize linked list
            const linkedList = new LinkedList();
            expect(linkedList.size()).toEqual(0);

            // Create and insert node
            const data = 1;
            linkedList.insertLast(data);
            expect(linkedList.size()).toEqual(1);
        });

        test('head and tail should non-null and equal', () => {
            // Initialize linked list
            const linkedList = new LinkedList();
            
            // Create and insert node
            const data = 1;
            linkedList.insertLast(data);

            expect(linkedList.head().data).toEqual(data);
            expect(linkedList.tail().data).toEqual(data);
            // Test referential equality
            expect(linkedList.head()).toBe(linkedList.tail()); 
        });

        test('head and tail should point to null', () => {
            // Initialize linked list
            const linkedList = new LinkedList();
            
            // Create and insert node
            const data = 1;
            linkedList.insertLast(data);

            expect(linkedList.head().next).toBeNull();
            expect(linkedList.tail().next).toBeNull();
        });
    });

    // Should I test specifically for size 1-2?
    describe('when an element is added to a list of size N, where N > 1', () => {
        test('size should increase from N to N + 1', () => {
            // Set n, an arbitrary value of items to insert
            // Must satisfy condition N > 1
            const n = 5;
            
            // Initialize linked list
            const linkedList = new LinkedList();

            // Insert N items
            Array.from({ length: n })
                .map((d, i) => i)
                .forEach(i => linkedList.insertLast(i));
        });

        
    });
});