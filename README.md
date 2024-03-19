# Ps and Qs
## Mind your promises with standard and priority queues

### Overview
Efficient, zero-dependency library that allows you to create and use a PromisePool and
WeightedPromisePool to limit promise concurrency when executing a series of
asynchronous tasks. Useful for managing requests to upstream services.

### Details
- PromisePool uses a standard queue that is backed by a singly linked list.
- WeightedPromisePool uses a priority queue that is backed by a max heap.
- Event-driven pool execution process, no polling.

#### Result Format
Follows the output format of Promise.allSettled()
```
{
    status: 'fulfilled',
    value: value
}

{
    status: 'rejected',
    reason: message
}
```

### How to use
**PromisePool**
```

// must be greater than 0
const concurrencyLimit = 10;
const task = async () => {
    // work
};
const promiseSuppliers = [
    () => task(),
    () => task(),
    ...
];

const pPool = new PromisePool(concurrencyLimit, promiseSuppliers);
const results = await pPool.start();
```
