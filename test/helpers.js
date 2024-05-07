/**
 * Helper object consisting of all possible array inputs needed for unit testing.
 * - populated: [1, 2, 3, 4]
 * - empty: []
 * - invalid: 0
 */ 
export const array = Object.defineProperties({}, {
    populated: {
        enumerable: true,
        get() { return [1, 2, 3, 4]; }
    },
    empty: {
        enumerable: true,
        get() { return []; }
    },
    invalid: {
        value: 0,
        enumerable: true
    }
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