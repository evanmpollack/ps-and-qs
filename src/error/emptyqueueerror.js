const MESSAGE = 'Operation not allowed on queue of size 0';

export default class EmptyQueueError extends Error {
    /**
     * Initialize an EmptyQueueError.
     * 
     * @constructor EmptyQueueError
     */
    constructor() {
        super(MESSAGE);
    }
}