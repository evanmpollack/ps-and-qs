import assert from 'node:assert/strict';
import Queue from '../../lib/queue/queue.js';
import EmptyQueueError from '../../lib/error/emptyqueueerror.js';

describe('Queue', function() { 
    context('creation', function() {
        describe('#fromArray', function() {
            it('should return an instance of Queue', function() {
                const array = [];
                const queue = Queue.fromArray(array);
                assert(queue instanceof Queue);
            });

            it('should maintain the order of the input array', function() {
                const array = [1, 2, 3, 4, 5];
                const queue = Queue.fromArray(array);
                assert.deepEqual([...queue], array);
            });

            it('size should be equal to the size of the input array', function() {
                const array = [1, 2, 3, 4, 5];
                const queue = Queue.fromArray(array);
                assert.equal(queue.size, array.length);
            });

            it('should return an empty queue if input array is empty', function() {
                const array = [];
                const queue = Queue.fromArray(array);
                assert.equal(queue.size, 0);
            });
        });
    });

    context('operation', function() {
        // Helper method for operation context
        const createQueue = (size) => {
            const array = Array.from({ length: size }, (_, i) => i);
            return Queue.fromArray(array);
        };

        describe('#enqueue', function() {
            const testInsertion = (size) => {
                return function() {
                    const queue = createQueue(size);
                    const expectedLastElement = -1;
                    queue.enqueue(expectedLastElement);
                    const lastElement = [...queue][queue.size - 1];
                    assert.equal(lastElement, expectedLastElement);
                };
            };

            const testSizeIncrement = (size) => {
                return function() {
                    const queue = createQueue(size);
                    queue.enqueue(-1);
                    assert.equal(queue.size, size + 1);
                };
            };

            const sizesToTest = [0, 1, 2, 5000000];

            for (const size of sizesToTest) {
                it(`should insert an element at the end when initial size is ${size}`, testInsertion(size));
                it(`size should increase to ${size + 1} when initial size is ${size}`, testSizeIncrement(size));
            }
        });

        describe('#dequeue', function() {
            context('queue is empty', function() {
                it('should throw an EmptyQueueError', function() {
                    const queue = new Queue();
                    const expectedError = new EmptyQueueError();
                    // This bound to instance method because instance reference 
                    // is not passed in with function reference
                    assert.throws(queue.dequeue.bind(queue), expectedError);
                });
            });

            context('queue is not empty', function() {
                const testRemoval = (size) => {
                    return function() {
                        const queue = createQueue(size);
                        const firstElement = [...queue][0];
                        queue.dequeue();
                        assert(!([...queue]).includes(firstElement));
                    };
                };

                const testReturnValue = (size) => {
                    return function() {
                        const queue = createQueue(size);
                        const firstElement = [...queue][0];
                        const data = queue.dequeue();
                        assert.equal(data, firstElement);
                    };
                };

                const testSizeDecrement = (size) => {
                    return function() {
                        const queue = createQueue(size);
                        queue.dequeue();
                        assert.equal(queue.size, size - 1);
                    };
                };

                const sizesToTest = [1, 2, 5000000];

                for (const size of sizesToTest) {
                    it(`should remove the element at the front when the initial size is ${size}`, testRemoval(size));
                    it(`should return the element at the front when the initial size is ${size}`, testReturnValue(size));
                    it(`size should decrease to ${size - 1} when initial size is ${size}`, testSizeDecrement(size));
                }
            });
        });
    });
});