import assert from 'node:assert/strict';
import PromisePool from '../../lib/pool/promisepool.js';

/**
 * Helper object consisting of all the possible task inputs needed for unit testing
 */
const task = {
    resolves: () => new Promise((resolve) => resolve('resolved')),
    rejects: () => new Promise((_, reject) => reject('rejected')),
    error: () => new Promise(() => { throw new Error('error') }),
    synchronous: () => 'result',
    notFunction: 'value'
};

/**
 * Helper method that creates an array of tasks
 * @param {Number} num - number of tasks to insert
 * @param {Function} task - type of task to insert
 */
const load = (num, task) => {
    const tasks = [];
    for (let i = 0; i < num; i++) {
        tasks.push(task);
    }
    return tasks;
}

describe('PromisePool', function() {
    describe('init', function() {
        it('should throw an error if promise suppliers array is undefined', function() {
            const expectedMessage = 'An array of promise suppliers is required';
            assert.throws(() => new PromisePool(undefined), {
                message: expectedMessage
            });
        });

        it('should throw an error if promise suppliers is not an array', function() {
            const expectedMessage = 'An array of promise suppliers is required';
            assert.throws(() => new PromisePool(1), {
                message: expectedMessage
            });
        })

        it('should throw an error if limit option <= 0', function() {
            const expectedMessage = 'Concurrency limit must be greater than 0';
            const limit = -1;
            assert.throws(() => new PromisePool([task.resolves], { 
                concurrencyLimit: limit 
            }), {
                message: expectedMessage
            });
        });

        it('should not throw an error if options is undefined', function() {
            assert.doesNotThrow(() => new PromisePool([task.resolves], undefined));
        });

        it('should not throw an error if promise suppliers array is empty', function() {
            assert.doesNotThrow(() => new PromisePool([]));
        });
    });
    
    describe('#start', function() {
        context('pool promise', function() {
            const numTasks = 3;
            
            context('resolved', function() {
                it('should resolve given tasks that resolve', async function() {
                    const tasks = load(numTasks, task.resolves);
                    const pool = new PromisePool(tasks);
                    await assert.doesNotReject(pool.start);
                });

                it('should resolve given tasks that reject', async function() {
                    const tasks = load(numTasks, task.rejects);
                    const pool = new PromisePool(tasks);
                    await assert.doesNotReject(pool.start);
                });

                it('should resolve given tasks that error', async function() {
                    const tasks = load(numTasks, task.error);
                    const pool = new PromisePool(tasks);
                    await assert.doesNotReject(pool.start);
                });

                it('should resolve given tasks that are synchronous', async function() {
                    const tasks = load(numTasks, task.synchronous);
                    const pool = new PromisePool(tasks);
                    await assert.doesNotReject(pool.start);
                });

                it('should resolve given tasks that aren\'t functions', async function() {
                    const tasks = load(numTasks, task.notFunction);
                    const pool = new PromisePool(tasks);
                    await assert.doesNotReject(pool.start);
                });

                it('result array should be the same length as the input array', async function() {
                    const tasks = load(numTasks, task.resolves);
                    const pool = new PromisePool(tasks);
                    const results = await pool.start();
                    assert.equal(results.length, numTasks);
                });
            });

            context.skip('rejected', function() {
                // Not possible at the moment
            });
        });

        context('task promise', function() {
            const numTasks = 1;
            let results;

            context('resolved', function() {
                beforeEach(async function() {
                    const tasks = load(numTasks, task.resolves);
                    const pool = new PromisePool(tasks);
                    results = await pool.start();
                });

                it('result should have a \'status\' property equal to \'fulfilled\'', function() {
                    assert.equal(results[0].status, 'fulfilled');
                });

                it('result should have a \'value\' property equal to the resolved value', async function() {
                    assert.equal(results[0].value, await task.resolves());
                });
            });

            context('rejected', function() {
                beforeEach(async function() {
                    const tasks = load(numTasks, task.rejects);
                    const pool = new PromisePool(tasks);
                    results = await pool.start();
                });
                
                it('results should have a \'status\' property equal to \'rejected\'', function() {
                    assert.equal(results[0].status, 'rejected');
                });
                
                it('result should have a \'reason\' property equal to the rejected value', async function() {
                    assert.equal(results[0].reason, await task.rejects());
                });
            });
        });
    });
});