import EmptyCollectionError from '../error/emptycollectionerror.js';

/**
 * Moves an element down the heap (increases index/key) as long as it has children 
 * and should be further from the root of the heap than the selected child according
 * to the given comparator.
 * @param {Array} array 
 * @param {Number} index 
 * @param {Function} comparator 
 */
const siftDown = (array, index, comparator) => {
    const length = array.length;
    while(hasLeftChild(length, index)) {
        // nextChildIndex should always be the index of the larger/lesser child depending on comparator
        const nextChildIndex = (() => {
            // b - a < 0 === rightChild > leftChild
            // checks if the right child should come before (closer to root) the left child
            const useRightChildIndex = hasRightChild(length, index) && comparator(getRightChild(array, index), getLeftChild(array, index)) < 0;
            return (useRightChildIndex) ? getRightChildIndex(index) : getLeftChildIndex(index);
        })();

        // b - a > 0 === currentValue < largestChild
        // Checks if current value should come after (further from root) the next child
        if (comparator(array[index], array[nextChildIndex]) > 0) {
            swap(array, index, nextChildIndex);
            index = nextChildIndex;
        } else {
            break;
        }
    }
}

/**
 * Moves the last element up the heap (decreases index/key) as long as it has a parent
 * and should be closer to the root of the heap than the parent according to the provided comparator.
 * @param {Array} array 
 * @param {Function} comparator 
 */
const siftUp = (array, comparator) => {
    let index = array.length - 1;
    // b - a < 0 === currentValue > parent
    // checks if the current value should come before (closer to root) its parent
    while(hasParent(index) && comparator(array[index], getParent(array, index)) < 0) {
        let parentIndex = getParentIndex(index);
        swap(array, index, parentIndex);
        index = parentIndex;
    }
}

/**
 * Swaps the values at the given indices in the array.
 * @param {Array} array 
 * @param {Number} i 
 * @param {Number} j 
 */
const swap = (array, i, j) => {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
};

/**
 * Validates length of array, throwing error if size is 0.
 * @param {Array} array 
 * @returns {void}
 */
const validateSize = (array) => {
    if (array.length) return;
    throw new EmptyCollectionError('heap'); 
}

/**
 * Calculates parent index using formula Floor((i - 1) / 2).
 * @param {Number} i 
 * @returns parent index
 */
const getParentIndex = (i) => Math.floor((i - 1) / 2);

/**
 * Gets value at parent index of given index in given array.
 * @param {Array} array 
 * @param {Number} i 
 * @returns {any}
 */
const getParent = (array, i) => array[getParentIndex(i)];

/**
 * Checks parent index to make sure it is within an array.
 * Because a parent index can be any index 0 >= i > Floor(array.length / 2) - 1,
 * we do not need to pass in a length in addition to the index as we do for right and left children.
 * @param {Number} i 
 * @returns {Boolean}
 */
const hasParent = (i) => getParentIndex(i) >= 0;

/**
 * Calculates left child index using formula (2 * i) + 1.
 * @param {Number} i 
 * @returns {Number}
 */
const getLeftChildIndex = (i) => (2 * i) + 1;

/**
 * Gets value at left child index of given index in given array.
 * @param {Array} array 
 * @param {Number} i 
 * @returns {any}
 */
const getLeftChild = (array, i) => array[getLeftChildIndex(i)];

/**
 * Checks left child index to make sure it is within an array.
 * Because a left child can occur at any index 0 < i < array.length,
 * we provide the array's length in addition to the target index.
 * @param {Number} length length of array
 * @param {Number} i 
 * @returns {Boolean}
 */
const hasLeftChild = (length, i) => getLeftChildIndex(i) < length;
    
/**
 * Calculates right child index using formula (2 * i) + 2.
 * @param {Number} i 
 * @returns {Number}
 */
const getRightChildIndex = (i) => (2 * i) + 2;

/**
 * Gets value at right child index of given index in given array.
 * @param {Array} array 
 * @param {Number} i 
 * @returns {any}
 */
const getRightChild = (array, i) => array[getRightChildIndex(i)];

/**
 * Checks right child index to make sure it is within an array.
 * Because a right child can occur at any index 0 < i < array.length,
 * we provide the array's length in addition to the target index.
 * @param {Number} length 
 * @param {Number} i 
 * @returns {Boolean}
 */
const hasRightChild = (length, i) => getRightChildIndex(i) < length;

/**
 * Generic Heap
 * 
 * - heapify: applies the bottom-up heap construction algorithm 
 *      to the given array based on the given comparator.
 * - push: inserts value into array while preserving the maximum/minimum heap invariance.
 * - peek: returns the maximum/minimum element in the heap without removing it.
 *      Throws error if heap is empty.
 * - pop: removes and returns the maximum/minimum element in the heap.
 *      Throws error if heap is empty.
 */
export default {
    heapify: (array, comparator) => {
        const lastInternalIndex = Math.floor((array.length / 2)) - 1;
        for (let i = lastInternalIndex; i >= 0; i--) siftDown(array, i, comparator);
        return array;
    },
    push: (array, data, comparator) => {
        array.push(data);
        siftUp(array, comparator);
    },
    peek: (array) => {
        validateSize(array);
        return array[0];
    },
    pop: (array, comparator) => {
        validateSize(array);
        swap(array, 0, array.length - 1);
        const last = array.pop();
        siftDown(array, 0, comparator);
        return last;
    }
};