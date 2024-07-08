# Ps and Qs
## Mind your promises with FIFO and priority queues

### Overview
An efficient promise pool implementation that provides control over the concurrency limit and execution order when running a series of 
asynchronous tasks. Useful for managing requests to upstream services, worker concurrency, and more.

Designed to be an improvement of batch processing with [`Promise.allSettled()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) and has the following key features:

- Pooling instead of batching
- Flexible configuration
- ESM, CJS, and Browser support
- Zero dependencies

This library is similar to other popular concurrency limiting solutions like [p-limit](https://www.npmjs.com/package/p-limit), [es6-promise-pool](https://www.npmjs.com/package/es6-promise-pool), 
and [@supercharge/promise-pool](https://www.npmjs.com/package/@supercharge/promise-pool). It expands on those by adding support for tasks that should be executed based on priority.

### Details
Exposes the `PromisePool` class which has methods to configure and start execution. The instance can be configured through the fluent interface, property accessors, or options argument in the constructor. Execution begins when `start()` is invoked and follows these high-level steps: 
1. Each task is inserted into a queue.
2. Tasks are launched in succession until the concurrency limit is reached.
3. Each completed task is responsible for launching the next one until the queue is empty.

### Installation
#### NPM
```
npm i @evanmpollack/ps-and-qs
```

#### Script Tag
```
<script src="https://cdn.jsdelivr.net/npm/@evanmpollack/ps-and-qs/dist/promisepool.min.js"></script>
```

### Examples
Fluent Interface
```
// Static
const results = await PromisePool.withPriority()
    .withTasks(tasks)
    .withConcurrency(2)
    .withComparator((taskA, taskB) => {
        return taskA.priority - taskB.priority;
    })
    .start();

// Instance
const results = await (new PromisePool()).withPriority()
    .withTasks(tasks)
    .withConcurrency(2)
    .withComparator((taskA, taskB) => {
        return taskA.priority - taskB.priority;
    })
    .start();
```

Property Accessors
```
const pool = new PromisePool();
pool.tasks = tasks;
pool.concurrency = 3;
pool.priority = true;
pool.comparator = (taskA, taskB) => taskA.priority - taskB.priority;
const results = await pool.start();
```

Options Argument
```
const options = {
    concurrency: 7,
    priority: true,
    comparator: (taskA, taskB) => taskA.priority - taskB.priority
};
const pool = new PromisePool(tasks, options);
const results = await pool.start();
```

### How to use

1. Aggregate async jobs into the [expected task structure](#task-properties).
2. Configure and create a Promise Pool.
3. Call the start() method and wait for results.

#### Pool Properties
- Tasks: a collection of task objects formatted into the expected task structure. Defaults to `[]` if not specified.
    - _Requirements: Must be `Iterable`_
    - _Note: `AsyncIterable` is supported. However, the pool won't start executing until the `AsyncIterable` is consumed_
- Concurrency: the maximum number of tasks that can run at once. Defaults to `100` if not specified.
    - _Requirements: Must be a `Number` greater than or equal to 1_
- Priority: switches the order of execution for each task from FIFO to the order defined by the comparator. Defaults to `false` if not specified.
    - _Requirements: Must be a `Boolean`_
- Comparator: defines the order of execution for each task. Defaults to a max number comparator on the `priority` key of each task object, `(a, b) => b.priority - a.priority`.
    - _Requirements: must be a `Function`_

#### Task Properties
```
{ task, priority? }
```
- Task (`Function`): wrapped promise (i.e. a function that returns a `Promise`)
    - _Required_
- Priority (`Number`): task priority
    - _Optional: only required when using the default comparator_

#### Errors
A `PromisePoolError` is thrown when the pool isn't configured correctly based on the requirements outlined in [Pool Properties](#pool-properties). The pool will do its best to handle task runtime errors internally by rejecting the task and providing a reason. It will not halt execution. Tasks will reject if the `task` property is not found on an item. If the `task` property is found but is not a function, the value provided will be wrapped in a `Promise` that will resolve to the original value upon execution.

#### Result Format
Leverages [Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) under the hood to generate the results, yielding the same result format.

### Data Structure Implementation Details
#### Queue
- Uses a singly linked list implementation under the hood to ensure constant time (`O(1)`) enqueue and dequeue.

- `fromIterable()` runs in linear time (`O(n)`), as each element of the array has to be visited and inserted into the queue.

#### Priority Queue
- Uses an array-based heap implementation under the hood to ensure logarithmic time (`O(log(n))`) enqueue and dequeue.

- `fromIterable()` runs in linear time (`O(n)`), as the bottom-up heap construction algorithm is used to heapify the iterable.

### Supported Node Versions
Developed and built with Node 21 and tested against Node 18, 20, and 22, the current and LTS releases at the time of writing this.

<!-- Update after event target addition --> 
<!--_Note: While not tested, this library should be compatible with Node 16. The library uses ES6 features that have been officially supported since Node 13, including ESM, async/await, and classes._-->

### Planned Enhancements
1. Task timeout
2. Task started and finished callbacks
3. Runtime statistics

### Contributing and Feedback
All constructive feedback is appreciated. Please submit an issue and I will follow-up as soon as possible.
