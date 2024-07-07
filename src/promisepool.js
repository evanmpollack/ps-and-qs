import Queue from './queue/queue.js';
import PriorityQueue from './queue/priorityqueue.js';
import PoolExecutor from './poolexecutor.js';
import PromisePoolError from './error/promisepoolerror.js';

const DEFAULT_TASKS = [];
const DEFAULT_CONCURRENCY = 100;
const DEFAULT_PRIORITY = false;
const DEFAULT_COMPARATOR = (taskA, taskB) => taskB.priority - taskA.priority;

// Move to .d.ts file?
/**
 * @typedef {Object} Task
 * @property {number} [priority]
 * @property {Function} task
 */

export default class PromisePool {
    /** @type {Iterable<Task> | AsyncIterable<Task>} */
    #tasks;
    /** @type {number} */
    #concurrency;
    /** @type {boolean} */
    #priority;
    /** @type {Function} */
    #comparator;

    /**
     * Validates and sets the collection of tasks associated with this promise pool.
    */ 
    set tasks(tasks) {
        const isIterable = typeof tasks?.[Symbol.iterator] === 'function' || typeof tasks?.[Symbol.asyncIterator] === 'function';
        if (!isIterable) throw new PromisePoolError('Tasks must be an iterable');
        this.#tasks = tasks;
    }

    /**
     * Gets the collection of tasks associated with this promise pool.
     */
    get tasks() {
        return this.#tasks;
    }

    /**
     * Validates and sets the concurrency limit associated with this promise pool.
     */
    set concurrency(concurrency) {
        if (typeof concurrency !== 'number') throw new PromisePoolError('Concurrency must be a Number');
        if (concurrency <= 0) throw new PromisePoolError('Concurrency limit must be greater than 0');
        this.#concurrency = concurrency;
    }

    /**
     * Gets the concurrency limit associated with this promise pool.
     */
    get concurrency() {
        return this.#concurrency;
    }

    /**
     * Validates and sets the priority associated with a promise pool.
     */
    set priority(priority) {
        if (typeof priority !== 'boolean') throw new PromisePoolError('Priority must be a Boolean');
        this.#priority = priority;
    }

    /**
     * Gets the priority associated with a promise pool.
     */
    get priority() {
        return this.#priority;
    }

    /**
     * Validates and sets the comparator associated with a promise pool.
     */
    set comparator(comparator) {
        if (typeof comparator !== 'function') throw new PromisePoolError('Comparator must be a Function');
        this.#comparator = comparator;
    }

    /**
     * Gets the comparator associated with a promise pool.
     */
    get comparator() {
        return this.#comparator;
    }

    /**
     * Create and configure a PromisePool.
     * 
     * @constructor PromisePool
     * @param {Iterable<Task> | AsyncIterable<Task>} [tasks=DEFAULT_TASKS] - the collection of tasks to run
     * @param {Object} [options] - configuration object
     * @param {number} [options.concurrency=DEFAULT_CONCURRENCY] - number greater than 0
     * @param {boolean} [options.priority=DEFAULT_PRIORITY] - flag that determines if tasks should be executed by priority
     * @param {Function} [options.comparator=DEFAULT_COMPARATOR] - sorting function for tasks with priority
     */
    constructor(tasks, { concurrency, priority, comparator }={}) {
        this.tasks = tasks ?? DEFAULT_TASKS;
        this.concurrency = concurrency ?? DEFAULT_CONCURRENCY;
        this.priority = priority ?? DEFAULT_PRIORITY;
        this.comparator = comparator ?? DEFAULT_COMPARATOR;
    }

    /**
     * Sets the collection of tasks associated with a promise pool instance.
     * 
     * @param {Iterable<Task> | AsyncIterable<Task>} tasks - collection of tasks
     * @returns {PromisePool}
     */
    withTasks(tasks) {
        this.tasks = tasks;
        return this;
    }

    /**
     * Creates a promise pool instance with the collection of tasks associated to it.
     * 
     * @param {Iterable<Task> | AsyncIterable<Task>} tasks - collection of tasks
     * @returns {PromisePool}
     */
    static withTasks(tasks) {
        return new this(tasks);
    }

    /**
     * Sets the concurrency limit associated with a promise pool instance.
     * 
     * @param {number} limit - number greater than 0
     * @returns {PromisePool}
     */
    withConcurrency(limit) {
        this.concurrency = limit;
        return this;
    }

    /**
     * Creates a promise pool instance with the concurrency limit associated to it.
     * 
     * @param {number} limit - number greater than 0 
     * @returns {PromisePool}
     */
    static withConcurrency(limit) {
        return new this(undefined, { 
            concurrency: limit
        });
    }

    /**
     * Sets the priority flag associated with a promise pool.
     * 
     * @returns {PromisePool}
     */
    withPriority() {
        this.priority = true;
        return this;
    }

    /**
     * Creates a promise pool instance with the priority flag set to true.
     * 
     * @returns {PromisePool}
     */
    static withPriority() {
        return new this(undefined, {
            priority: true
        });
    }

    /**
     * Sets the task comparator associated with a promise pool.
     * 
     * @param {Function} comparator - sorting function
     * @returns {PromisePool}
     */
    withComparator(comparator) {
        this.comparator = comparator;
        return this;
    }

    /**
     * Creates a promise pool instance with the task comparator associated to it.
     * 
     * @param {Function} comparator - sorting function
     * @returns {PromisePool}
     */
    static withComparator(comparator) {
        return new this(undefined, {
            comparator: comparator
        });
    }

    /**
     * Executes the tasks associated with a promise pool.
     * 
     * @returns {Promise<PromiseSettledResult<any>[]>}
     */
    async start() {
        const queue = await ((this.priority) ? PriorityQueue.fromIterable(this.tasks, this.comparator) : Queue.fromIterable(this.tasks));
        return await (new PoolExecutor(queue, this.concurrency)).start();
    }
}