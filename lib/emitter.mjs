import { EventEmitter } from 'node:events';

class PromiseQueueEventEmitter extends EventEmitter {}

export default emitter = Object.freeze(new PromiseQueueEventEmitter());