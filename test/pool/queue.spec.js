import assert from 'node:assert/strict';
import Queue from '../../lib/pool/queue.js';

describe('Queue', function() { 
    const input = [1, 2, 3, 4];
    
    context('creation', function() {
        describe('#fromArray', function() {
            it('should maintain the order of the input array', function() {
                const queueFromArray = Queue.fromArray(input);
                const queueAsArray = (() => {
                    const arr = [];
                    while(queueFromArray.size()) arr.push(queueFromArray.dequeue());
                    return arr;
                })();
                assert.deepEqual(queueAsArray, input);
            });

            it('size should increase by the length of the input array', function() {
                assert.equal(Queue.fromArray(input).size(), input.length);
            });
        });
    })
    
    context('operation', function() {
        let queue;
        
        beforeEach(function() {
            queue = Queue.fromArray(input);
        });

        describe('#enqueue', function() {
            it('should insert value at the end', function() {
                // firstElement !== secondElement !== thirdElement to ensure validity of test case
                const thirdElement = 2;
                queue.enqueue(thirdElement);
                const lastElement = (() => {
                    let curr;
                    while(queue.size()) curr = queue.dequeue();
                    return curr;
                })();
                assert.equal(lastElement, thirdElement);
            });

            it('size should increase by 1', function() {
                const previousSize = queue.size();
                queue.enqueue(0);
                assert.equal(queue.size(), previousSize + 1);
            });
        });

        describe('#dequeue', function() {
            it('should return the value at the front', function() {
                const data = queue.dequeue();
                assert.equal(data, input[0]);
            });

            it('size should decrease by 1', function() {
                const previousSize = queue.size();
                queue.dequeue();
                assert.equal(queue.size(), previousSize - 1);
            });
        });

        describe('#peek', function() {
            it('should return the value at the front', function() {
                const data = queue.peek();
                assert.equal(data, input[0]);
            });

            it('size should not decrease', function() {
                const previousSize = queue.size();
                queue.peek();
                assert.equal(queue.size(), previousSize);
            });
        });
    });
});