import assert from 'node:assert/strict';
import util from 'node:util';
import PoolExecutor from '../lib/poolexecutor.js';
import Queue from '../lib/queue/queue.js';
import PriorityQueue from '../lib/queue/priorityqueue.js';
import EmptyQueueError from '../lib/error/emptyqueueerror.js';

/**
 * Helper object that contains all of the task statuses needed for unit testing.
 */
const status = {
    fulfilled: 'fulfilled',
    rejected: 'rejected'
};

/**
 * Concurrency limit used throughout this test suite.
 */
const concurrency = 2;

/**
 * Helper method that creates a task object from any input
 * Note: Task should be `Function`, but it is `any` to allow
 * for use in negative tests.
 * 
 * @param {any} task
 * @param {Number} priority 
 * @returns {Object} a task object
 */
const createTaskObject = (task, priority=0) => {
    return { task, priority };
};

/**
 * Helper method that creates a task result object. 
 * 
 * @param {String} message reason or value
 * @param {Boolean} error flag to determine if status should be fulfilled or rejected
 * @returns {PromiseSettledResult} task result
 */
const createTaskResult = (message, error=false) => {
    let result;
    if (error) {
        result = {
            status: status.rejected,
            reason: message
        };
    } else {
        result = {
            status: status.fulfilled,
            value: message
        };
    }
    return result;
}

/**
 * Executes an array of tasks using PoolExecutor. 
 * If priority flag is true, a comparator must be provided.
 * 
 * @param {Array} array task array
 * @param {Boolean} priority flag to determine what type of queue to use
 * @param {Function} comparator ordering function to be used if priority is true
 * @returns {Promise<Object[]>} task results
 */
const execute = async (array, priority=false, comparator=undefined) => {
    const queue = (priority) ? PriorityQueue.fromArray(array, comparator) : Queue.fromArray(array);
    const executor = new PoolExecutor(queue, concurrency);
    return await executor.start();
};

describe('PoolExecutor', function() {
    describe('#start', function() {   
        // Should never reject
        context('pool promise', function() {
            it('should resolve to an empty array if the task queue is empty', async function() {
                const tasks = [];
                const result = await execute(tasks)
                assert.deepEqual(result, tasks);
            });

            it('should not reject with an EmptyQueueError when concurrency limit is greater than the number of tasks', async function() {
                // concurrency = 2
                const tasks = [createTaskObject(() => 'task')];
                // doesNotReject needs to be awaited otherwise the test will end before the test promise can settle
                // Note: If an error of any other type occurs, this test will fail with the error thrown, not an assertion error
                await assert.doesNotReject(execute.bind(null, tasks), EmptyQueueError);
            });

            it('should resolve when all tasks are finished executing', async function() {
                const count = 5;
                const tasks = Array.from({ length: count }, () => {
                    return createTaskObject(() => Promise.resolve());
                });
                const result = await execute(tasks);
                assert.equal(result.length, count);
            });
        });

        context('task promise', function() {
            it('should resolve given a task object with a task property that resolves', async function() {
                const value = 'resolved';
                const task = createTaskObject(() => Promise.resolve(value));
                const [ result ] = await execute([task]);
                const expected = createTaskResult(value);
                assert.deepEqual(result, expected);
            });

            it('should resolve given a task object with a task property that\'s synchronous', async function() {
                const value = 'synchronous';
                const task = createTaskObject(() => value);
                const [ result ] = await execute([task]);
                const expected = createTaskResult(value);
                assert.deepEqual(result, expected);
            });

            it('should resolve given a task object with a task property that isn\'t a function', async function() {
                const value = 'value';
                const task = createTaskObject(value);
                const [ result ] = await execute([task]);
                const expected = createTaskResult(value);
                assert.deepEqual(result, expected);
            });
    
            it('should reject given a task object with a task property that rejects', async function() {
                const reason = 'rejected';
                const task = createTaskObject(() => Promise.reject(reason));
                const [ result ] = await execute([task]);
                const expected = createTaskResult(reason, true);
                assert.deepEqual(result, expected);
            });

            it('should reject given a task object with a task property that asynchronously errors', async function() {
                const reason = new Error('error');
                const task = createTaskObject(() => new Promise(() => { throw reason; }));
                const [ result ] = await execute([task]);
                const expected = createTaskResult(reason, true);
                assert.deepEqual(result, expected);
            });

            it('should reject given a task object with a task property that synchronously errors', async function() {
                const reason = new Error('error');
                const task = createTaskObject(() => { throw reason; });
                const [ result ] = await execute([task]);
                const expected = createTaskResult(reason, true);
                assert.deepEqual(result, expected);
            });

            it('should reject given a task object without a task property', async function() {
                const invalidTaskObject = { notATask: null, tesk: undefined, priority: 72 };
                const reason = `Cannot find task property in ${util.inspect(invalidTaskObject)}`;
                const [ result ] = await execute([invalidTaskObject]);
                const expected = createTaskResult(reason, true);
                assert.deepEqual(result, expected);
            });

            // Test against all types?
            it('should reject given a null task object', async function() {
                const nullTaskObject = null;
                const reason = `Cannot find task property in ${util.inspect(nullTaskObject)}`;
                const [ result ] = await execute([nullTaskObject]);
                const expected = createTaskResult(reason, true);
                assert.deepEqual(result, expected);
            });

            it('should reject given an undefined task object', async function() {
                const undefinedTaskObject = undefined;
                const reason = `Cannot find task property in ${util.inspect(undefinedTaskObject)}`;
                const [ result ] = await execute([undefinedTaskObject]);
                const expected = createTaskResult(reason, true);
                assert.deepEqual(result, expected);
            });
        });
    });
});