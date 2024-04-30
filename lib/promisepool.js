import Queue from './pool/queue.js';
import PriorityQueue from './weightedpool/priorityqueue.js';
import PoolExecutor from './poolexecutor.js';
import PromisePoolError from './error/promisepoolerror.js';

const DEFAULT_TASKS = [];
const DEFAULT_CONCURRENCY = 100;
const DEFAULT_PRIORITIZED = false;
const DEFAULT_COMPARATOR = (taskA, taskB) => taskB.priority - taskA.priority;

export default class PromisePool {
    #_tasks;
    #_concurrency;
    #_comparator;

    prioritized;

    set tasks(tasks) {
        if (!(tasks instanceof Array)) throw new PromisePoolError('Tasks must be an array');
        this.#_tasks = tasks;
    }

    get tasks() {
        return this.#_tasks;
    }

    set concurrency(concurrency) {
        if (concurrency <= 0) throw new PromisePoolError('Concurrency limit must be greater than 0');
        this.#_concurrency = concurrency;
    }

    get concurrency() {
        return this.#_concurrency;
    }

    set comparator(comparator) {
        if (!(comparator instanceof Function)) throw new PromisePoolError('Comparator must be a function');
        this.#_comparator = comparator;
    }

    get comparator() {
        return this.#_comparator;
    }

    constructor(tasks, { concurrency, prioritized, comparator }={}) {
        this.tasks = tasks ?? DEFAULT_TASKS;
        this.concurrency = concurrency ?? DEFAULT_CONCURRENCY;
        this.prioritized = prioritized ?? DEFAULT_PRIORITIZED;
        this.comparator = comparator ?? DEFAULT_COMPARATOR;
    }

    withTasks(tasks) {
        this.tasks = tasks;
        return this;
    }

    static withTasks(tasks) {
        return new this(tasks);
    }

    withConcurrency(limit) {
        this.concurrency = limit;
        return this;
    }

    static withConcurrency(limit) {
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
        this.comparator = comparator;
        return this;
    }

    static withComparator(comparator) {
        return new this(undefined, {
            comparator: comparator
        });
    }

    async start() {
        const queue = (this.prioritized) ? new PriorityQueue(Array.from(this.tasks), this.comparator) : new Queue(this.tasks);
        return await (new PoolExecutor(queue, this.concurrency)).start();
    }
}