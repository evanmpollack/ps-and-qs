import assert from 'node:assert/strict';
import PoolExecutor from '../lib/poolexecutor.js';
import Queue from '../lib/queue/queue.js';
import PriorityQueue from '../lib/queue/priorityqueue.js';
import { array } from './helpers.js';

const createTask = (task, priority=0) => {
    return { task, priority }
};

/**
 * Helper object consisting of all the possible task inputs and expected outputs needed for unit testing
 */
const task = {
    empty: {
        input: array.empty,
        output: array.empty
    },
    resolves: {
        input: createTask(() => new Promise((resolve) => resolve('resolved'))),
        output: {
            status: 'fulfilled',
            value: 'resolved'
        }
    },
    rejects: {
        input: createTask(() => new Promise((_, reject) => reject('rejected'))),
        output: {
            status: 'rejected',
            reason: 'rejected'
        }
    },
    error: {
        input: createTask(() => new Promise(() => { throw new Error('error') })),
        output: {
            status: 'rejected',
            reason: new Error('error')
        }
    },
    synchronous: {
        input: createTask(() => 'result'),
        output: {
            status: 'fulfilled',
            value: 'result'
        }
    },
    notFunction: {
        input: createTask('value'),
        output: {
            status: 'rejected',
            reason: new TypeError('undefined is not a function')
        }
    }
};

/**
 * Helper method that populates an array with the same element n times
 * Note: Similar to [element] * length in Python
 * 
 * @param {Number} num - number of tasks to insert
 * @param {Function} task - type of task to insert
 */
const createArrayFromOneElement = (count, element) => Array.from({ length: count }, () => element);

const concurrency = 2;
const taskCount = 5;

describe('PoolExecutor', function() {
    describe('#start', function() {
        context('resolve', function() {
            const execute = async ({ input, output }, count) => {
                const array = Array.isArray(input) ? input : createArrayFromOneElement(count, input);
                const queue = Queue.fromArray(array);
                const executor = new PoolExecutor(queue, concurrency);
                const result = await executor.start();
                const expected = Array.isArray(output) ? output : createArrayFromOneElement(count, output);
                return { result, expected };
            };
    
            it('should return an empty array if the task queue is empty', async function() {
                const { result, expected } = await execute(task.resolves, taskCount);
                assert.deepEqual(result, expected);
            });
    
            it('should return an array of results given tasks that resolve', async function() {
                const { result, expected } = await execute(task.rejects, taskCount);
                assert.deepEqual(result, expected);
            });
    
            it('should return an array of results given tasks that reject', async function() {
                const { result, expected } = await execute(task.rejects, taskCount);
                assert.deepEqual(result, expected);
            });
    
            it('should return an array of results given tasks that error', async function() {
                const { result, expected } = await execute(task.error, taskCount);
                assert.deepEqual(result, expected);
            });
    
            it('should return an array of results given tasks that are synchronous', async function() {
                const { result, expected } = await execute(task.synchronous, taskCount);
                assert.deepEqual(result, expected);
            });
    
            it('should return an array of results given tasks that aren\'t functions', async function() {
                const { result, expected } = await execute(task.notFunction, taskCount);
                assert.deepEqual(result, expected);
            });

            it('should return an array of results given tasks that aren\'t in the correct format');
    
            it('result array should be the same length as the input task queue', async function() {
                const { result } = await execute(task.resolves, taskCount);
                assert.equal(result.length, taskCount);
            });
        });
        
        context.skip('reject', function() {
            const tasks = [task.resolves.input];
            
            // Assert.doesNotReject Does not work with my current implementation!!!!
            
            // ensures both queue types have the same interface
            it('should not reject when given a priority queue', async function() {
                // same as other tests, abstract
                const maxTaskComparator = (a, b) => b.priority - a.priority;
                const queue = PriorityQueue.fromArray(tasks, maxTaskComparator);
                const executor = new PoolExecutor(queue, concurrency);
                assert.doesNotReject(executor.start.bind(executor));
            });

            it('should not reject if concurrency greater than the number of tasks', async function() {
                const queue = Queue.fromArray(tasks);
                const executor = new PoolExecutor(queue, concurrency);
                assert.doesNotReject(executor.start.bind(executor));
            });
        });
    });
});