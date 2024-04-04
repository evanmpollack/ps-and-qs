import assert from 'node:assert/strict';
import LinkedList from '../../lib/pool/linkedlist.js';
import Node from '../../lib/pool/node.js';

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
    describe('#insertLast', function() {
        let linkedList;

        beforeEach(function() {
            linkedList = createLinkedList();
        });

        context('when list is empty', function() {
            it('head should be set to tail node', function() {
                linkedList.insertLast(0);
                // Test referential equality
                assert.equal(linkedList.head(), linkedList.tail());
            });
        });

        context('when list is not empty', function() {
            beforeEach(function() {
                // Arbitrary value that satisfies n > 0
                const n = 1;
                populateLinkedList(linkedList, n);
            });

            it('previous tail node should point to new tail node', function() {
                const previousTail = linkedList.tail();
                linkedList.insertLast(0);
                assert.equal(previousTail.next, linkedList.tail());
            });

            it('reference to head node should remain unchanged', function() {
                const previousHead = linkedList.head();
                linkedList.insertLast(0);
                // Test referential equality
                assert.equal(linkedList.head(), previousHead);
            });
        });

        it('tail should be set to a new node', function() {
            linkedList.insertLast(0);
            assert(linkedList.tail() instanceof Node);
        });

        it('tail node should contain last added value', function() {
            const insertData = 0;
            linkedList.insertLast(insertData);
            assert.equal(linkedList.tail().data, insertData);
        });
        
        it('tail node should point to null', function() {
            linkedList.insertLast(0);
            assert.equal(linkedList.tail().next, null);
        });

        it('size should increase by 1', function() {
            const previousSize = linkedList.size();
            linkedList.insertLast(0);
            assert.equal(linkedList.size(), previousSize + 1);
        });
    });

    describe('#removeFirst', function() {
        let linkedList;
        
        beforeEach(function() {
            linkedList = createLinkedList();
        });
        
        context('when list is empty', function() {
            it('should throw error', function() {
                const expectedErrorType = 'Error';
                const expectedMessage = 'Operation not allowed on list of size 0';
                // This bound to instance method because instance reference 
                // is not passed in with function reference
                assert.throws(linkedList.removeFirst.bind(linkedList), { 
                    name: expectedErrorType,
                    message: expectedMessage 
                });
            });
        });

        context('when list is not empty', function() {
            beforeEach(function() {
                // Arbitrary value that satisfies n > 0
                const n = 1;
                populateLinkedList(linkedList, n);
            });

            it('removed node should point to null', function() {
                const previousHead = linkedList.head();
                linkedList.removeFirst();
                assert.equal(previousHead.next, null);
            });

            it('head should be set to the next node', function() {
                const next = linkedList.head().next;
                linkedList.removeFirst();
                assert.equal(linkedList.head(), next);
            });

            it('size should decrease by 1', function() {
                const previousSize = linkedList.size();
                linkedList.removeFirst();
                assert.equal(linkedList.size(), previousSize - 1);
            });

            context('size is 1', function() {
                it ('tail should be set to null', function() {
                    linkedList.removeFirst();
                    assert.equal(linkedList.tail(), null);
                });
            });
        });
    });
});