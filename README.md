# Ps and Qs
## Mind your promises with standard and priority queues

### Overview
An efficient, zero dependency promise pool implementation that provides control over the concurrency limit when executing a series of 
asynchronous tasks. Useful for managing requests to upstream services, worker concurrency, and more.

This library is similar to other popular promise limiting solutions like [p-limit](https://www.npmjs.com/package/p-limit), [es6-promise-pool](https://www.npmjs.com/package/es6-promise-pool), 
and [@supercharge/promise-pool](https://www.npmjs.com/package/@supercharge/promise-pool). It expands on those by adding support for tasks that should be executed based on priority rather than insertion order.

### Details
Launches tasks until the concurrency limit is reached and then waits for the last one to complete before returning the results. The completion of one task starts the next task in the queue, ensuring that the concurrency limit is never exceeded.

- Configurable through a fluent interface, property accessors, or an options argument in the constructor.
- Backed by queue and priority queue data structures.
- Event-driven pool execution process, no polling.

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

1. Format async jobs into the expected task structure
2. Create and configure a PromisePool instance
3. Call the start() method and wait for results

<!--- Not sure if I want to specify expected task structure, might put too much responsibility on user --->
#### Expected task structure:
```
const task = { task, priority? };
```
- Task (`Function`): promise supplier
- Priority (`Number`): desired priority

#### Properties
<!--- Not sure if I want to specify expected task structure, might put too much responsibility on user --->
- Tasks: an array of task objects formatted into the expected task structure. Defaults to `[]` if not specified.
    - _Requirements: Must be `Array`_
- Concurrency: the maximum number of tasks that can be running at once. Defaults to `100` if not specified.
    - _Requirements: Must be a `Number` greater than or equal to 1_
- Priority: switches the order of execution for each task from FIFO to the order defined by the comparator. Defaults to `false` if not specified.
    - _Requirements: Must be a `Boolean`_
- Comparator: defines the order of execution for each task. Defaults to a max number comparator on the `priority` key of the each task object, `(a, b) => b.priority - a.priority`
    - _Requirements: must be a `Function`_

#### Errors
Errors are thrown when inputs aren't the correct type or in the correct ranges. The executor will do its best to handle task runtime errors internally.

#### Result Format
Follows the output format of [Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled).

##### Success
```
{
    status: 'fulfilled',
    value: value
}
```

##### Failure
```
{
    status: 'rejected',
    reason: message
}
```

### Data Structure Implementation Details
#### Queue
- Uses a singly linked list implementation under the hood to ensure constant time (`O(1)`) insertion and deletion.
- `fromArray()` runs in linear time (`O(n)`), as each element of the array has to be visited and inserted into the queue.

#### Priority Queue
- Uses an array-based heap under implementation under the hood to ensure logarithmic time (`O(logn)`) insertion and deletion.
- `fromArray()` runs in linear time (`O(n)`), as the bottom-up heap construction algorithm is used to heapify the array.

### Supported Node.js Versions
`structuredClone` is used, make sure you are using a version `>= 18`