import Queue from './queue.js';
import { EventEmitter } from 'node:events';

// Todo: options, such as delay between tasks?

/**
 * Promise Pool backed by Queue implemented with a Singly Linked List
 */
export default class PromisePool {
    #limit;
    #queue;
    #results;
    #processingTasks;
    #emitter;

    set #concurrencyLimit(limit) {
        this.#limit = (limit < this.#queue.size()) ? limit : this.#queue.size();
    }

    get #concurrencyLimit() {
        return this.#limit;
    }

    get #tasksInFlight() {
        return !!this.#processingTasks;
    }

    get #tasksQueued() {
        return !!this.#queue.size();
    }

    constructor(limit, suppliers) {
        this.#queue = Queue.fromArray(suppliers);
        this.#concurrencyLimit = limit;
        this.#emitter = new EventEmitter();
        this.#processingTasks = 0;
        this.#results = [];
    }

    /**
     * Configures pool event handlers and starts executing N tasks,
     * where N is equal to the concurrency limit
     * 
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
            this.#results.push(result);
            
            if (this.#tasksQueued) {
                this.#startTask();
            }

            if (!this.#tasksInFlight) {
                this.#emitter.emit('poolCompleted');
            }
        });
        this.#emitter.on('poolCompleted', () => resolve(this.#results));
        this.#emitter.on('error', (e) => reject(e));
    }

    /**
     * Dequeue next supplier from queue and start execution
     */
    #startTask() {
        const supplier = this.#queue.dequeue();
        this.#executeTask(supplier);
    }

    /**
     * Execute the promise returned by the supplier
     * @param {function} supplier a wrapped promise
     */
    async #executeTask(supplier) {
        let result = {};
        try {
            this.#processingTasks++;
            this.#validateSize();
            const value = await supplier();
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
     * If the pool overflows, trigger error event
     * Note: should be impossible, added for good measure
     */
    #validateSize() {
        if (this.#processingTasks > this.#concurrencyLimit) {
            this.#emitter.emit('error', new Error('Too many concurrent tasks'));
        }
    }
}