import assert from 'node:assert/strict';
import PriorityQueue from '../../lib/queue/priorityqueue.js';
import EmptyQueueError from '../../lib/error/emptyqueueerror.js';

const maxNumberComparator = (a, b) => b - a;

describe('PriorityQueue', function() {
    context('creation', function() {
        describe('#fromArray', function() {
            it('should return an instance of PriorityQueue', function() {
                const array = [];
                const queue = PriorityQueue.fromArray(array, maxNumberComparator);
                assert(queue instanceof PriorityQueue);
            });

            it('size should be equal to the size of the input array', function() {
                const array = [1, 2, 3, 4, 5];
                const queue = PriorityQueue.fromArray(array, maxNumberComparator);
                assert.equal(queue.size, array.length);
            });

            it('should return an empty priority queue if input array is empty', function() {
                const array = [];
                const queue = PriorityQueue.fromArray(array, maxNumberComparator);
                assert.equal(queue.size, array.length);
            });

            it('should not mutate the original array', function() {
                const array = [1, 2, 3, 4, 5];
                const arrayClone = [...array];
                PriorityQueue.fromArray(array, maxNumberComparator);
                assert.deepEqual(array, arrayClone);
            });
        });
    });

    context('operation', function() {
        // Helper method for operation context
        const createPriorityQueue = (size, comparator=maxNumberComparator) => {
            const array = Array.from({ length: size }, (_, i) => i);
            return PriorityQueue.fromArray(array, comparator);
        };

        describe('#enqueue', function() {
            const testInsertion = (size) => {
                return function() {
                    const queue = createPriorityQueue(size);
                    // unique to ensure validity of test
                    const valueToInsert = -1;
                    queue.enqueue(valueToInsert);
                    assert(([...queue]).includes(valueToInsert));
                };
            };

            const testSizeIncrement = (size) => {
                return function() {
                    const queue = createPriorityQueue(size);
                    queue.enqueue(-1);
                    assert.equal(queue.size, size + 1);
                };
            };

            const sizesToTest = [0, 1, 2, 250000];

            for (const size of sizesToTest) {
                it(`should insert an element when initial size is ${size}`, testInsertion(size));
                it(`size should increase to ${size + 1} when initial size is ${size}`, testSizeIncrement(size));
            }
        });

        describe('#dequeue', function() {
            context('priority queue is empty', function() {
                it('should throw an EmptyQueueError', function() {
                    const queue = new PriorityQueue(maxNumberComparator);
                    const expectedError = new EmptyQueueError();
                    assert.throws(queue.dequeue.bind(queue), expectedError);
                });
            });

            context('priority queue is not empty', function() {
                const testRemoval = (size) => {
                    return function() {
                        const queue = createPriorityQueue(size);
                        const highestPriorityElement = [...queue][0];
                        queue.dequeue();
                        assert(!([...queue]).includes(highestPriorityElement));
                    };
                };

                const testReturnValue = (size) => {
                    return function() {
                        const queue = createPriorityQueue(size);
                        const highestPriorityElement = [...queue][0];
                        const data = queue.dequeue();
                        assert.equal(data, highestPriorityElement);
                    };
                };

                const testSizeDecrement = (size) => {
                    return function() {
                        const queue = createPriorityQueue(size);
                        queue.dequeue();
                        assert.equal(queue.size, size - 1);
                    };
                };

                const sizesToTest = [1, 2, 250000];

                for (const size of sizesToTest) {
                    it(`should remove the element with the most priority when the initial size is ${size}`, testRemoval(size));
                    it(`should return the element with the most priority when the initial size is ${size}`, testReturnValue(size));
                    it(`size should decrease to ${size - 1} when initial size is ${size}`, testSizeDecrement(size));
                }
            });
        });
    });

    context('comparator', function() {
        it('should order correctly given a number comparator', function() {
            const numbers = [1, 2, 3, 4, 5];
            const numberComparator = maxNumberComparator;
            const queue = PriorityQueue.fromArray(numbers, numberComparator);
            const expected = numbers.sort(numberComparator);
            assert.deepEqual([...queue], expected);
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
            const queue = PriorityQueue.fromArray(strings, fourthLetterComparator);
            const expected = strings.sort(fourthLetterComparator);
            assert.deepEqual([...queue], expected);
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
            const queue = PriorityQueue.fromArray(objects, objectComparator);
            const expected = objects.sort(objectComparator);
            assert.deepEqual([...queue], expected);
        });
 
        it('should order correctly given a comparator that accounts for nulls', function() {
            const objects = [
                {
                    priority: 500,
                    task: () => {}
                },
                null,
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
            // Moves nullish data to the back
            const objectComparator = (a, b) => {
                if (!b) return -1;
                if (!a) return 1;
                return a.priority - b.priority;
            };
            const queue = PriorityQueue.fromArray(objects, objectComparator);
            const expected = objects.sort(objectComparator);
            assert.deepEqual([...queue], expected);
        });

        // split into two asserts because Array.sort ignores undefined
        it('should order correctly given a comparator that accounts for sparse input', function() {
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
                undefined,
                {
                    priority: 250,
                    task: () => {}
                }
            ];
            // Moved nullish data to the front
            const objectComparator = (a, b) => {
                if (!b) return 1;
                if (!a) return -1;
                return a.priority - b.priority;
            };
            const queue = PriorityQueue.fromArray(objects, objectComparator);
            const expected = objects.filter(o => o !== undefined)
                .sort(objectComparator);
            assert.equal([...queue][0], undefined);
            assert.deepEqual([...queue].slice(1), expected);
        });
    });
});