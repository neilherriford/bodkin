import AxisAlignedBoundingBox from '../axis_aligned_bounding_box/AxisAlignedBoundingBox';
import pm1Validator from './Pm1Validator';

describe('Pm1Validator', () => {
  test('should ignore empty polylines', () => {
    const givenBounds = new AxisAlignedBoundingBox([0, 0], 5);
    const givenLines = [];
    const actual = pm1Validator(givenBounds, givenLines);
    expect(actual).toBeTruthy();
  });

  test('should consider single segment lines wholy contained by the bounds', () => {
    const givenBounds = new AxisAlignedBoundingBox([0, 0], 5);
    const givenLines = [{head: [-1, -1], tail: [1, 1]}];
    const actual = pm1Validator(givenBounds, givenLines);
    expect(actual).toBeFalsy();
  });

  test.each([
    [[-10, 10], [0, 0]],
    [[0, 0], [10, 10]],
  ])(
    "Should include a single segment with one point wihtin the bounding box and one outside %p, %p",
    (givenHead, givenTail) => {
      let aabb = new AxisAlignedBoundingBox([0, 0], 5);

      const givenBounds = new AxisAlignedBoundingBox([0, 0], 5);
      const givenLines = [{head: givenHead, tail: givenTail}];
      const actual = pm1Validator(givenBounds, givenLines);
      expect(actual).toBeTruthy();
    });

  test('should consider non-concident lines as invalid', () => {
    const givenBounds = new AxisAlignedBoundingBox([0, 0], 5);
    const givenLines = [
      {head: [-1, -1], tail: [-10, 1]},
      {head: [0, 0], tail: [10, 0]},
    ];
    const actual = pm1Validator(givenBounds, givenLines);
    expect(actual).toBeFalsy();
  });

  test.each([
    [[{head: [-1, -1], tail: [-10, 1]}, {head: [-1, -1], tail: [1, 10]}]],
    [[{head: [-10, 1], tail: [-1, -1]}, {head: [1, 10], tail: [-1, -1]}]],
  ])(
    'should consider concident lines as valid %j', (givenLines) => {
    const givenBounds = new AxisAlignedBoundingBox([0, 0], 5);
    const actual = pm1Validator(givenBounds, givenLines);
    expect(actual).toBeTruthy();
  });

  test.each([
    [[{head: [-10, -10], tail: [-1, -1]}, {head: [-1, -1], tail: [1, 1]}]],
    [[{head: [-10, -10], tail: [-1, -1]}, {head: [1, 1], tail: [-1, -1]}]],
  ])(
    'should consider concident lines but contained by the bounding box as invalid %j',
    (givenLines) => {
      const givenBounds = new AxisAlignedBoundingBox([0, 0], 5);
      debugger;
      const actual = pm1Validator(givenBounds, givenLines);
      expect(actual).toBeFalsy();
    });
});
