const MESSAGE = 'Task timed out';

export default class TaskTimeoutError extends Error {
    /**
     * Initializes a TaskTimeoutError.
     * 
     * @constructor TaskTimeoutError
     */
    constructor() {
        super(MESSAGE);
    }
}