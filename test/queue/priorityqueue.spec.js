import assert from 'node:assert/strict';
import PriorityQueue from '../../lib/queue/priorityqueue.js';
import EmptyQueueError from '../../lib/error/emptyqueueerror.js';
import { array, queueToArray, loadQueue } from '../helpers.js';

const maxNumberComparator = (a, b) => b - a;

describe.only('PriorityQueue', function() {
    context('creation', function() {
        describe('#fromArray', function() {
            it('should return an instance of PriorityQueue', function() {
                assert(PriorityQueue.fromArray(array.populated, maxNumberComparator) instanceof PriorityQueue);
            });

            // Move to comparator context
            it('should use the ordering defined by the given comparator', function() {
                const pq = PriorityQueue.fromArray(array.populated, maxNumberComparator);
                assert.deepEqual(queueToArray(pq), array.populated.sort(maxNumberComparator));
            });

            it('size should be equal to the size of the input array', function() {
                assert.equal(PriorityQueue.fromArray(array.populated, maxNumberComparator).size, array.populated.length);
            });

            it('should return an empty priority queue if input array is empty', function() {
                assert.equal(PriorityQueue.fromArray(array.empty).size, array.empty.length);
            });

            it('should not mutate the original array', function() {
                const originalArray = array.populated;
                PriorityQueue.fromArray(originalArray, maxNumberComparator)
                assert.deepEqual(originalArray, array.populated);
            });

            // Skipped for now, implement when open sourcing for future developers
            it.skip('should throw a TypeError if input array is not an Array', function() {
                const expectedError = new TypeError('Array must be an Array');
                assert.throws(PriorityQueue.fromArray.bind(null, array.invalid, maxNumberComparator), expectedError);
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
            priorityQueue = new PriorityQueue(maxNumberComparator);
        })

        // Parameterize
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

            // Parameterize
            context('priority queue is not empty', function() {
                beforeEach(function() {
                    loadQueue(priorityQueue, array.populated);
                });

                it('should remove the element with the most priority', function() {
                    const highestPriorityElement = array.populated.sort(maxNumberComparator)[0];
                    priorityQueue.dequeue();
                    assert(!queueToArray(priorityQueue).includes(highestPriorityElement));
                });

                it('should return the element with the most priority', function() {
                    const highestPriorityElement = array.populated.sort(maxNumberComparator)[0];
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

    context('comparator', function() {
        // how to combine with version in fromArray
        it('should order correctly given a number comparator');
        it('should order correctly given a string comparator', function() {
            const words = [
                'cheese',
                'two',
                'fifteen',
                'abba',
                'sucker'
            ];
            const fourthLetterComparator = (s1, s2) => {
                const charCode1 = s1.charCodeAt(3);
                const charCode2 = s2.charCodeAt(3);
                if (isNaN(charCode1) && !isNaN(charCode2)) {
                    return 1;
                } else if (!isNaN(charCode1) && isNaN(charCode2)) {
                    return -1;
                } else {
                    return charCode1 - charCode2;
                }
            }
            const pq = PriorityQueue.fromArray(words, fourthLetterComparator);
            const expected = Array.from(words).sort(fourthLetterComparator);
            assert.deepEqual(queueToArray(pq), expected);
        });
        it('should order correctly given an object comparator');
    });
});