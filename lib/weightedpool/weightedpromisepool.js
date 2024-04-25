import PoolExecutor from "../poolexecutor.js";
import PriorityQueue from "./priorityqueue.js";

export default class WeightedPromisePool {
    queue;
    concurrencyLimit;

    constructor(suppliers, { concurrencyLimit=Infinity, comparator }) {
        this.queue = new PriorityQueue(suppliers, comparator);
        this.concurrencyLimit = concurrencyLimit;
    }

    async start() {
        const executor = new PoolExecutor(this);
        return await executor.start();
    }
}