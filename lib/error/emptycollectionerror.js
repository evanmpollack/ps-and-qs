export default class EmptyCollectionError extends Error {
    constructor(type) {
        super(`Operation not allowed on ${type} of size 0`);
    }
}