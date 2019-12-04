import {subtract as subtractPoints, dotProduct} from '../geometry/Point';
import {isWithinDomain} from '../geometry/MathEx';

/**
 * Class representing a 2d triangle
 */
class Triangle {
  constructor(pointA, pointB, pointC) {
    this.pointA = pointA;
    this.pointB = pointB;
    this.pointC = pointC;
  }

  /**
   * Converts the provided cartesian point into a barycentric triple, relative
   * to the points defining this triangle.
   *
   * @param {number[]} point - The point to convert
   * @return {number[]}
   *
   */
  toBarycentric(point) {
    const v0 = subtractPoints(this.pointB, this.pointA);
    const v1 = subtractPoints(this.pointC, this.pointA);
    const v2 = subtractPoints(point,       this.pointA);
    const d00 = dotProduct(v0, v0);
    const d01 = dotProduct(v0, v1);
    const d11 = dotProduct(v1, v1);
    const d20 = dotProduct(v2, v0);
    const d21 = dotProduct(v2, v1);
    const inversedDenominator = 1.0 / (d00 * d11 - d01 * d01);

    const v = (d11 * d20 - d01 * d21) * inversedDenominator;
    const w = (d00 * d21 - d01 * d20) * inversedDenominator;
    const u = 1.0 - v - w;

    return [u, v, w];
  }

  /**
   * Converts a barycentric triple into cartesian coordinates realitive to the
   * points defining this triangle..
   *
   * @param {number[]} barycentric - The Barycentric point to convert
   * @return {number[]}
   *
   */
  toCartesian(barycentric) {
    return [
      barycentric[0] * this.pointA[0]
      + barycentric[1] * this.pointB[0]
      + barycentric[2] * this.pointC[0],
      barycentric[0] * this.pointA[1]
      + barycentric[1] * this.pointB[1]
      + barycentric[2] * this.pointC[1]
    ];
  }

  /**
   * Tests if the provided point is within the triangle, inclusively.  Returns
   * true if the point is contained, false otherwise.
   *
   * @param {number[]} point - The point to test
   * @return {boolean}
   *
   */
  contains(point) {
    const [u, v, w] = this.toBarycentric(point);
    const result =
      isWithinDomain(u)
      && isWithinDomain(v)
      && isWithinDomain(w);
    return result;
  }
}

export default Triangle;
