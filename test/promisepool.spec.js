import assert from 'node:assert/strict';
import PromisePool from '../lib/promisepool.js';
import PromisePoolError from '../lib/error/promisepoolerror.js';

/**
 * Helper object containing a short list of types to use when testing validation
 */
const types = Object.entries({
    string: 'test',
    number: 1,
    bigint: 1n,
    boolean: true,
    symbol: Symbol(),
    null: null,
    undefined: undefined,
    object: {},
    array: [],
    function: () => {}
});

describe('PromisePool', function() {
    describe('init', function() {
        const tasks = [1, 2, 3, 4, 5];
        const concurrency = 1;
        const priority = true;
        const comparator = (a, b) => a - b;
        
        context('tasks property', function() {
            it('tasks should have a default value when undefined', function() {
                const pool = new PromisePool();
                assert.notEqual(pool.tasks, undefined);
            });

            it('tasks should be able to be set from the constructor', function() {
                const pool = new PromisePool(tasks);
                assert.deepEqual(pool.tasks, tasks);
            });

            it('tasks should be able to be set using a property accessor', function() {
                const pool = new PromisePool();
                pool.tasks = tasks;
                assert.deepEqual(pool.tasks, tasks);
            });

            it('tasks should be able to be set from an instance method', function() {
                const pool = new PromisePool();
                pool.withTasks(tasks);
                assert.deepEqual(pool.tasks, tasks);
            });

            it('tasks should be able to be set from a static method', function() {
                const pool = PromisePool.withTasks(tasks);
                assert.deepEqual(pool.tasks, tasks);
            });

            const tasksInvalidTypeTests = {
                inputs: types.filter(([key, _]) => key !== 'array'),
                expected: new PromisePoolError('Tasks must be an Array')
            };
            tasksInvalidTypeTests.inputs.forEach(([key, value]) => {
                it(`tasks should throw a PromisePoolError when input is ${key}`, function() {
                    assert.throws(() => {
                        (new PromisePool()).tasks = value;
                    }, tasksInvalidTypeTests.expected);
                });
            });
        });

        context('concurrency property', function() {
            it('concurrency should have a default value when undefined', function() {
                const pool = new PromisePool();
                assert.notEqual(pool.concurrency, undefined);
            });

            it('concurrency should be able to be set from the constructor', function() {
                const options = { concurrency };
                const pool = new PromisePool(undefined, options);
                assert.equal(pool.concurrency, concurrency);
            });

            it('concurrency should be able to be set using a property accessor', function() {
                const pool = new PromisePool();
                pool.concurrency = concurrency;
                assert.equal(pool.concurrency, concurrency);
            });

            it('concurrency should be able to be set from an instance method', function() {
                const pool = new PromisePool();
                pool.withConcurrency(concurrency);
                assert.equal(pool.concurrency, concurrency);
            });

            it('concurrency should be able to be set from a static method', function() {
                const pool = PromisePool.withConcurrency(concurrency);
                assert.equal(pool.concurrency, concurrency);
            });

            const concurrencyInvalidRangeTests = {
                inputs: [0, -1, -2],
                expected: new PromisePoolError('Concurrency limit must be greater than 0')
            };
            concurrencyInvalidRangeTests.inputs.forEach(input => {
                it(`concurrency should throw a PromisePoolError when input is ${input}`, function() {
                    assert.throws(() => {
                        (new PromisePool()).concurrency = input;
                    }, concurrencyInvalidRangeTests.expected);
                });
            });

            const concurrencyInvalidTypeTests = {
                inputs: types.filter(([key, _]) => key !== 'number'),
                expected: new PromisePoolError('Concurrency must be a Number')
            };
            concurrencyInvalidTypeTests.inputs.forEach(([key, value]) => {
                it(`concurrency should throw a PromisePoolError when input is ${key}`, function() {
                    assert.throws(() => {
                        (new PromisePool()).concurrency = value;
                    }, concurrencyInvalidTypeTests.expected);
                });
            });
        });

        context('priority property', function() {
            it('priority should have a default value when undefined', function() {
                const pool = new PromisePool();
                assert.notEqual(pool.priority, undefined);
            });

            it('priority should be able to be set from the constructor', function() {
                const options = { priority };
                const pool = new PromisePool(undefined, options);
                assert.equal(pool.priority, priority);
            });

            it('priority should be able to be set using a property accessor', function() {
                const pool = new PromisePool();
                pool.priority = priority;
                assert.equal(pool.priority, priority);
            });

            it('priority should be able to be set from an instance method', function() {
                const pool = new PromisePool();
                pool.withPriority();
                assert.equal(pool.priority, priority);
            });

            it('priority should be able to be set from a static method', function() {
                const pool = PromisePool.withPriority();
                assert.equal(pool.priority, priority);
            });

            const priorityInvalidTypeTests = {
                inputs: types.filter(([key, _]) => key !== 'boolean'),
                expected: new PromisePoolError('Priority must be a Boolean')
            };
            priorityInvalidTypeTests.inputs.forEach(([key, value]) => {
                it(`priority should throw a PromisePoolError when input is ${key}`, function() {
                    assert.throws(() => {
                        (new PromisePool()).priority = value;
                    }, priorityInvalidTypeTests.expected);
                });
            });
        });

        context('comparator property', function() {
            it('comparator should have a default value when undefined', function() {
                const pool = new PromisePool();
                assert.notEqual(pool.comparator, undefined);
            });

            it('comparator should be able to be set from the constructor', function() {
                const options = { comparator };
                const pool = new PromisePool(undefined, options);
                assert.deepEqual(pool.comparator, comparator);
            });

            it('comparator should be able to be set using a property accessor', function() {
                const pool = new PromisePool();
                pool.comparator = comparator;
                assert.deepEqual(pool.comparator, comparator);
            });

            it('comparator should be able to be set from an instance method', function() {
                const pool = new PromisePool();
                pool.withComparator(comparator);
                assert.deepEqual(pool.comparator, comparator);
            });

            it('comparator should be able to be set from a static method', function() {
                const pool = PromisePool.withComparator(comparator);
                assert.deepEqual(pool.comparator, comparator);
            });

            const comparatorInvalidTypeTests = {
                inputs: types.filter(([key, _]) => key !== 'function'),
                expected: new PromisePoolError('Comparator must be a Function')
            };
            comparatorInvalidTypeTests.inputs.forEach(([key, value]) => {
                it(`comparator should throw a PromisePoolError when input is ${key}`, function() {
                    assert.throws(() => {
                        (new PromisePool()).comparator = value;
                    }, comparatorInvalidTypeTests.expected);
                });
            });
        });

        it('instance methods should be chainable', function() {
            const pool = new PromisePool();
            let error;
            try {
                pool.withTasks(tasks)
                    .withComparator(comparator)
                    .withPriority()
                    .withConcurrency(concurrency);
            } catch(e) {
                error = e;
            }
            assert.equal(error, undefined);
        });

        it('static methods should be chainable', function() {
            let error;
            try {
                PromisePool.withConcurrency(concurrency)
                    .withPriority()
                    .withComparator(comparator)
                    .withTasks(tasks);
            } catch(e) {
                error = e;
            }
            assert.equal(error, undefined);
        });
    });

    // will require executor mock
    // implement after executor is fixed
    describe.skip('#start', function() {

    });
});