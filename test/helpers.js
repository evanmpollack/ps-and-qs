

/**
 * Creates a frozen object from a set of KV pairs, where the key becomes an object key and the value is configured to be enumerable.
 * Simulates immutability by assigning every mutable type to a getter, such that every call returns the original value no matter how it's modified
 * in an external context. If mutations are necessary, assign the reference to another variable and mutate that
 * 
 * @param {Object} o - KV pairs
 * @returns {Object}
 */
const defineImmutableValueSupplier = (o) => {
    const props = Object.entries(o)
        .reduce((acc, entry) => {
            const [ key, value ] = entry;
            // Beware: fits testing needs, but check doesn't encapsulate all incompatible types listed in docs
            // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#things_that_dont_work_with_structured_clone
            const descriptor = (() => {
                if (typeof value === 'function' || !(value instanceof Object)) {
                    return { value };
                } else {
                    return { get: () => structuredClone(value) };
                }
            })();
            acc[key] = Object.assign(descriptor, { enumerable: true });
            return acc;
        }, {});
    return Object.freeze(Object.defineProperties({}, props));
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
    function: () => {}
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

// export const range = (start, end, step) => {
//     if (start > end)
//     const length = (step > 0) Math.abs((stop - start) / (step + 1))
    
//     return 
// }

export const getOwnNonMethodPropertyNames = (o, ...args) => {
    if (o === null || o === undefined) return;
    let descriptors;
    let properties;
    const target = o.prototype ?? o;
    try {
        const instance = new o(...args);
        descriptors = {
            ...Object.getOwnPropertyDescriptors(target),
            ...Object.getOwnPropertyDescriptors(instance)
        };
    } catch(e) {
        descriptors = Object.getOwnPropertyDescriptors(target);
    } finally {
        properties = Object.entries(descriptors)
            .filter(([_, descriptor]) => {
                const { get, set, value, enumerable } = descriptor;
                return (!!set || !!get) || !(value instanceof Function && !enumerable);
            })
            .map(([property, _]) => property);
    }
    return properties;
}