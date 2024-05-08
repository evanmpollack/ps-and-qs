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
 *  - REJECT NOT POSSIBLE?
 * 
 * - Task Promise
 *  - Resolved task results should have a status property equal to fulfilled
 *  - Resolved task results should have a value property equal to the resolved value
 *  - Rejected task results should have a status property equal to rejected
 *  - Rejected task results should have a reason property equal to the rejected value 
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

describe('PoolExecutor', function() {
    describe('#start', function() {

    });
});