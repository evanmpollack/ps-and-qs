export default class PoolExecutor {
    #queue;
    #concurrency;
    #results;

    get #tasksQueued() {
        return !this.#queue.empty;
    }

    /**
     * PoolExecutor executes a given PromisePool by launching N tasks
     * that each start a new one on completion, where N is the concurrency
     * limit. Extends EventEmitter to be able to emit and listen for 
     * execution events.
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
        const execute = async () => {
            const { task } = this.#queue.dequeue();
            const [ result ] = await Promise.allSettled([task()]);
            this.#results.push(result);
            if (this.#tasksQueued) return execute();
        };
        const executor = Array.from({ length: limit }, execute);
        await Promise.all(executor);
        return this.#results;
    }
}