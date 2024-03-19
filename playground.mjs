import LinkedList from "./lib/linkedlist.mjs";

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
