import Triangle from '../geometry/Triangle';

/**
 * Creates a special case region when the start and end points share the same
 * horizontal value.
 * @param  {number} x         The fixed X coordinate
 * @param  {number} startY    The Y value of the first endpoint
 * @param  {number} endY      The Y value of the second endpoint
 * @param  {number} halfWidth The half width of the bounding region
 * @return {number[]}         The edge points of the region, in clockwise order
 *                            starting with the northwest point
 */
const createVerticalBox = (x, startY, endY, halfWidth) => {
  const north = Math.min(startY, endY);
  const south = Math.max(startY, endY);

  return [
    [x - halfWidth, north], // NW
    [x + halfWidth, north], // NE
    [x + halfWidth, south], // SE
    [x - halfWidth, south]  // SW
  ];
};

/**
 * Creates a special case region when the start and end points share the same
 * vertical value.
 * @param  {number} y         The fixed Y coordinate
 * @param  {number} startX    The X value of the first endpoint
 * @param  {number} endX      The X value of the second endpoint
 * @param  {number} halfWidth The half width of the bounding region
 * @return {number[]}         The edge points of the region, in clockwise order
 *                            starting with the northwest point
 */
const createHorizontalBox = (y, startX, endX, halfWidth) => {
  const west = Math.min(startX, endX);
  const east = Math.max(startX, endX);

  return [
    [west, y - halfWidth], // NW
    [east, y - halfWidth], // NE
    [east, y + halfWidth], // SE
    [west, y + halfWidth]  // SW
  ];
};

/**
 * Given an end point of the center line, this function calculates the two
 * corner points of the bounding region.
 * E.g. given this centerline with selected endpoint:
 *
 *     ●──────
 *
 * This function would calculate the position of the two corner points:
 *     ◯
 *     ●──────
 *     ◯
 *
 * Based on the inverse slope and offset from the half width.
 *
 * @param  {number[]} point            The end point of the center line
 * @param  {number} k                  The slope offset
 * @param  {number} perpendicularSlope The inverse of the slope of the defining
 *                                     center line
 * @return {number[]}                  The two new end points of the region
 */
const createBoxPointsRealitiveTo = (point, k, perpendicularSlope) => {
    return [
      [point[0] - k, point[1] + (-1 * k * perpendicularSlope)],
      [point[0] + k, point[1] + k * perpendicularSlope],
    ];
};

/**
 * Creates a diagonal bounding region containing the line defined by the start
 * and end points.
 * @param  {number[]} start   The first end point of the center line
 * @param  {number[]} end     The second end point of the center line
 * @param  {number} halfWidth The half width of the bounding region
 * @return {number[]}         The edge points of the region, in clockwise order
 *                            starting with the northwest point
 */
const createDiagonalBox = (start, end, halfWidth) => {
  const slope = (end[1] - start[1]) / (end[0] - start[0]);

  const perpendicularSlope = (-1)  * (1 / slope);
  const k = halfWidth / Math.sqrt(1 + perpendicularSlope * perpendicularSlope);
  let north, south;
  if(start[1] < end[1]) {
    north = start;
    south = end;
  } else {
    north = end;
    south = start;
  }

  const northPoints = createBoxPointsRealitiveTo(north, k, perpendicularSlope);
  const southPoints = createBoxPointsRealitiveTo(south, k, perpendicularSlope);

  return [
    northPoints[0], // NW
    northPoints[1], // NE
    southPoints[1], // SE
    southPoints[0]  // SW
  ];
};

/**
 * Creates the corner points for a bounding region defined by the provided
 * center line and half width.
 * @param  {number[]} start   The start point of the center line
 * @param  {number[]} end     The end point of the center line
 * @param  {number} halfWidth The half width of the new bounding region
 * @return {number[]}         The corner points of the new bounding region in
 *                            clockwise order starting from NW
 */
const createBox = (start, end, halfWidth) => {
  if(start[0] === end[0]){
    return createVerticalBox(start[0], start[1], end[1], halfWidth);
  } else if(start[1] === end[1]) {
    return createHorizontalBox(start[1], start[0], end[0], halfWidth);
  } else {
    return createDiagonalBox(start, end, halfWidth);
  }
};

/**
 * Creates a bounding region based on the provided line and half width.  The
 * resultant region may not be axis aligned.
 */
class NonAxisAlignedBoundingBox {
  /**
   * [constructor description]
   * @param  {number[]} start - The head of the line defining this region
   * @param  {number[]} end - The tail of the line defining this region
   * @param  {number} halfWidth - Half the width of rectangle.
   */
  constructor(start, end, halfWidth) {
    this.start = start;
    this.end = end;
    this.halfWidth = halfWidth;
    [this.nw, this.ne, this.se, this.sw] = createBox(start, end, halfWidth);

    this.triangles = [
      new Triangle(this.nw, this.ne, this.se),
      new Triangle(this.nw, this.sw, this.se)
    ];
  }

  /**
   * Tests if the provided point is contained by the bounding region.  Returns
   * true if contained, false otherwise.
   * @param  {number[]} point - The point to test
   * @return {boolean}       Returns true if the provided point is contained
   *                         by the region, false otherwise
   */
  contains(point) {
    for(var triangle of this.triangles) {
      if(triangle.contains(point)) {
        return true;
      }
    }
    return false;
  }
}

export default NonAxisAlignedBoundingBox;
