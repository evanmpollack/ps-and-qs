import util from 'node:util';

export default class PoolExecutor {
    #queue;
    #concurrency;
    #results;

    /**
     * Checks if there are any tasks that haven't been executed yet.
     * 
     * @returns {Boolean}
     */
    get #tasksQueued() {
        return !this.#queue.empty;
    }

    /**
     * Initializes a PoolExecutor.
     * 
     * @param {Queue | PriorityQueue} queue
     * @param {Number} concurrency  
     */
    constructor(queue, concurrency) {
        this.#queue = queue;
        this.#concurrency = concurrency;
        this.#results = [];
    }

    /**
     * Launches N tasks, where N is the minimum between the concurrency 
     * limit and number of tasks. Each task recursively starts the next 
     * one as long as there are tasks still in the queue.
     * 
     * @returns {Promise<PromiseSettledResult[]>}
     */
    async start() {
        const limit = Math.min(this.#concurrency, this.#queue.size);
        const executor = Array.from({ length: limit }, this.#execute.bind(this));
        await Promise.all(executor);
        return this.#results;
    }

    /**
     * Dequeues, extracts, and runs a task. Appends the result to the result array.
     * Recursively executes until there are no more tasks in the queue.
     * 
     * Note: If limit > 1, this function will be run concurrently with (limit - 1) other calls.
     * 
     * @returns {Promise<void>}
     */
    async #execute() {
        const next = this.#queue.dequeue();
        const task = this.#getTask(next);
        const result = await this.#runTask(task);
        this.#results.push(result);
        if (this.#tasksQueued) return this.#execute(); 
    }

    /**
     * Tries to get the task from the task property in the given element.
     * If it can't find the task property, it returns a task that will reject 
     * when executed. If the task property is not a function, it returns a 
     * task that will resolve when executed.
     * 
     * Allows for additional control over result values/reasons when given an
     * invalid task.
     * 
     * Note: invalid task means no task property or task property is not a function.
     * 
     * @param {*} element task object
     * @returns {Function} task function
     */
    #getTask(element) {
        let target = 'task';
        let task;

        // Explicit check for null because typeof null === 'object' and calling in on null throws error
        // Uses in instead of hasOwnProperty to account for inherited task property
        if (element === null || typeof element !== 'object' || !(target in element)) {
            task = () => Promise.reject(`Cannot find ${target} property in ${util.inspect(element)}`);
        } else if (typeof element.task !== 'function') {
            task = () => Promise.resolve(element.task);
        } else {
            task = element.task;
        }
        
        return task;
    }

    /**
     * Runs a given task using the Promise API and returns the result.
     * 
     * @param {Function} task task function
     * @returns {Promise<PromiseSettledResult>} task result
     */
    async #runTask(task) {
        let result;
        try {
            result = await Promise.allSettled([task()]);
        } catch(e) {
            // Only runs if a synchronous task throws an error
            result = await Promise.allSettled([Promise.reject(e)]);
        }
        return result[0];
    }
}