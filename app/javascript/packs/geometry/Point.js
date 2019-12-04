import {hashDouble, floatsEqual} from './MathEx';

/**
 * Returns the difference of two points
 *
 * @param {number[]} left - The subtrahend
 * @param {number[]} right - The minuend
 * two values.
 * @return {number[]}
 *
 */
export const subtract = (left, right) => {
  return [
    left[0] - right[0],
    left[1] - right[1]
  ];
};


export const dotProduct = (left, right) => {
  return (left[0] * right[0]) + (left[1] * right[1]);
};

/**
 * Returns a new offset point from the provided offsetX and offsetY values.
 *
 * @param {number} [offsetX=0] - The X offset
 * @param {number} [offsetY=0] - The Y offset
 * two values.
 * @return {number[]}
 *
 */
export const offset = (point, offsetX = 0, offsetY = 0) => {
  return [point[0] + offsetX, point[1] + offsetY];
};


/**
 * Tests if two points are equal within the default precision.  Returns true if
 * the points are equal, false otherwise.
 *
 * @param {number[]} left - The first point
 * @param {number[]} right - The second point
 * two values.
 * @return {boolean}
 *
 */
export const equal = (left, right) => {
  return floatsEqual(left[0], right[0]) && floatsEqual(left[1], right[1]);
};

/**
 * Generates a hash value based on the X and Y components of the point
 * @param {number[]} point - The 2d point to hash
 *
 * @return {number[]}
 *
 */
export const hash = (point) => {
    let result = hashDouble(head[0]);
    result ^= hashDouble(head[1]);
    result ^= hashDouble(tail[0]);
    result ^= hashDouble(tail[1]);
    return result;
};
