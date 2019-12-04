import * as MathEx from './MathEx';

describe('MathEx', () => {
  test.each([
    [1, -1, false],
    [1, 1, true],
    [1, 1.01, true],
    [1, 1.11, false],
  ])(
    "Should consider %p = %p as %p when the precision is 0.1",
    (left, right, expected) => {
      let actual = MathEx.floatsEqual(left, right, 0.1);
      expect(actual).toEqual(expected);
    });

  test.each([
    [0, true],
    [1, true],
    [1.01, true],
    [-0.01, true],
    [1.11, false],
    [-0.11, false],
  ])(
    "Should consider %p to be within the domain of 0..1 as %p when the precision is 0.1",
    (value, expected) => {
      let actual = MathEx.isWithinDomain(value, 0.1);
      expect(actual).toEqual(expected);
    });


});
