import assert from 'node:assert/strict';
import Queue from '../../lib/queue/queue.js';
import EmptyQueueError from '../../lib/error/emptyqueueerror.js';
import { array, queueToArray, loadQueue } from '../helpers.js';

describe('Queue', function() { 
    context('creation', function() {
        describe('#fromArray', function() {
            it('should return an instance of Queue', function() {
                assert(Queue.fromArray(array.populated) instanceof Queue);
            });

            it('should maintain the order of the input array', function() {
                const queueFromArray = Queue.fromArray(array.populated);
                const queueAsArray = queueToArray(queueFromArray);
                assert.deepEqual(queueAsArray, array.populated);
            });

            it('size should be equal to the size of the input array', function() {
                assert.equal(Queue.fromArray(array.populated).size, array.populated.length);
            });

            it('should return an empty queue if input array is empty', function() {
                assert.equal(Queue.fromArray(array.empty).size, 0);
            });
        });
    });

    context('operation', function() {
        let queue;

        beforeEach(function() {
            queue = new Queue();
        });

        // Parameterize
        describe('#enqueue', function() {
            beforeEach(function() {
                loadQueue(queue, array.populated);
            });

            it('should insert element at the end', function() {
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
                it('should throw an EmptyQueueError', function() {
                    const expectedError = new EmptyQueueError();
                    // This bound to instance method because instance reference 
                    // is not passed in with function reference
                    assert.throws(queue.dequeue.bind(queue), expectedError);
                });
            });
            
            // Parameterize
            context('queue is not empty', function() {
                beforeEach(function() {
                    loadQueue(queue, array.populated);
                });

                it('should remove the element at the front', function() {
                    const firstElement = array.populated[0];
                    queue.dequeue();
                    assert(!queueToArray(queue).includes(firstElement));
                });

                it('should return the element at the front', function() {
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
});