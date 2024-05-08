import assert from 'node:assert/strict';
import PriorityQueue from '../../lib/queue/priorityqueue.js';
import EmptyQueueError from '../../lib/error/emptyqueueerror.js';
import { array, queueToArray, loadQueue } from '../helpers.js';

// Max integer comparator
const maxComparator = (a, b) => b - a;

describe('PriorityQueue', function() {
    context('creation', function() {
        describe('#fromArray', function() {
            it('should return an instance of PriorityQueue', function() {
                assert(PriorityQueue.fromArray(array.populated, maxComparator) instanceof PriorityQueue);
            });

            it('should use the ordering defined by the given comparator', function() {
                const pq = PriorityQueue.fromArray(array.populated, maxComparator);
                assert.deepEqual(queueToArray(pq), array.populated.sort(maxComparator));
            });

            it('size should be equal to the size of the input array', function() {
                assert.equal(PriorityQueue.fromArray(array.populated, maxComparator).size, array.populated.length);
            });

            it('should return an empty priority queue if input array is empty', function() {
                assert.equal(PriorityQueue.fromArray(array.empty).size, array.empty.length);
            });

            it('should not mutate the original array', function() {
                const originalArray = array.populated;
                PriorityQueue.fromArray(originalArray, maxComparator)
                assert.deepEqual(originalArray, array.populated);
            });

            // Skipped for now, implement when open sourcing for future developers
            it.skip('should throw a TypeError if input array is not an Array', function() {
                const expectedError = new TypeError('Array must be an Array');
                assert.throws(PriorityQueue.fromArray.bind(null, array.invalid, maxComparator), expectedError);
            });

            // Skipped for now, implement when open sourcing for future developers
            it.skip('should throw a TypeError if input comparator is not a Function', function() {
                const expectedError = new TypeError('Comparator must be a Function');
                const invalidComparator = {};
                assert.throws(PriorityQueue.fromArray.bind(null, array.populated, invalidComparator), expectedError);
            });

            // When implementing the above consider this. only partially implemented through enqueue method
            it('should throw an error if any element in input array is nullish');
        });
    });

    context('operation', function() {
        // Number not present in sample array to ensure test validity
        const uniqueValue = Number.MAX_SAFE_INTEGER;
        let priorityQueue;

        beforeEach(function() {
            priorityQueue = new PriorityQueue(maxComparator);
        })

        describe('#enqueue', function() {
            beforeEach(function() {
                loadQueue(priorityQueue, array.populated);
            });

            it('should insert the element into the priority queue', function() {
                priorityQueue.enqueue(uniqueValue);
                assert(queueToArray(priorityQueue).includes(uniqueValue));
            });

            it('size should increase by 1', function() {
                const previousSize = priorityQueue.size;
                priorityQueue.enqueue(uniqueValue);
                assert.equal(priorityQueue.size, previousSize + 1);
            });

            it('should throw a TypeError if input data is null', function() {
                const expectedError = new TypeError('Cannot enqueue nullish data into priority queue');
                assert.throws(priorityQueue.enqueue.bind(priorityQueue, null), expectedError);
            });

            it('should throw a TypeError if input data is undefined', function() {
                const expectedError = new TypeError('Cannot enqueue nullish data into priority queue');
                assert.throws(priorityQueue.enqueue.bind(priorityQueue, undefined), expectedError);
            });
        });
    
        describe('#dequeue', function() {
            context('priority queue is empty', function() {
                it('should throw an EmptyQueueError', function() {
                    const expectedError = new EmptyQueueError();
                    assert.throws(priorityQueue.dequeue.bind(priorityQueue), expectedError);
                });
            });

            context('priority queue is not empty', function() {
                beforeEach(function() {
                    loadQueue(priorityQueue, array.populated);
                });

                it('should remove the element with the most priority', function() {
                    const highestPriorityElement = array.populated.sort(maxComparator)[0];
                    priorityQueue.dequeue();
                    assert(!queueToArray(priorityQueue).includes(highestPriorityElement));
                });

                it('should return the element with the most priority', function() {
                    const highestPriorityElement = array.populated.sort(maxComparator)[0];
                    const actual = priorityQueue.dequeue();
                    assert.equal(actual, highestPriorityElement);
                });

                it('size should decrease by 1', function() {
                    const previousSize = priorityQueue.size;
                    priorityQueue.dequeue();
                    assert.equal(priorityQueue.size, previousSize - 1);
                });
            });
        });
    });

    // Test different inputs (int, string, obj, etc)
    context.skip('comparator', function() {

    });
});