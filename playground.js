import PromisePool from "./lib/promisepool.js";

const task = (priority) => new Promise((resolve) => setTimeout(() => resolve(priority), 1000));

const tasks = [
    {
        priority: 2,
        task: task
    }, 
    {
        priority: 1,
        task: task
    },
    {
        priority: 5,
        task: task
    },
    {
        priority: 72,
        task: task
    }, 
    {
        priority: 1,
        task: task
    },
    {
        priority: 27,
        task: task
    },
    {
        priority: 55,
        task: task
    }, 
    {
        priority: 6,
        task: task
    },
    {
        priority: 7,
        task: task
    }
];

const tasks2 = Array.from(tasks);

const wp = PromisePool
    .withPriority()
    .withConcurrency(2)
    .withTasks(tasks);

const p = PromisePool
    .withTasks(tasks2)
    .withConcurrency(2);

console.time('p');
console.log(await p.start());
console.timeEnd('p');

console.time('wp');
const results = await wp.start();
console.log(results);
console.timeEnd('wp');

console.time('pall');
const limit = 2;
const results2 = [];
for (let i=0; i<tasks2.length; i+=limit) {
    results2.push(...(await Promise.allSettled(tasks2
        .slice(i, i + limit)
        .map(supplier => supplier.task()))));
}
console.log(results2);
console.timeEnd('pall');