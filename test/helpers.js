

/**
 * Creates a frozen object from a set of KV pairs, where the key becomes an object key and the value is configured to be enumerable.
 * Simulates immutability by assigning every mutable type to a getter, such that every call returns the original value no matter how it's modified
 * in an external context. If mutations are necessary, assign the reference to another variable and mutate that
 * 
 * @param {Object} o - KV pairs
 * @returns {Object}
 */
const defineImmutableValueSupplier = (o) => {
    const config = Object.keys(o)
        .map(k => { return { key: k, value: o[k] }; })
        .reduce((acc, cv) => {
            const { key, value } = cv;
            const descriptor = (value instanceof Object) ? { get: () => structuredClone(value) } : { value };
            acc[key] = Object.assign(descriptor, { enumerable: true });
            return acc;
        }, {});
    return Object.freeze(Object.defineProperties({}, config));
}


/**
 * Helper object consisting of all possible array inputs needed for unit testing.
 * - populated: [1, 2, 3, 4]
 * - empty: []
 * - invalid: 0
 */ 
export const array = defineImmutableValueSupplier({
    populated: [1, 2, 3, 4],
    empty: [],
    invalid: 0
});

/**
 * Helper object containing a short list of types to use when testing validation
 * 
 * Contains all primitives, Object, and Array
 */
export const type = defineImmutableValueSupplier({
    string: 'test',
    number: 1,
    bigint: 1n,
    boolean: true,
    symbol: Symbol(),
    null: null,
    undefined: undefined,
    object: {},
    array: [],
});


/**
 * Extracts each element from the given queue and 
 * puts them into an array in the extraction order.
 * 
 * @param {Queue | PriorityQueue} queue 
 * @returns {Array}
 */
export const queueToArray = (queue) => {
    const result = [];
    while(!queue.empty) result.push(queue.dequeue());
    return result;
};

/**
 * Helper method that populates a queue with the elements of a given array.
 * Maintains order of array.
 * 
 * @param {Queue | PriorityQueue} queue
 * @param {Array} array
 */
export const loadQueue = (queue, array) => array.forEach(v => queue.enqueue(v));