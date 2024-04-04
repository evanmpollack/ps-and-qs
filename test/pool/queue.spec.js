import assert from 'node:assert/strict';
import Queue from '../../lib/pool/queue.js';

/**
 * Helper object that has all the possible array inputs needed for unit testing
 */
const array = {
    populated: [1, 2, 3, 4],
    empty: [],
    invalid: 0
};

/**
 * Helper method that populates a queue with numbers in ascending order in range [0, size).
 * Ordered for ease of testing.
 * @param {Queue} queue - Queue instance that needs to be populated
 * @param {Array} arr - Array to populate queue with 
 */
const populateQueue = (queue, arr) => arr.forEach(i => queue.enqueue(i));

describe('Queue', function() { 
    context('creation', function() {
        describe('#fromArray', function() {
            it('should maintain the order of the input array', function() {
                const queueFromArray = Queue.fromArray(array.populated);
                const queueAsArray = (() => {
                    const elements = [];
                    while(!queueFromArray.empty()) elements.push(queueFromArray.dequeue());
                    return elements;
                })();
                assert.deepEqual(queueAsArray, array.populated);
            });

            it('size should increase by the length of the input array', function() {
                assert.equal(Queue.fromArray(array.populated).size(), array.populated.length);
            });

            it('should return an empty queue if input array is empty', function() {
                assert.equal(Queue.fromArray(array.empty).size(), 0);
            });

            it('should throw a TypeError if input is not a type of array', function() {
                const expectedErrorType = 'TypeError';
                const expectedMessage = 'Input must be an array';
                assert.throws(() => Queue.fromArray(array.invalid), {
                    name: expectedErrorType,
                    message: expectedMessage
                });
            });
        });
    });
    
    context('operation', function() {
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
                    while(!queue.empty()) curr = queue.dequeue();
                    return curr;
                })();
                assert.equal(lastElement, expectedLastElement);
            });

            it('size should increase by 1', function() {
                const previousSize = queue.size();
                queue.enqueue(0);
                assert.equal(queue.size(), previousSize + 1);
            });
        });

        describe('#dequeue', function() {
            context('queue is empty', function() {
                it('should throw error', function() {
                    const expectedErrorType = 'Error';
                    const expectedMessage = 'Operation not allowed on queue of size 0';
                    // This bound to instance method because instance reference 
                    // is not passed in with function reference
                    assert.throws(queue.dequeue.bind(queue), { 
                        name: expectedErrorType,
                        message: expectedMessage 
                    });
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
                    const previousSize = queue.size();
                    queue.dequeue();
                    assert.equal(queue.size(), previousSize - 1);
                });
            });
        });

        describe('#empty', function() {
            context('queue is empty', function() {
                it('should return true', function() {
                    assert(queue.empty());
                });
            });

            context('queue is not empty', function() {
                beforeEach(function() {
                    populateQueue(queue, array.populated);
                });
                
                it('should return false', function() {
                    assert(!queue.empty());
                })
            });
        });
    });
});