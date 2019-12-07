import NonAxisAlignedBoundingBox from './NonAxisAlignedBoundingBox';

describe('NonAxisAlignedBoundingBox', () => {
  test.each([
    [[10, 0], [10, 10]],
    [[10, 10], [10, 0]]
  ])(
    'should create a vertically aligned bounding region between %j and %j',
    (start, end) => {
      let box = new NonAxisAlignedBoundingBox(start, end, 5);
      expect(box.nw).toEqual([5, 0]);
      expect(box.ne).toEqual([15, 0]);
      expect(box.se).toEqual([15, 10]);
      expect(box.sw).toEqual([5, 10]);
    });

  test.each([
    [[10, 10], [20, 10]],
    [[20, 10], [10, 10]]
  ])(
    'should create a horizontally aligned bounding region between %j and %j',
    (start, end) => {
      let box = new NonAxisAlignedBoundingBox(start, end, 5);
      expect(box.nw).toEqual([10, 5]);
      expect(box.ne).toEqual([20, 5]);
      expect(box.se).toEqual([20, 15]);
      expect(box.sw).toEqual([10, 15]);
    });

  test.each([
    [[10, 10], [20, 20]],
    [[20, 20], [10, 10]]
  ])(
    'should create a diagonal bounding region between %j and %j',
    (start, end) => {
      const halfWidth = Math.sqrt(2);

      let box = new NonAxisAlignedBoundingBox(start, end, halfWidth);
      expect(box.nw).toEqual([9, 11]);
      expect(box.ne).toEqual([11, 9]);
      expect(box.se).toEqual([21, 19]);
      expect(box.sw).toEqual([19, 21]);
    });

  test.each([
    [[10, 5], true],  // center
    [[5, 0], true],   // nw
    [[15, 0], true],  // ne
    [[15, 10], true], // se
    [[5, 10], true],  // sw
    [[4, 5], false]   // outside
  ])(
    'should find point %j contained as %j in vertically aligned region',
    (point, expected) => {
      let box = new NonAxisAlignedBoundingBox([10, 0], [10, 10], 5);
      expect(box.contains(point)).toEqual(expected);
    });

  test.each([
    [[15, 10], true], // center
    [[10, 5], true],  // nw
    [[20, 5], true],  // ne
    [[20, 15], true], // se
    [[10, 15], true], // sw
    [[4, 10], false]  // outside
  ])(
    'should find point %j contained as %j in horizontally aligned region',
    (point, expected) => {
      let box = new NonAxisAlignedBoundingBox([10, 10], [20, 10], 5);
      expect(box.contains(point)).toEqual(expected);
    });

  test.each([
    [[15, 15], true], // center
    [[9, 11], true],  // nw
    [[11, 9], true],  // ne
    [[21, 19], true], // se
    [[19, 21], true], // sw
    [[5, 5], false]   // outside
  ])(
    'should find point %j contained as %j in horizontally aligned region',
    (point, expected) => {
      const halfWidth = Math.sqrt(2);
      let box = new NonAxisAlignedBoundingBox([10, 10], [20, 20], halfWidth);
      expect(box.contains(point)).toEqual(expected);
    });
});
