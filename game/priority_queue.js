class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(element) {
    this.heap.push(element);
    this._heapifyUp();
  }

  dequeue() {
    if (this.heap.length === 0) return null;

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._heapifyDown();
    return min;
  }

  _heapifyUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].points < this.heap[parentIndex].points) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  _heapifyDown() {
    let index = 0;
    const length = this.heap.length;
    const element = this.heap[0];

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallestChildIndex = null;
      let smallestChildValue = null;

      if (leftChildIndex < length) {
        smallestChildIndex = leftChildIndex;
        smallestChildValue = this.heap[leftChildIndex].points;
      }

      if (rightChildIndex < length && this.heap[rightChildIndex].points < smallestChildValue) {
        smallestChildIndex = rightChildIndex;
        smallestChildValue = this.heap[rightChildIndex].points;
      }

      if (smallestChildIndex === null || element.points <= smallestChildValue) {
        break;
      }

      this.heap[index] = this.heap[smallestChildIndex];
      this.heap[smallestChildIndex] = element;
      index = smallestChildIndex;
    }
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }
}


