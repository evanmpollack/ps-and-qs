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

    return task;
};

const addTimeout = (task, timeout) => {
    let timeoutId;
    const timeoutPromise = () => {
        return new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                reject('Task timed out');
            }, timeout);
        });
    }
    return {
        task: Promise.race.bind(null, task, timeoutPromise),
        canceller: clearTimeout.bind(null, timeoutId)
    };
};

const createTask = (element, timeout) => {
    let task = format(element);
    // Adjust when I figure out default
    if (timeout) {
        // Will not be cancellable
        task = addTimeout(task, timeout).task;
    }
    return task;
};