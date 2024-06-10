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
     * @returns {Promise<Array>}
     */
    async start() {
        const limit = Math.min(this.#concurrency, this.#queue.size);
        const executor = Array.from({ length: limit }, this.#execute.bind(this));
        await Promise.all(executor);
        return this.#results;
    }

    /**
     * Recursively executes each task and appends the result to the result array
     * as long as there are tasks queued.
     * 
     * @returns {Promise<void>}
     */
    async #execute() {
        const next = this.#queue.dequeue();
        const task = this.#extractTaskProp(next);
        const [ result ] = await Promise.allSettled([task()]);
        this.#results.push(result);
        if (this.#tasksQueued) return this.#execute(); 
    }

    /**
     * Creates appropriate task depending on the given queue element and element's task property.
     * Provides explicit rejection when given invalid element or task property.
     * 
     * @param {*} element - queue element
     * @returns {Function} task
     */
    #extractTaskProp(element) {
        let target = 'task';
        let task;

        // Explicit check for null because typeof null === 'object' and calling in on null throws error
        // Uses in instead of hasOwnProperty to account for inherited task property
        if (element === null || typeof element !== 'object' || !(target in element)) {
            task = () => Promise.reject(`cannot find ${target} property in ${element}`);
        } else if (typeof element.task !== 'function') {
            task = () => Promise.reject(`${target} property is not a function: ${element.task}`);
        } else {
            task = element.task;
        }
        
        return task;
    }
}