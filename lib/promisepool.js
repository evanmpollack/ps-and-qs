import Queue from "./pool/queue.js";
import PriorityQueue from "./weightedpool/priorityqueue.js";
import PoolExecutor from "./poolexecutor.js";

const DEFAULT_CONCURRENCY = 100;
const DEFAULT_PRIORITIZED = false;
const DEFAULT_COMPARATOR = (taskA, taskB) => taskB.priority - taskA.priority;

/**
 * Options to expose:
 *  - weighted
 *  - comparator
 *  - limit
 * 
 * Enahancement options:
 *  - task timeout
 *  - list of listeners
 * 
 * Properties to Expose:
 *  - concurrencyLimit
 *  - percent complete
 *  - number of tasks complete
 *  - number of tasks to go
 */

// constructor should create default pool
// Builder methods, both static and instance should be available for configuring an instance
// start configures and runs executor
// Inspired by supercharge/promise-pool

// Validate at end rather than at each step?
// Pros: one validate call accounts for all construction ways
// Cons: if user creates instance and waits to start, it won't throw an error until start is called

export default class PromisePool {
    tasks;
    concurrency;
    prioritized;
    comparator;

    constructor(tasks, { concurrency, prioritized, comparator }={}) {
        this.tasks = tasks ?? [];
        this.concurrency = concurrency ?? DEFAULT_CONCURRENCY;
        this.prioritized = prioritized ?? DEFAULT_PRIORITIZED;
        this.comparator = comparator ?? DEFAULT_COMPARATOR;
    }

    withTasks(tasks) {
        PromisePool.#validateTasks(tasks);
        this.tasks = tasks;
        return this;
    }

    static withTasks(tasks) {
        PromisePool.#validateTasks(tasks);
        return new this(tasks);
    }

    withConcurrency(limit) {
        PromisePool.#validateConcurrency(limit);
        this.concurrency = limit;
        return this;
    }

    static withConcurrency(limit) {
        PromisePool.#validateConcurrency(limit);
        return new this(undefined, { 
            concurrency: limit
        });
    }

    withPriority() {
        this.prioritized = true;
        return this;
    }

    static withPriority() {
        return new this(undefined, {
            prioritized: true
        });
    }

    withComparator(comparator) {
        PromisePool.#validateComparator(comparator);
        this.comparator = comparator;
        return this;
    }

    static withComparator(comparator) {
        PromisePool.#validateComparator(comparator);
        return new this(undefined, {
            comparator: comparator
        });
    }

    async start() {
        const queue = (this.prioritized) ? new PriorityQueue(Array.from(this.tasks), this.comparator) : new Queue(this.tasks);
        return await (new PoolExecutor(queue, this.concurrency)).start();
    }

    static #validateTasks(tasks) {
        if (!(tasks instanceof Array)) throw new TypeError('Tasks must be an array');
    }

    static #validateConcurrency(limit) {
        if (limit <= 0) throw new RangeError('Concurrency limit must be greater than 0');
    }

    static #validateComparator(comparator) {
        if (!(comparator instanceof Function)) throw new TypeError('Comparator must be a function');
    }
}