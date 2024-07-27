/**
 * @typedef {Object} FormattedTask
 * @property {Function} task
 * @property {Function} [cancelTimeout]
 */

/**
 * Tries to get the task from the task property in the given element.
 * If it can't find the task property, it returns a task that will reject 
 * when executed. If the task property is not a function, it returns a 
 * task that will resolve when executed.
 * 
 * Allows for additional control over result values/reasons when given an
 * invalid task.
 * 
 * Note: invalid task means no task property or task property is not a function.
 * 
 * @param {import('./promisepool').Task} element - unformatted task object
 * @returns {FormattedTask} - formatted task object
 */
const format = (element) => {
    const target = 'task';
    let task;
    // Explicit check for null because typeof null === 'object' and calling in on null throws error
    // Uses in instead of hasOwnProperty to account for inherited task property
    if (element === null || typeof element !== 'object' || !(target in element)) {
        task = () => Promise.reject(`Cannot find ${target} property in ${JSON.stringify(element)}`);
    } else if (typeof element.task !== 'function') {
        task = () => Promise.resolve(element.task);
    } else {
        task = element.task;
    }

    return { task };
};

/**
 * Decorator for FormattedTask that adds a timeout to the task.
 * The resulting FormattedTask also has a timeout canceller should the 
 * original task finish before the timer runs out.
 * 
 * @param {FormattedTask} task 
 * @param {number} timeout 
 * @returns {FormattedTask}
 */
const addTimeout = ({ task }, timeout) => {
    let timeoutId;
    const timeoutPromise = () => {
        return new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                reject('Task timed out');
            }, timeout);
        });
    }
    return {
        // Why doesn't this work with bind?
        task: () => Promise.race([task(), timeoutPromise()]),
        cancelTimeout: () => clearTimeout(timeoutId)
    };
};

/**
 * Formats an unformatted task by extracting the task property,
 * handling task objects that aren't immediately executable, and
 * adding a timeout and timeout canceller to the extracted task property 
 * if one is provided.
 * 
 * @param {import('./promisepool').Task} element 
 * @param {number} timeout 
 * @returns {FormattedTask}
 */
const createTask = (element, timeout) => {
    return (!timeout) ? format(element) : addTimeout(format(element), timeout); 
};

export {
    createTask
};