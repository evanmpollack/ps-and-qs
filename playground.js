import LinkedList from "./lib/pool/linkedlist.js";
import Queue from "./lib/pool/queue.js";
import PromisePool from "./lib/pool/promisepool.js";

const ll = new LinkedList();
const q = new Queue();
const task = () => new Promise((_, reject) => { 
    setTimeout(() => { throw 'hello' }, 0);
    console.log('hi1')
    // throw new Error('from error');
});
const pp = new PromisePool([task], {
    concurrencyLimit: 1
});
console.log('hi2');

// try {
//     const v = await task();
//     console.log('Try: ' + v);
// } catch(e) {
//     console.log('Catch: ' + e);
// }

// try {
//     ll.removeFirst();
// } catch (e) {
//     console.error(e.message);
// }

// ll.insertLast(1);
// ll.insertLast(2);
// ll.insertLast(5);

// console.log(ll.toString());

// ll.removeFirst();
// ll.removeFirst();
// ll.removeFirst();

// q.enqueue(1);
// q.enqueue(10);
// q.enqueue(100);

// console.log(q);

// q.dequeue();
// q.dequeue();
// q.dequeue();

// console.log(q);

// q.dequeue();


// console.log(new PromisePool());