import Queue from './queue/queue.js';
import PriorityQueue from './queue/priorityqueue.js';
import PoolExecutor from './poolexecutor.js';
import PromisePoolError from './error/promisepoolerror.js';

const DEFAULT_TASKS = [];
const DEFAULT_CONCURRENCY = 100;
const DEFAULT_PRIORITY = false;
const DEFAULT_COMPARATOR = (taskA, taskB) => taskB.priority - taskA.priority;

export default class PromisePool {
    #tasks;
    #concurrency;
    #priority;
    #comparator;

    set tasks(tasks) {
        const isIterable = typeof tasks[Symbol.iterator] === 'function' || typeof tasks[Symbol.asyncIterator] === 'function';
        if (!isIterable) throw new PromisePoolError('Tasks must be an iterable');
        this.#tasks = tasks;
    }

    get tasks() {
        return this.#tasks;
    }

    set concurrency(concurrency) {
        if (typeof concurrency !== 'number') throw new PromisePoolError('Concurrency must be a Number');
        if (concurrency <= 0) throw new PromisePoolError('Concurrency limit must be greater than 0');
        this.#concurrency = concurrency;
    }

    get concurrency() {
        return this.#concurrency;
    }

    set priority(priority) {
        if (typeof priority !== 'boolean') throw new PromisePoolError('Priority must be a Boolean');
        this.#priority = priority;
    }

    get priority() {
        return this.#priority;
    }

    set comparator(comparator) {
        if (typeof comparator !== 'function') throw new PromisePoolError('Comparator must be a Function');
        this.#comparator = comparator;
    }

    get comparator() {
        return this.#comparator;
    }

    constructor(tasks, { concurrency, priority, comparator }={}) {
        this.tasks = tasks ?? DEFAULT_TASKS;
        this.concurrency = concurrency ?? DEFAULT_CONCURRENCY;
        this.priority = priority ?? DEFAULT_PRIORITY;
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
        this.priority = true;
        return this;
    }

    static withPriority() {
        return new this(undefined, {
            priority: true
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
        const queue = await ((this.priority) ? PriorityQueue.fromIterable(this.tasks, this.comparator) : Queue.fromIterable(this.tasks));
        return await (new PoolExecutor(queue, this.concurrency)).start();
    }
}