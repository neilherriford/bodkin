const PRECISION = 0.00005;

/**
 * Returns true if two floating point numbers are equal within the provided
 * precision, false otherwise
 *
 * @param {number} left - The first number to check
 * @param {number} right - The second number to check
 * @param {number} [precision=0.00005] - The precision to use when comparing the
 * two values.
 * @return {boolean}
 *
 */
export const floatsEqual = (left, right, precision = PRECISION) => {
  return Math.abs(left - right) <= precision;
};

/**
 * Tests if the provided value is inclusively between 0 and 1 (wihtin the
 * provided precision).  Returns true if the value is within the bounds, false
 * otherwise.
 *
 * @param {number} value - The value to check
 * @param {number} [precision=0.00005] - The precision to use when comparing the
 * value against the bounds.
 * @return {boolean}
 *
 */
export const isWithinDomain = (test, precision = PRECISION) => {
  const atLeastZero =
    Math.abs(test) <= precision
    || test >= 0.0;

  const atMostOne =
    Math.abs(test - 1.0) <= precision
    || test <= 1.0;
  return atLeastZero && atMostOne;
};

/**
 * Hashes a given number.  Based off of https://stackoverflow.com/a/39515587
 * provided precision).  Returns true if the value is within the bounds, false
 * otherwise.
 *
 * @param {number} number - The value to hash
 * @return {integer}
 *
 */
export const hashDouble = (number) => {
  const buffer = new ArrayBuffer(8);
  const float64Array = new Float64Array(buffer);

  float64Array[0] = number;

  let result = 0;
  for(let word of Array.from(new Int32Array(buffer))) {
    result ^= word;
  }

  return result;
};
