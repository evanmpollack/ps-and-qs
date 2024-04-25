import { EventEmitter, once } from 'node:events';

/**
 * Task result status types
 */
const status = {
    fulfilled: 'fulfilled',
    rejected: 'rejected'
};

/**
 * Event types that PoolExecutor can emit and listen for
 */
const events = {
    poolCompleted: 'poolcompleted'
}

/**
 * PoolExecutor executes a given PromisePool by launching N tasks
 * that each start a new on completion, where N is the concurrency
 * limit. Extends EventEmitter to be able to emit and listen for 
 * execution events
 */
export default class PoolExecutor extends EventEmitter {
    #pool;
    #results;
    #processingTasks;

    get #tasksInFlight() {
        return !!this.#processingTasks;
    }

    get #tasksQueued() {
        return !this.#pool.queue.empty;
    }

    constructor(pool) {
        super();
        this.#pool = pool;
        this.#results = [];
        this.#processingTasks = 0;
    }

    /**
     * Launches N tasks, where N is equal to the concurrency limit.
     * Waits for 'poolcompleted' event before returning result array
     * 
     * @returns {Promise<Array>} task results
     */
    async start() {
        for (let i=0; i<this.#pool.concurrencyLimit; i++) {
            this.#nextTask();
        }
        await once(this, events.poolCompleted);
        return this.#results;
    }

    /**
     * Dequeue next task from pool and start execution
     */
    #nextTask() {
        const nextTask = this.#pool.queue.dequeue();
        this.#executeTask(nextTask);
    }

    /**
     * Execute a task and add it's result to the result array.
     * Emits 'poolcompleted' event when there are no more tasks in flight
     * 
     * @param {Object} supplier - destructure task from supplier object
     */
    async #executeTask({ task }) {
        let result = {};
        try {
            this.#processingTasks++;
            const taskResult = await task();
            result = {
                status: status.fulfilled,
                value: taskResult
            };
        } catch(e) {
            result = {
                status: status.rejected,
                reason: e
            };
        } finally {
            this.#processingTasks--;
            this.#results.push(result);
            
            if (this.#tasksQueued) {
                this.#nextTask();
            }

            if (!this.#tasksInFlight) {
                this.emit(events.poolCompleted);
            }
        }
    }
}