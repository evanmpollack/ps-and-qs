import assert from 'node:assert/strict';
import PriorityQueue from '../../lib/queue/priorityqueue.js';
import { array } from '../helpers.js';

const maxComparator = (a, b) => b - a;

// needed?
const isHeap = (array, comparator) => {
    let isHeap = true;
    const lastIntenalIndex = Math.floor((array.length / 2)) - 1;
    for (let i = lastIntenalIndex; i>=0; i--) {
        // Find way to eliminate duplicate definitions
        const leftChild = {
            get index() { return (2 * i) + 1; },
            get value() { return array[this.index]; }
        };
        const rightChild = {
            get index() { return (2 * i) + 2; },
            get value() { return array[this.index]; }
        }
        const violatesHeap = (leftChild.index < array.length && comparator(array[i], leftChild.value) > 0) ||
            (rightChild.index > array.length && comparator(array[i], rightChild.value) > 0);
        if (violatesHeap) {
            isHeap = false;
            break;
        }
    }
    return isHeap;
};

describe('PriorityQueue', function() {
    context('creation', function() {
        describe('#fromArray', function() {
            it('should return an instance of PriorityQueue');
            it('should use the ordering defined by the given comparator');
            it('size should be equal to the size of the input array');
            it('should return an empty priority queue if input array is empty');
            it('should throw a TypeError if input array is not an Array');
            it('should throw a TypeError if input comparator is not a Function');
        });
    });

    context('operation', function() {
        describe('#enqueue', function() {
            it('should insert the element into the priority queue');
            it('should maintain the ordering defined by the instance\'s comparator');
            it('size should increase by 1');
            it('should throw a TypeError if input data is nullish');
        });
    
        describe('#dequeue', function() {
            context('priority queue is empty', function() {
                it('should throw an EmptyQueueError');
            });

            context('priority queue is not empty', function() {
                it('should remove the element with the most priority');
                it('should return the element with the most priority');
                it('should maintain the ordering defined by the instance\'s comparator');
                it('size should decrease by 1');
            });
        });
    });
});