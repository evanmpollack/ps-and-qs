import assert from 'node:assert/strict';
import Queue from '../../src/queue/queue.js';
import EmptyQueueError from '../../src/error/emptyqueueerror.js';

describe('Queue', function() { 
    context('creation', function() {
        describe('#fromIterable', function() {
            it('should return an instance of Queue', async function() {
                const iterable = [];
                const queue = await Queue.fromIterable(iterable);
                assert(queue instanceof Queue);
            });

            it('should maintain the order of the input iterable', async function() {
                // Declared outside generator because generators can only be iterated over once
                const values = [1, 2, 3, 4, 5];
                const iterable = (function*() {
                    yield* values;
                })();
                const queue = await Queue.fromIterable(iterable);
                assert.deepEqual([...queue], values);
            });

            it('size should be equal to the size of the input iterable', async function() {
                // Declared outside generator because generators can only be iterated over once
                // Also, the spread operator doesn't support async generators
                const values = [2];
                const iterable = (async function*() {
                    yield* values;
                })();
                const queue = await Queue.fromIterable(iterable);
                assert.equal(queue.size, values.length);
            });

            it('should return an empty queue if input iterable is empty', async function() {
                const iterable = (function*() {})();
                const queue = await Queue.fromIterable(iterable);
                assert.equal(queue.size, 0);
            });
        });
    });

    context('operation', function() {
        // Helper method for operation context
        const createQueue = async (size) => {
            const array = Array.from({ length: size }, (_, i) => i);
            return await Queue.fromIterable(array);
        };

        describe('#enqueue', function() {
            const testInsertion = (size) => {
                return async function() {
                    const queue = await createQueue(size);
                    // unique to ensure validity of test
                    const valueToInsert = -1;
                    queue.enqueue(valueToInsert);
                    const lastElement = [...queue][queue.size - 1];
                    assert.equal(lastElement, valueToInsert);
                };
            };

            const testSizeIncrement = (size) => {
                return async function() {
                    const queue = await createQueue(size);
                    queue.enqueue(-1);
                    assert.equal(queue.size, size + 1);
                };
            };

            const sizesToTest = [0, 1, 2, 250000];

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
                    return async function() {
                        const queue = await createQueue(size);
                        const firstElement = [...queue][0];
                        queue.dequeue();
                        assert(!([...queue]).includes(firstElement));
                    };
                };

                const testReturnValue = (size) => {
                    return async function() {
                        const queue = await createQueue(size);
                        const firstElement = [...queue][0];
                        const data = queue.dequeue();
                        assert.equal(data, firstElement);
                    };
                };

                const testSizeDecrement = (size) => {
                    return async function() {
                        const queue = await createQueue(size);
                        queue.dequeue();
                        assert.equal(queue.size, size - 1);
                    };
                };

                const sizesToTest = [1, 2, 250000];

                for (const size of sizesToTest) {
                    it(`should remove the element at the front when the initial size is ${size}`, testRemoval(size));
                    it(`should return the element at the front when the initial size is ${size}`, testReturnValue(size));
                    it(`size should decrease to ${size - 1} when initial size is ${size}`, testSizeDecrement(size));
                }
            });
        });
    });
});