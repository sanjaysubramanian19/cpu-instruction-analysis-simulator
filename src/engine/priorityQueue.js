/**
 * Common Engine: Binary Min-Heap Priority Queue
 * Academic Reference:
 *   - DAA Module 1.3: Asymptotic Analysis and Amortized Complexity (O(log V) operations)
 *   - DAA Module 3.1: Introduction to Greedy Algorithms
 *   - AI/ML Module 2.7: A* Search Fundamentals (Open Set Management)
 *
 * Implemented strictly from scratch without third-party libraries.
 */

export class PriorityQueue {
  constructor() {
    this.heap = [];
    // Fast item lookup map: itemKey -> index in this.heap
    this.itemMap = new Map();
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  contains(key) {
    return this.itemMap.has(key);
  }

  getPriority(key) {
    const idx = this.itemMap.get(key);
    return idx !== undefined ? this.heap[idx].priority : Infinity;
  }

  /**
   * Inserts an element into the min-heap.
   * Time Complexity: O(log N)
   * @param {string|number|Object} key - Unique identifier
   * @param {number} priority - Priority value (lower is higher priority)
   * @param {any} data - Auxiliary payload
   */
  insert(key, priority, data = null) {
    if (this.contains(key)) {
      this.decreaseKey(key, priority, data);
      return;
    }

    const node = { key, priority, data };
    this.heap.push(node);
    const index = this.heap.length - 1;
    this.itemMap.set(key, index);
    this._bubbleUp(index);
  }

  /**
   * Extracts and returns the minimum priority node.
   * Time Complexity: O(log N)
   * @returns {{ key: any, priority: number, data: any } | null}
   */
  extractMin() {
    if (this.heap.length === 0) return null;

    const min = this.heap[0];
    const end = this.heap.pop();
    this.itemMap.delete(min.key);

    if (this.heap.length > 0 && end) {
      this.heap[0] = end;
      this.itemMap.set(end.key, 0);
      this._sinkDown(0);
    }

    return min;
  }

  /**
   * Decreases the priority of an existing node.
   * Time Complexity: O(log N)
   */
  decreaseKey(key, newPriority, newData = null) {
    const idx = this.itemMap.get(key);
    if (idx === undefined) return;

    if (newPriority < this.heap[idx].priority) {
      this.heap[idx].priority = newPriority;
      if (newData !== null) this.heap[idx].data = newData;
      this._bubbleUp(idx);
    }
  }

  _bubbleUp(index) {
    const element = this.heap[index];

    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIdx];

      if (element.priority >= parent.priority) break;

      // Swap
      this.heap[index] = parent;
      this.heap[parentIdx] = element;
      this.itemMap.set(parent.key, index);
      this.itemMap.set(element.key, parentIdx);

      index = parentIdx;
    }
  }

  _sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let leftChildIdx = 2 * index + 1;
      let rightChildIdx = 2 * index + 2;
      let swapIdx = null;

      if (leftChildIdx < length) {
        if (this.heap[leftChildIdx].priority < element.priority) {
          swapIdx = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        if (
          (swapIdx === null && this.heap[rightChildIdx].priority < element.priority) ||
          (swapIdx !== null && this.heap[rightChildIdx].priority < this.heap[leftChildIdx].priority)
        ) {
          swapIdx = rightChildIdx;
        }
      }

      if (swapIdx === null) break;

      // Swap
      const child = this.heap[swapIdx];
      this.heap[index] = child;
      this.heap[swapIdx] = element;
      this.itemMap.set(child.key, index);
      this.itemMap.set(element.key, swapIdx);

      index = swapIdx;
    }
  }

  /**
   * Returns a snapshot array of all entries in the heap (for visualization).
   */
  toArray() {
    return [...this.heap];
  }
}
