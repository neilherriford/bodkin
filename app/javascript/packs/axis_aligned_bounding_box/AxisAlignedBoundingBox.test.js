import AxisAlignedBoundingBox, {OUTCODES} from './AxisAlignedBoundingBox';

describe('AxisAlignedBoundingBox tests', () => {
  test('it should compute the corners', () => {
    let aabb = new AxisAlignedBoundingBox([0, 0], 5);
    expect(aabb.nw).toStrictEqual([-5, -5]);
    expect(aabb.ne).toStrictEqual([5, -5]);
    expect(aabb.se).toStrictEqual([5, 5]);
    expect(aabb.sw).toStrictEqual([-5, 5]);
  });

  test.each([
    [[0, 0], OUTCODES.CONTAINED],
    [[0, -10], OUTCODES.ABOVE],
    [[0, 10], OUTCODES.BELOW],
    [[-10, 0], OUTCODES.LEFT],
    [[10, 0], OUTCODES.RIGHT],
    [[-10, -10], OUTCODES.LEFT | OUTCODES.ABOVE],
    [[10, -10], OUTCODES.RIGHT | OUTCODES.ABOVE],
    [[10, 10], OUTCODES.RIGHT | OUTCODES.BELOW],
    [[-10, 10], OUTCODES.LEFT | OUTCODES.BELOW]
  ])(
    "Should code correctly #%#",
    (givenPoint, expected) => {
      let aabb = new AxisAlignedBoundingBox([0, 0], 5);
      expect(aabb.code(givenPoint)).toEqual(expected);
    });

  test('it should clip an intersecting line, with the first point outside, the second contained.', () => {
    let aabb = new AxisAlignedBoundingBox([0, 0], 5);
    let line = {head: [0, -10], tail: [0, 0]};
    expect(aabb.clipLine(line)).toEqual(expect.objectContaining({
      head: [0, -5],
      tail: [0, 0]}));
  });


  test('it should clip an intersecting line, with the first point contained, the second outside.', () => {
    let aabb = new AxisAlignedBoundingBox([0, 0], 5);
    let line = {head: [0, 0], tail: [0, 10]};
    expect(aabb.clipLine(line)).toEqual(expect.objectContaining({
      head: [0, 0],
      tail: [0, 5]}));
  });

  test('it should clip an intersecting line, with both points contained.', () => {
    let aabb = new AxisAlignedBoundingBox([0, 0], 5);
    let line = {head: [-1, -1], tail: [1, 1]};
    expect(aabb.clipLine(line)).toEqual(expect.objectContaining({
      head: [-1, -1],
      tail: [1, 1]}));
  });
});
