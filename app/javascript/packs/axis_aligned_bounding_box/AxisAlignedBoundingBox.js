import LineFactory from '../geometry/LineFactory';

/**
 * Binary code representing the relative location of a point with
 * regards to this region.
 */
export const OUTCODES = {
  ABOVE: 1<<3,
  BELOW: 1<<2,
  RIGHT: 1<<1,
  LEFT: 1<<0,
  CONTAINED: 0
};

/**
 * Represents a square bounding region based on a center point and a half width.
 * Allows testing of points, and cliping line segments.  The extents of the
 * region are always aligned with the axis and is square by definition
 */
class AxisAlignedBoundingBox {
  /**
   * @param  {number[]} center  The center of this bounding region
   * @param  {number} halfWidth The half width of this region
   */
  constructor(center, halfWidth) {
    this.center = center;
    const [x, y] = center;
    this.halfWidth = halfWidth;
    this.n = y - halfWidth;
    this.s = y + halfWidth;
    this.w = x - halfWidth;
    this.e = x + halfWidth;

    this.nw = [this.w, this.n];
    this.ne = [this.e, this.n];
    this.se = [this.e, this.s];
    this.sw = [this.w, this.s];
  }

  /**
   * Tests if a point is within the region.  Returns true if the provided point
   * is contained by the bounds of this region, false otheriwse.  The bounds
   * are inclusive
   * @param  {number[]} point The point to test.
   * @return {boolean}        True if the point is contained by the bounds,
   *                          false otherwise.
   */
  containsPoint(point) {
    return this.code(point) === OUTCODES.CONTAINED;
  }

  /**
   * Tests if a line segment is at least partially contained by this bounding
   * region.  Returns true if the line is cliped by the bounds, false otherwise
   * @param  {number[]} line The line to test
   * @return {boolean}       Returns true if part of the line is contained by
   *                         the bounding region, false otherwise.
   */
  containsLine(line) {
    return this.clipLine(line) !== null;
  }

  /**
   * Given a polyline, returns the line segments that are at least partially
   * contained by the bounding region clipped to it's extents..  May be an empty
   * array if no segements are contained.
   * @param  {number[]} polyline The polyline to test
   * @return {number[]}          The line segments that are contained within
   *                             this bounding region
   */
  clipPolyline(polyline) {
    const result = [];
    for(let segment of polyline) {
      let clipped = this.clipLine(segment);
      if(clipped === null) continue;
      result.push(clipped);
    }
    return result;
  }

  /**
   * Given a line, returns the line clipped to the extents of this bounding
   * region or null if the line is not at least partially within the bounding
   * region.
   * @param  {number[]} line The line to clip
   * @return {number[]}      The line clipped to the extents of the bounding
   *                         region.  If the line does not lie at least
   *                         partially within the region, null is returned.
   */
  clipLine(line) {
    let head = [...line.head];
    let tail = [...line.tail];

    while(true) {
      let headCode = this.code(head);
      let tailCode = this.code(tail);

      if(headCode === OUTCODES.CONTAINED && tailCode === OUTCODES.CONTAINED) {
        return LineFactory.createLine(head, tail);
      }
      if(headCode & tailCode) return null;

      let [x0, y0] = head;
      let [x1, y1] = tail;
      let outside;
      let code;

      if(headCode === OUTCODES.CONTAINED) {
        outside = tail;
        code = tailCode;
      } else {
        outside = head;
        code = headCode;
      }

      if(code & OUTCODES.ABOVE) {
        outside[0] = x0 + (((x1 - x0) * (this.n - y0)) / (y1 - y0));
        outside[1] = this.n;
      } else if (code & OUTCODES.BELOW) {
        outside[0] = x0 + (((x1 - x0) * (this.s - y0)) / (y1 - y0));
        outside[1] = this.s;
      } else if (code & OUTCODES.RIGHT) {
        outside[0] = this.e;
        outside[1] = y0 + (((y1-y0) * (this.e - x0)) / (x1 - x0));
      } else if (code & OUTCODES.LEFT) {
        outside[0] = this.w;
        outside[1] = y0 + (((y1-y0) * (this.w - x0)) / (x1 - x0));
      }
    }

    return LineFactory.createLine(head, tail);
  }

  /**
   * Generate the out code for a given point.  Allows for quick testing if a
   * line can be trivially determined to be outside the bounds
   * @param  {number[]} point The point to test
   * @return {number}         The enum value defined by OUTCODES
   */
  code(point) {
    const [x,y] = point;

    let result = OUTCODES.CONTAINED;

    if(y < this.n) result |= OUTCODES.ABOVE;
    if(y > this.s) result |= OUTCODES.BELOW;
    if(x < this.w) result |= OUTCODES.LEFT;
    if(x > this.e) result |= OUTCODES.RIGHT;

    return result;
  }
}

export default AxisAlignedBoundingBox;
