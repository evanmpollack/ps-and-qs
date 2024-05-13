import assert from 'node:assert/strict';
import PoolExecutor from '../lib/poolexecutor.js';
import Queue from '../lib/queue/queue.js';
import PriorityQueue from '../lib/queue/priorityqueue.js';
import { array } from './helpers.js';

/**
 * Test cases copied from original promise pool tests:
 * - Start promise
 *  - should resolve given tasks that resolve
 *  - should resolve given tasks that reject
 *  - should resolve given tasks that error
 *  - should resolve given tasks that are sync
 *  - should resolve given tasks that aren't functions
 *  - should resolve given no tasks
 *  - result array length should equal input array length
 *  - reject not possible at this time
 */

/**
 * Helper object consisting of all the possible task inputs and expected outputs needed for unit testing
 */
const task = {
    resolves: {
        input: () => new Promise((resolve) => resolve('resolved')),
        output: {
            status: 'fulfilled',
            value: 'resolved'
        }
    },
    rejects: {
        input: () => new Promise((_, reject) => reject('rejected')),
        output: {
            status: 'rejected',
            reason: 'rejected'
        }
    },
    error: {
        input: () => new Promise(() => { throw new Error('error') }),
        output: {
            status: 'rejected',
            reason: new Error('error')
        }
    },
    synchronous: {
        input: () => 'result',
        output: {
            status: 'fulfilled',
            value: 'result'
        }
    },
    notFunction: {
        input: 'value',
        output: {
            status: 'rejected',
            reason: new TypeError('undefined is not a function')
        }
    }
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

const concurrency = 2;
const taskCount = 5;

describe.only('PoolExecutor', function() {
    describe('#start', function() {
        it('should return an empty array if the task queue is empty', async function() {
            const executor = new PoolExecutor(Queue.fromArray(array.empty), concurrency);
            const result = await executor.start();
            assert.deepEqual(result, array.empty);
        });

        it('should return an array of results given tasks that resolve', async function() {
            const executor = new PoolExecutor(Queue.fromArray(load(taskCount, task.resolves.input)), concurrency);
            const result = await executor.start();
            const expected = Array.from({ length: taskCount }, () => task.resolves.output);
            assert.deepEqual(result, expected);
        });

        it('should return an array of results given tasks that reject', async function() {
            const executor = new PoolExecutor(Queue.fromArray(load(taskCount, task.rejects.input)), concurrency);
            const result = await executor.start();
            const expected = Array.from({ length: taskCount }, () => task.rejects.output);
            assert.deepEqual(result, expected);
        });

        it('should return an array of results given tasks that error', async function() {
            const executor = new PoolExecutor(Queue.fromArray(load(taskCount, task.error.input)), concurrency);
            const result = await executor.start();
            const expected = Array.from({ length: taskCount }, () => task.error.output);
            assert.deepEqual(result, expected);
        });

        it('should return an array of results given tasks that are synchronous', async function() {
            const executor = new PoolExecutor(Queue.fromArray(load(taskCount, task.synchronous.input)), concurrency);
            const result = await executor.start();
            const expected = Array.from({ length: taskCount }, () => task.synchronous.output);
            assert.deepEqual(result, expected);
        });

        it('should return an array of results given tasks that aren\'t functions', async function() {
            const executor = new PoolExecutor(Queue.fromArray(load(taskCount, task.notFunction.input)), concurrency);
            const result = await executor.start();
            const expected = Array.from({ length: taskCount }, () => task.notFunction.output);
            assert.deepEqual(result, expected);
        });

        // -----

        it('result array should be the same length as the input task queue', async function() {
            const queue = Queue.fromArray(load(taskCount, task.resolves));
            const executor = new PoolExecutor(queue, concurrency);
            const length = (await executor.start()).length;
            assert.equal(length, queue.size);
        });

        // -----

        // ensures both queue types have the same interface
        it('should not reject when given a priority queue', async function() {
            const comparator = (a, b) => b.priority - a.priority;
            const executor = new PoolExecutor(PriorityQueue.fromArray(load(taskCount, task.resolves)), comparator);
            assert.doesNotReject(executor.start.bind(executor));
        });

        it('should not reject if concurrency greater than the number of tasks', async function() {
            const executor = new PoolExecutor(Queue.fromArray([task.resolves.input]), concurrency);
            assert.doesNotReject(executor.start.bind(executor));
        });
    });
});