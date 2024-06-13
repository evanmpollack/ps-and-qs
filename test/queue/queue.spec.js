import assert from 'node:assert/strict';
import Queue from '../../lib/queue/queue.js';
import EmptyQueueError from '../../lib/error/emptyqueueerror.js';

describe.only('Queue', function() { 
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
        describe('#enqueue', function() {
            const enqueueAtSizeTests = [
                { array: [] },
                { array: [1] },
                { array: [1, 2] },
                { array: Array.from({ length: 5000000 }, (_, i) => i) }
            ];

            // I don't think I'm supposed to do this, as the tests appear to be running slower
            enqueueAtSizeTests.forEach(({ array }) => {
                let queue;

                // Resets queue to ensure each test is isolated
                beforeEach(function() {
                    queue = Queue.fromArray(array);
                });

                it(`should insert element at the end when initial size is ${array.length}`, function() {
                    // unique to ensure validity of test
                    const expectedLastElement = 0;
                    queue.enqueue(expectedLastElement);
                    const lastElement = [...queue][queue.size - 1];
                    assert.equal(lastElement, expectedLastElement);
                });

                it(`size should increase to ${array.length + 1} when initial size is ${array.length}`, function() {
                    const previousSize = queue.size;
                    queue.enqueue(0);
                    assert.equal(queue.size, previousSize + 1);
                });
            });
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
                const dequeueAtSizeTests = [
                    { array: [1] },
                    { array: [1, 2] },
                    { array: Array.from({ length: 5000000 }, (_, i) => i) }
                ];
                
                // I don't think I'm supposed to do this, as the tests appear to be running slower
                dequeueAtSizeTests.forEach(({ array }) => {
                    let queue;

                    // Resets queue to ensure each test is isolated
                    beforeEach(function() {
                        queue = Queue.fromArray(array);
                    });

                    it(`should remove the element at the front when initial size is ${array.length}`, function() {
                        const firstElement = [...queue][0];
                        queue.dequeue();
                        assert(!([...queue]).includes(firstElement));
                    });

                    it(`should return the element at the front when initial size is ${array.length}`, function() {
                        const firstElement = [...queue][0];
                        const data = queue.dequeue();
                        assert.equal(data, firstElement);
                    });

                    it(`size should decrease to ${array.length - 1} when initial size is ${array.length}`, function() {
                        const previousSize = queue.size;
                        queue.dequeue();
                        assert.equal(queue.size, previousSize - 1);
                    });
                });
            });
        });
    });
});