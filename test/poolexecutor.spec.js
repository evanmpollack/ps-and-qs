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
 * Helper object consisting of all the possible task results needed for unit testing
 */
const taskResult = {
    resolved: {
        status: 'fulfilled',
        value: 'resolved'
    },
    rejected: {
        status: 'rejected',
        reason: 'rejected'
    },
    error: {
        status: 'rejected',
        reason: new Error('error')
    },
    synchronous: {
        status: 'fulfilled',
        value: 'result'
    },
    notFunction: {
        status: 'rejected',
        // should be error that's thrown when you try to call a non-function
        reason: 'value'()
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

describe('PoolExecutor', function() {
    describe('#start', function() {
        it('should return an empty array if the task queue is empty', async function() {
            const executor = new PoolExecutor(Queue.fromArray(array.empty), concurrency);
            const result = await executor.start();
            assert.deepEqual(result, array.empty);
        });

        it('should return an array of results given tasks that resolve', async function() {
            const executor = new PoolExecutor(Queue.fromArray(load(5, task.resolves)), concurrency);
            const result = await executor.start();
            const expected = Array.from({ length: 5 }, () => taskResult.resolved);
            assert.deepEqual(result, expected);
        });

        it('should return an array of results given tasks that reject', async function() {
            const executor = new PoolExecutor(Queue.fromArray(load(5, task.rejects)), concurrency);
            const result = await executor.start();
            const expected = Array.from({ length: 5 }, () => taskResult.rejected);
            assert.deepEqual(result, expected);
        });

        it('should return an array of results given tasks that error', async function() {
            const executor = new PoolExecutor(Queue.fromArray(load(5, task.error)), concurrency);
            const result = await executor.start();
            const expected = Array.from({ length: 5 }, () => taskResult.error);
            assert.deepEqual(result, expected);
        });

        it('should return an array of results given tasks that are synchronous', async function() {
            const executor = new PoolExecutor(Queue.fromArray(load(5, task.synchronous)), concurrency);
            const result = await executor.start();
            const expected = Array.from({ length: 5 }, () => taskResult.synchronous);
            assert.deepEqual(result, expected);
        });

        it('should return an array of results given tasks that aren\'t functions', async function() {
            const executor = new PoolExecutor(Queue.fromArray(load(5, task.notFunction)), concurrency);
            const result = await executor.start();
            const expected = Array.from({ length: 5 }, () => taskResult.notFunction);
            assert.deepEqual(result, expected);
        });

        // -----

        it('result array should be the same length as the input task queue', async function() {
            const queue = Queue.fromArray(load(5, task.resolves));
            const executor = new PoolExecutor(queue, concurrency);
            const length = (await executor.start()).length;
            assert.equal(length, queue.size);
        });

        // -----

        // Is this what I'm trying to achieve?
        it('should not reject when given a priority queue', async function() {
            const comparator = (a, b) => b.priority - a.priority;
            const executor = new PoolExecutor(PriorityQueue.fromArray(load(5, task.resolves)), comparator);
            assert.doesNotReject(executor.start.bind(executor));
        });

        it('should not reject if concurrency greater than the number of tasks', async function() {
            const executor = new PoolExecutor(Queue.fromArray([task.resolves]), concurrency);
            assert.doesNotReject(executor.start.bind(executor));
        });
    });
});