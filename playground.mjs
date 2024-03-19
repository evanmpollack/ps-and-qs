import LinkedList from "./lib/linkedlist.mjs";
import Queue from "./lib/queue.mjs";

const ll = new LinkedList();

try {
    ll.removeFirst();
} catch (e) {
    console.error(e.message);
}

ll.insertLast(1);
ll.insertLast(2);
ll.insertLast(5);

console.log(ll.toString());

ll.removeFirst();
ll.removeFirst();
ll.removeFirst();


const q = new Queue();

q.enqueue(1);
q.enqueue(10);
q.enqueue(100);

console.log(q.toString());

q.dequeue();
q.dequeue();
q.dequeue();

console.log(q.toString());

q.dequeue();