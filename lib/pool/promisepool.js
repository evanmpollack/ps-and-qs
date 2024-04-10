import Queue from './queue.js';
import { EventEmitter } from 'node:events';

// Todo: options, such as delay between tasks?
const DEFAULT_OPTIONS = {
    concurrencyLimit: Infinity
}

/**
 * Promise Pool backed by Queue implemented with a Singly Linked List
 */
export default class PromisePool {
    #_queue;
    
    #limit;
    #results;
    #processingTasks;
    #emitter;

    set #suppliers(supplierArray) {
        if(!(supplierArray instanceof Array)) throw new TypeError('Suppliers must be an array');
        this.#_queue = Queue.fromArray(supplierArray);
    }

    get #suppliers() {
        return this.#_queue;
    }

    set #concurrencyLimit(limit) {
        if (limit <= 0) throw new RangeError('Concurrency limit must be greater than 0');
        this.#limit = (limit < this.#suppliers.size()) ? limit : this.#suppliers.size();
    }

    get #concurrencyLimit() {
        return this.#limit;
    }

    get #tasksInFlight() {
        return !!this.#processingTasks;
    }

    get #tasksQueued() {
        return !this.#suppliers.empty();
    }

    constructor(suppliers, options=DEFAULT_OPTIONS) {
        this.#suppliers = suppliers;
        this.#concurrencyLimit = options.concurrencyLimit;
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
        const supplier = this.#suppliers.dequeue();
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
        } catch (reason) {
            result = {
                status: 'rejected',
                reason: reason
            };
        } finally {
            this.#processingTasks--;
            this.#emitter.emit('taskCompleted', result);
        }
    }

    /**
     * If the pool overflows, trigger error event
     * 
     * Note: should be impossible, added because it's 
     *  not currently possible to examine the number of 
     *  processing tasks in a test environment
     */
    #validateSize() {
        if (this.#processingTasks > this.#concurrencyLimit) {
            this.#emitter.emit('error', new Error('Too many concurrent tasks'));
        }
    }
}