const parentOf = (index) => Math.ceil(index / 2) - 1;

const swap = (data, source, dest) => {
  const buffer = data[dest];
  data[dest] = data[source];
  data[source] = buffer;
};

const heapify = (data, index, isHigherPriority) => {
  const leftIndex = (index * 2) + 1;
  const rightIndex = (index * 2) + 2;
  let largest = index;

  if(leftIndex < data.length && isHigherPriority(leftIndex, index)) {
    largest = leftIndex;
  }

  if(rightIndex < data.length && isHigherPriority(rightIndex, index)) {
    largest = rightIndex;
  }

  if(largest !== index) {
    swap(data, index, largest);
    heapify(data, largest, isHigherPriority);
  }
};

class MaxHeap {
  constructor(isHigherPriority) {
    this.data = [];
    this.isHigherPriority = (leftIndex, rightIndex) =>
      isHigherPriority(this.data[leftIndex], this.data[rightIndex]);
  }

  count() {
    return this.data.length;
  }

  peek() {
    if(this.data.length === 0) throw 'Empty heap';
    return this.data[0];
  }

  push(value) {
    let index = this.data.length;
    this.data.push(value);
    while(index > 0) {
      let parentIndex = parentOf(index);
      if(this.isHigherPriority(parentIndex, index)) break;
      swap(this.data, index, parentIndex);
      index = parentIndex;
    }
  }

  pop() {
    if(this.data.length === 0) throw 'Empty heap';
    if(this.data.length === 1) return this.data.pop();
    let result = this.data.shift();
    heapify(this.data, 0, this.isHigherPriority);
    return result;
  }
}

export default MaxHeap;
