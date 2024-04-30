const MESSAGE = 'Operation not allowed on collection of size 0';

export default class EmptyCollectionError extends Error {
    constructor() {
        super(MESSAGE);
    }
}