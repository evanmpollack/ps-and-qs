import assert from 'node:assert/strict';
import PriorityQueue from '../../lib/queue/priorityqueue.js';
import EmptyQueueError from '../../lib/error/emptyqueueerror.js';
import { array, queueToArray, loadQueue } from '../helpers.js';

const maxNumberComparator = (a, b) => b - a;

describe('PriorityQueue', function() {
    context('creation', function() {
        describe('#fromArray', function() {
            it('should return an instance of PriorityQueue', function() {
                assert(PriorityQueue.fromArray(array.populated, maxNumberComparator) instanceof PriorityQueue);
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
        it('should order correctly given a number comparator', function() {
            const numbers = array.populated;
            const numberComparator = maxNumberComparator;
            const pq = PriorityQueue.fromArray(numbers, numberComparator);
            const expected = numbers.sort(numberComparator);
            assert.deepEqual(queueToArray(pq), expected);
        });

        it('should order correctly given a string comparator', function() {
            const strings = [
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
            const pq = PriorityQueue.fromArray(strings, fourthLetterComparator);
            const expected = strings.sort(fourthLetterComparator);
            assert.deepEqual(queueToArray(pq), expected);
        });

        it('should order correctly given an object comparator', function() {
            const objects = [
                {
                    priority: 500,
                    task: () => {}
                },
                {
                    priority: -2,
                    task: () => {}
                },
                {
                    priority: 10,
                    task: () => {}
                },
                {
                    priority: 20,
                    task: () => {}
                },
                {
                    priority: 250,
                    task: () => {}
                }
            ];
            const objectComparator = (a, b) => a.priority - b.priority;
            const pq = PriorityQueue.fromArray(objects, objectComparator);
            const expected = objects.sort(objectComparator);
            assert.deepEqual(queueToArray(pq), expected);
        });
    });
});