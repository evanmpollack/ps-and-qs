import { EventEmitter } from 'node:events';

class PromiseQueueEventEmitter extends EventEmitter {}

export default new PromiseQueueEventEmitter();