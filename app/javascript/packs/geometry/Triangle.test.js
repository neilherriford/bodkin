import Triangle from './Triangle';

const TRIANGLE_POINTS = [
  [0, 0],
  [0, 1],
  [1, 0]
];

describe('Triangle', () => {
  test.each([
    [[0, 0], true],
    [[0, 1], true],
    [[1, 0], true],
    [[0.5, 0.5], true],
    [[1, 1], false],
  ])(
    `Should consider %j as within the triangle ${TRIANGLE_POINTS}`,
    (point, expected) => {
      const triangle = new Triangle(...TRIANGLE_POINTS);
      expect(triangle.contains(point)).toEqual(expected);
    });
});
