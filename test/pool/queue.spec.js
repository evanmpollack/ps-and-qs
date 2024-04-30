import assert from 'node:assert/strict';
import Queue from '../../lib/pool/queue.js';
import EmptyCollectionError from '../../lib/error/emptycollectionerror.js';
import { array } from '../helpers.js';

/**
 * Helper method that populates a queue with numbers in ascending order in range [0, size).
 * Ordered for ease of testing.
 * @param {Queue} queue - Queue instance that needs to be populated
 * @param {Array} arr - Array to populate queue with 
 */
const populateQueue = (queue, arr) => arr.forEach(i => queue.enqueue(i));

describe('Queue', function() { 
    let queue;

    beforeEach(function() {
        queue = new Queue();
    });

    describe('#enqueue', function() {
        it('should insert value at the end', function() {
            const expectedLastElement = 0;
            queue.enqueue(expectedLastElement);
            const lastElement = (() => {
                let curr;
                while(!queue.empty) curr = queue.dequeue();
                return curr;
            })();
            assert.equal(lastElement, expectedLastElement);
        });

        it('size should increase by 1', function() {
            const previousSize = queue.size;
            queue.enqueue(0);
            assert.equal(queue.size, previousSize + 1);
        });
    });

    describe('#dequeue', function() {
        context('queue is empty', function() {
            it('should throw error', function() {
                const expectedError = new EmptyCollectionError();
                // This bound to instance method because instance reference 
                // is not passed in with function reference
                assert.throws(queue.dequeue.bind(queue), expectedError);
            });
        });
        
        context('queue is not empty', function() {
            beforeEach(function() {
                populateQueue(queue, array.populated);
            });

            it('should return the value at the front', function() {
                const data = queue.dequeue();
                assert.equal(data, array.populated[0]);
            });

            it('size should decrease by 1', function() {
                const previousSize = queue.size;
                queue.dequeue();
                assert.equal(queue.size, previousSize - 1);
            });
        });
    });
});