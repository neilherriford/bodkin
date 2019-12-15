import Heap from './Heap';
const isHigherPriority = (l, r) => l > r;

describe('MaxHeap', () => {
  test('should add an element', () => {
    const heap = new Heap(isHigherPriority);
    heap.push(5);
    expect(heap.peek()).toEqual(5);
  });

  test('should add an element with a higher priority', () => {
    const heap = new Heap(isHigherPriority);
    heap.push(5);
    heap.push(10);
    expect(heap.peek()).toEqual(10);
  });

  test('should add an element with a lower priority', () => {
    const heap = new Heap(isHigherPriority);
    heap.push(5);
    heap.push(1);

    expect(heap.peek()).toEqual(5);
  });

  test('should pop the highest priorty element', () => {
    const heap = new Heap(isHigherPriority);
    for(let i = 0; i < 5; ++i) {
      heap.push(i);
    }

    for(let i = 4; i >= 0; --i) {
      expect(heap.pop()).toEqual(i);
    }
  });

  test('should throw when peeking if empty', () => {
    const heap = new Heap(isHigherPriority);

    expect(() => heap.peak()).toThrow();
  });

  test('should throw when popping if empty', () => {
    const heap = new Heap(isHigherPriority);

    expect(() => heap.pop()).toThrow();
  });
});

