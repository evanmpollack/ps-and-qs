export default class PromisePoolError extends Error {
    /**
     * Initialize a PromisePoolError
     * 
     * @constructor PromisePoolError
     * @param {string} message 
     */
    constructor(message) {
        super(message);
    }
}