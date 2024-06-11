import assert from 'node:assert/strict';
import util from 'node:util';
import PoolExecutor from '../lib/poolexecutor.js';
import Queue from '../lib/queue/queue.js';
import PriorityQueue from '../lib/queue/priorityqueue.js';
import { array } from './helpers.js';

/**
 * Helper object that contains all of the task statuses needed for unit testing.
 */
const status = {
    fulfilled: 'fulfilled',
    rejected: 'rejected'
};

/**
 * Helper method that creates a task object from any input
 * Note: Task should be `Function`, but it is `any` to allow
 * for use in negative tests.
 * 
 * @param {any} task
 * @param {Number} priority 
 * @returns {Object} - a task object
 */
const createTaskObject = (task, priority=0) => {
    return { task, priority };
};

/**
 * Helper method that creates a task result object. 
 * 
 * @param {String} message - reason or value
 * @param {Boolean} error - flag to determine if status should be fulfilled or rejected
 * @returns {Object} - task result
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
 * Helper method that populates an array with the same element n times.
 * Note: Similar to [element] * length in Python.
 * 
 * @param {Number} num - number of tasks to insert
 * @param {Function} task - type of task to insert
 */
const createArrayFromOneElement = (count, element) => Array.from({ length: count }, () => element);

const concurrency = 2;
const taskCount = 5;

describe('PoolExecutor', function() {
    describe('#start', function() {
        // Takes in a singular input and expected output, copies them count times, and then executes the collection


        // Needs to be cleaned up, is this even still needed?
        const execute = async ({ input, output }, count) => {
            const array = Array.isArray(input) ? input : createArrayFromOneElement(count, input);
            const queue = Queue.fromArray(array);
            const executor = new PoolExecutor(queue, concurrency);
            const result = await executor.start();
            const expected = Array.isArray(output) ? output : createArrayFromOneElement(count, output);
            return { result, expected };
        };
        
        // Should never reject
        context('pool promise', function() {
            it('should resolve to an empty array if the task queue is empty', async function() {
                const input = array.empty;
                const output = array.empty;
                const { result, expected } = await execute({ input, output }, taskCount);
                assert.deepEqual(result, expected);
            });

            // Asserts that all queues are treated the same by the executor
            it ('should resolve when given a priority queue instead of a FIFO queue', async function() {
                const minTaskComparator = (a, b) => a.priority - b.priority;
                const task = createTaskObject(() => 'task', Math.floor(Math.random() * 100));
                const tasks = createArrayFromOneElement(taskCount, task);
                const queue = PriorityQueue.fromArray(tasks, minTaskComparator);
                const executor = new PoolExecutor(queue, concurrency);
                assert.doesNotReject(executor.start.bind(executor));
            });

            // Asserts that an EmptyQueueError won't be thrown
            it('should resolve if concurrency limit is greater than the number of tasks', async function() {
                const task = createTaskObject(() => 'task');
                const queue = Queue.fromArray([task]);
                const executor = new PoolExecutor(queue, concurrency);
                assert.doesNotReject(executor.start.bind(executor));
            });

            it('should resolve when all tasks are finished executing', async function() {
                const value = 'resolved';
                const input = createTaskObject(() => Promise.resolve(value));
                const output = createTaskResult(value);
                const { result } = await execute({ input, output }, taskCount);
                assert.equal(result.length, taskCount);
            });

            // Is this redundant given task promise context?
            it('should resolve given both successful and unsuccessful tasks');
        });

        context('task promise', function() {
            it('should resolve given a task object with a task property that resolves', async function() {
                const value = 'resolved';
                const input = createTaskObject(() => new Promise((resolve) => resolve(value)));
                const output = createTaskResult(value);
                const { result, expected } = await execute({ input, output }, 1);
                assert.deepEqual(result, expected);
            });

            it('should resolve given a task object with a task property that\'s synchronous', async function() {
                const value = 'synchronous';
                const input = createTaskObject(() => value);
                const output = createTaskResult(value);
                const { result, expected } = await execute({ input, output }, 1);
                assert.deepEqual(result, expected);
            });

            // Is this what I want? Should it resolve instead?
            // Pros: encourages wrapped functions
            // Cons: doesn't follow promise.allSettled spec
            it('should resolve given a task object with a task property that isn\'t a function', async function() {
                const value = 'value';
                const input = createTaskObject(value);
                const output = createTaskResult(value);
                const { result, expected } = await execute({ input, output }, 1);
                assert.deepEqual(result, expected);
            });
    
            it('should reject given a task object with a task property that rejects', async function() {
                const reason = 'rejected';
                const input = createTaskObject(() => new Promise((_, reject) => reject(reason)));
                const output = createTaskResult(reason, true);
                const { result, expected } = await execute({ input, output }, 1);
                assert.deepEqual(result, expected);
            });

            it('should reject given a task object with a task property that asynchronously errors', async function() {
                const reason = new Error('error');
                const input = createTaskObject(() => new Promise(() => { throw reason }));
                const output = createTaskResult(reason, true);
                const { result, expected } = await execute({ input, output }, 1);
                assert.deepEqual(result, expected);
            });

            // Will not work right now, as synchronous errors are not handled
            it.skip('should reject given a task object with a task property that synchronously errors', async function() {
                const reason = 'error';
                const input = createTaskObject(() => { throw new Error(reason); });
                const output = createTaskResult(reason, true);
                const { result, expected } = await execute({ input, output }, 1);
                assert.deepEqual(result, expected);
            });

            it('should reject given a task object without a task property', async function() {
                const input = { notATask: null, tesk: undefined, priority: 72 };
                const reason = `Cannot find task property in ${util.inspect(input)}`;
                const output = createTaskResult(reason, true);
                const { result, expected } = await execute({ input, output }, 1);
                assert.deepEqual(result, expected);
            });


            // Check against types using forEach?
            it('should reject given a null task object', async function() {
                const input = null;
                const reason = `Cannot find task property in ${util.inspect(input)}`;
                const output = createTaskResult(reason, true);
                const { result, expected } = await execute({ input, output }, 1);
                assert.deepEqual(result, expected);
            });

            it('should reject given an undefined task object', async function() {
                const input = undefined;
                const reason = `Cannot find task property in ${util.inspect(input)}`;
                const output = createTaskResult(reason, true);
                const { result, expected } = await execute({ input, output }, 1);
                assert.deepEqual(result, expected);
            });
        });
    });
});