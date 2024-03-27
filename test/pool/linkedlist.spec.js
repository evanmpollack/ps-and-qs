import assert from 'node:assert/strict';
import LinkedList from "../../lib/pool/linkedlist.js";

/**
 * Helper method that creates an empty linked list.
 * @returns {LinkedList}
 */
const createLinkedList = () => new LinkedList();

/**
 * Helper method that populates a linked list with numbers in ascending order in range [0, size). 
 * Ordered for ease of testing.
 * @param {LinkedList} linkedList - LinkedList instance that needs to be populated
 * @param {Number} size - Number of elements to add
 * @returns {void}
 */
const populateLinkedList = (linkedList, size) => Array.from({ length: size }).map((_, i) => i).forEach(i => linkedList.insertLast(i));

describe('LinkedList', function() {
    describe('init', function() {
        const linkedList = createLinkedList();
        
        it('should have a size of 0', function() {
            assert.equal(linkedList.size(), 0);
        });
    
        it('head should be null', function() {
            assert.equal(linkedList.head(), null);
        });

        it('tail should be null', function() {
            assert.equal(linkedList.tail(), null);
        });
    });

    describe('#insertLast', function() {
        let linkedList;

        beforeEach(function() {
            linkedList = createLinkedList();
        });

        context('when list is empty', function() {
            it('head and tail should be equal', function() {
                linkedList.insertLast(0);
                // Test referential equality
                assert.equal(linkedList.head(), linkedList.tail());
            });
        });

        context('when list is not empty', function() {
            // Arbitrary value that satisfies n > 0
            const n = 1;

            beforeEach(function() {
                populateLinkedList(linkedList, n);
            });

            it('head and tail should not be equal', function() {
                linkedList.insertLast(0);
                // Test referential equality
                assert.notEqual(linkedList.head(), linkedList.tail());
            });

            it('previous tail should point to new tail', function() {
                linkedList.insertLast(0);
                let curr = linkedList.head();
                while(curr.next.next) curr = curr.next;
                const previousTailAfterInsertion = curr;
                assert.equal(previousTailAfterInsertion.next, linkedList.tail());
            });

            it('head should not update', function() {
                const previousHead = linkedList.head();
                linkedList.insertLast(n);
                assert.equal(linkedList.head(), previousHead);
            });
        });

        it('head should not be null', function() {
            linkedList.insertLast(0);
            assert.notEqual(linkedList.head(), null);
        });

        it('tail should not be null', function() {
            linkedList.insertLast(0);
            assert.notEqual(linkedList.tail(), null);
        });

        it('tail should point to null', function() {
            linkedList.insertLast(0);
            assert.equal(linkedList.tail().next, null);
        });

        it('tail should update', function() {
            const previousTail = linkedList.tail();
            const insertData = 0;
            linkedList.insertLast(insertData);
            assert.notEqual(linkedList.tail(), previousTail);
            assert.equal(linkedList.tail().data, insertData);
        });

        it('size should increase by 1', function() {
            const previousSize = linkedList.size();
            linkedList.insertLast(0);
            assert.equal(linkedList.size(), previousSize + 1);
        });
    });

    describe('#removeFirst', function() {
        
    });
});