# Ps and Qs
## Mind your promises with standard and priority queues

### Overview
An efficient, zero dependency promise pool implementation that provides control over the concurrency limit when executing a series of 
asynchronous tasks. Useful for managing requests to upstream services and more.

This library is similar to other popular promise limiting solutions, like [p-limit](https://www.npmjs.com/package/p-limit), [es6-promise-pool](https://www.npmjs.com/package/es6-promise-pool), 
and [@supercharge/promise-pool](https://www.npmjs.com/package/@supercharge/promise-pool). It expands on those by adding support for tasks that should be executed based on priority rather 
than insertion order.

### Details
- PromisePool uses a standard queue that is backed by a singly linked list.
- WeightedPromisePool uses a priority queue that is backed by a max heap.
- Event-driven pool execution process, no polling.

### How to use
**PromisePool**
```
const task = async () => {
    // work
};
const promiseSuppliers = [
    () => task(),
    () => task(),
    ...
];

const pPool = new PromisePool(promiseSuppliers, options);
const results = await pPool.start();
```

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
