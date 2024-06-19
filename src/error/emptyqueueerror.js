const MESSAGE = 'Operation not allowed on queue of size 0';

export default class EmptyQueueError extends Error {
    constructor() {
        super(MESSAGE);
    }
}