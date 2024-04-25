import PriorityQueue from "./priorityqueue.js";
import { EventEmitter, once } from 'node:events';

export default class WeightedPromisePool {
    /**
     * Overlapping (same implementation)
     * Props:
     *  - queue
     *  - limit
     *  - results
     *  - processingTasks
     *  - emitter (Specific emitter instance)
     *  - concurrencyLimit (getter/setter)
     *  - tasksInFlight
     *  - tasksQueued
     *  - start()
     *  - registerListeners() -- move into custom emitter
     *  - startTask()
     *  - executeTask()
     * 
     * Overlapping (same function, different implementation)
     *  - suppliers (getter/setter) -- same error, different queue type
     * 
     * Different
     *  - constructor (weighted pool will have optional comparator)
     *      Add comparator as an option flag?
     *      Builder pattern would also apply and allow for clearer input validation
     * 
     * Remove
     *  - validateSize?
     */

    #queue;
    #limit;
    #results;
    #processingTasks;
    #emitter;

    get #tasksInFlight() {
        return !!this.#processingTasks;
    }

    get #tasksQueued() {
        return !this.#queue.empty;
    }

    constructor(suppliers, { concurrencyLimit=Infinity, comparator }) {
        this.#queue = new PriorityQueue(suppliers, comparator);
        this.#limit = concurrencyLimit;
        this.#emitter = new EventEmitter();
        this.#results = [];
        this.#processingTasks = 0;
    }

    async start() {
        for (let i=0; i<this.#limit; i++) {
            this.#executeTask(this.#queue.dequeue())
        }
        await once(this.#emitter, 'poolCompleted');
        return this.#results;
    }

    #startTask() {
        const supplier = this.#queue.dequeue();
        this.#executeTask(supplier);
    }

    async #executeTask(supplier) {
        let result = {};
        try {
            this.#processingTasks++;
            const value = await supplier.task();
            result = {
                status: 'fulfilled',
                value: value
            };
        } catch(reason) {
            result = {
                status: 'rejected',
                reason: reason
            };
        } finally {
            this.#processingTasks--;
            this.#results.push(result);
            if (this.#tasksQueued) this.#startTask();
            if(!this.#tasksInFlight) this.#emitter.emit('poolCompleted');
        }
    }
}