import PromisePool from '../lib/pool/promisepool.js';
import WeightedPromisePool from '../lib/weightedpool/weightedpromisepool.js';

const LIMIT = 100;
const NUM_TASKS = 3000;
const taskSuppliers = [];
const weightedTaskSuppliers = [];

// Test task that can take between 500 and 1500ms to resolve
const task = (id) => new Promise((resolve) => {
    const timeout = 500 + (Math.random() * 1000);
    
    setTimeout(() => {
        resolve(id);
    }, timeout);
});

// Create promise suppliers
for (let i = 0; i < NUM_TASKS; i++) {
    taskSuppliers.push(() => task(i));
    weightedTaskSuppliers.push({
        priority: i,
        task: () => task(i)
    });
}

// Pool strategy
console.time('pool');
const pool = new PromisePool(taskSuppliers, {
    concurrencyLimit: LIMIT
});
await pool.start();
console.timeEnd('pool');

// Weighted pool strategy
console.time('weightedpool');
const wPool = new WeightedPromisePool(weightedTaskSuppliers, {
    concurrencyLimit: LIMIT,
    comparator: (a, b) => b.priority - a.priority
});
await wPool.start();
console.timeEnd('weightedpool');

// Batching with Promise.all
console.time('all');
for (let i = 0; i < taskSuppliers.length; i+=LIMIT) {
    await Promise.all(taskSuppliers
        .slice(i, i + LIMIT)
        .map(supplier => supplier())
    );
}
console.timeEnd('all');