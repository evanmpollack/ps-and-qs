import Queue from './queue.mjs';
import { EventEmitter } from 'node:events';

export default class PromisePool {
    #concurrencyLimit;
    #queue;
    #results;
    #processingTasks;
    #requestDelay;
    #emitter;

    get tasksInFlight() {
        return !!this.#processingTasks;
    }

    get tasksQueued() {
        return !!this.#queue.size();
    }

    constructor(limit, suppliers, options) {
        this.#queue = Queue.fromArray(suppliers);
        this.#requestDelay = options?.delay;
        this.#concurrencyLimit = (limit <= this.#queue.size()) ? limit : this.#queue.size();
        this.#emitter = new EventEmitter()
        this.#processingTasks = 0;
        this.#results = [];
    }

    /**
     * Dequeue next supplier from queue and start execution
     */
    #startTask() {
        const supplier = this.#queue.dequeue();
        this.#executeTask(supplier);
    }

    /**
     * Configure Event Listeners
     * 
     * Default events:
     * - taskCompleted: what happens when a task finishes executing
     * - poolCompleted: what happens when all the tasks in the queue finish executing
     * - error: pool error, best practice to listen for this event
     */
    #registerListeners(resolve, reject) {
        this.#emitter.on('taskCompleted', (result) => {
            // Add result to results
            this.#results.push(result);

            // If there are any tasks still queued, get next supplier and execute
            if (this.tasksQueued) {
                this.#startTask();
            }

            // If there are no more tasks in flight, pool is done
            if (!this.tasksInFlight) {
                this.#emitter.emit('poolCompleted');
            }
        });
        this.#emitter.on('poolCompleted', () => {
            resolve(this.#results);
        });
        this.#emitter.on('error', (e) => reject(e));
    }

    /**
     * Execute the promise returned by the supplier
     * @param {function} supplier a function that returns a promise
     */
    async #executeTask(supplier) {
        let result = {};
        try {
            this.#processingTasks++;

            // Validate size
            if (this.#processingTasks > this.#concurrencyLimit) {
                this.#emitter.emit('error', new Error('Too many concurrent tasks'));
            }
            
            const value = await (supplier());
            result = {
                status: 'fulfilled',
                value: value
            };
        } catch (e) {
            result = {
                status: 'rejected',
                reason: e.message
            };
        } finally {
            this.#processingTasks--;
            this.#emitter.emit('taskCompleted', result);
        }
    }

    /**
     * Configures pool event handlers and starts executing N tasks,
     * where N is equal to the concurrency limit
     * @returns a promise that will eventually resolve to the result array
     */
    start() {
        return new Promise((resolve, reject) => {
            // How will it be possible to hook into additional events using this instead of a Deferred?
            this.#registerListeners(resolve, reject);

            for (let i=0; i<this.#concurrencyLimit; i++) {
                this.#startTask();
            }
        });
    }
}