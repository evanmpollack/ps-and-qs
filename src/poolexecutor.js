import Queue from './queue/queue.js';
import PriorityQueue from './queue/priorityqueue.js';
import { createTask } from './task.js';

export default class PoolExecutor {
    /** @type {import('./promisepool').default} */
    #pool;
    /** @type {PromiseSettledResult<any>[]} */
    #results;

    /**
     * Initializes a PoolExecutor.
     * 
     * @param {import('./promisepool').default} pool 
     */
    constructor(pool) {
        this.#pool = pool;
        this.#results = [];
    }

    /**
     * Launches N tasks, where N is the minimum between the concurrency 
     * limit and number of tasks. Each task recursively starts the next 
     * one as long as there are tasks still in the queue.
     * 
     * @returns {Promise<PromiseSettledResult<any>[]>}
     */
    async start() {
        const { tasks, concurrency, priority, comparator } = this.#pool;
        const queue = await ((priority) ? PriorityQueue.fromIterable(tasks, comparator) : Queue.fromIterable(tasks));
        const limit = Math.min(concurrency, queue.size);
        const executor = Array.from({ length: limit }, this.#execute.bind(this, queue));
        await Promise.all(executor);
        return this.#results;
    }

    /**
     * Dequeues, formats, and runs a task. Appends the result to the result array.
     * Recursively executes until there are no more tasks in the queue.
     * 
     * Note: If limit > 1, this function will be run concurrently with (limit - 1) other calls.
     * 
     * @param {Queue | PriorityQueue} queue - the queue to pull from
     * @returns {Promise<void>}
     */
    async #execute(queue) {
        const next = queue.dequeue();
        const task = createTask(next, this.#pool.timeout);
        const result = await this.#runTask(task);
        this.#results.push(result);
        if (!queue.empty) return this.#execute(queue); 
    }

    /**
     * Runs a formatted task using the Promise API and returns the result.
     * 
     * @param {import('./task.js').Task} task
     * @returns {Promise<PromiseSettledResult<any>>} - task result
     */
    async #runTask({ task, cancelTimeout }) {
        let result;
        try {
            result = await Promise.allSettled([task()]);
        } catch(e) {
            // Only runs if a synchronous task throws an error
            result = await Promise.allSettled([Promise.reject(e)]);
        }
        cancelTimeout?.();
        return result[0];
    }
}