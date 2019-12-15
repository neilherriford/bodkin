export const createNop = () => {
  return [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ];
};

export const createTranslation = (x, y) => {
  return [
    1, 0, x,
    0, 1, y,
    0, 0, 1
  ];
};

export const createScale = (x, y) => {
  return [
    x, 0, 0,
    0, y, 0,
    0, 0, 1
  ];
};

export const createRotation = (radians) => {
  const cosTheta = Math.cos(radians);
  const sinTheta = Math.sin(radians);

  return [
    cosTheta,      sinTheta, 0,
    -1 * sinTheta, cosTheta, 0,
    0,             0,        1
  ];
};

export const createShear = (radiansX, radiansY) => {
  return [
    1,                  Math.tan(radiansX), 0,
    Math.tan(radiansY), 1,                  0,
    0,                  0,                  1
  ];
};

export const createReflection = (x, y) => {
  return [
    x ? -1 : 1, 0,         0,
    0,          y ? -1: 1, 0,
    0,          0,         1
  ];
};

export const combine = (left, right) => {
  const [a0, a1, a2, a3, a4, a5, a6, a7, a8] = left;
  const [b0, b1, b2, b3, b4, b5, b6, b7, b8] = right;

  return [
    a0 * b0 + a1 * b3 + a2 * b6,
    a0 * b1 + a1 * b4 + a2 * b7,
    a0 * b2 + a1 * b5 + a2 * b8,

    a3 * b0 + a4 * b3 + a5 * b6,
    a3 * b1 + a4 * b4 + a5 * b7,
    a3 * b2 + a4 * b5 + a5 * b8,

    a6 * b0 + a7 * b3 + a8 * b6,
    a6 * b1 + a7 * b4 + a8 * b7,
    a6 * b2 + a7 * b5 + a8 * b8
  ];
};

export const build = (...transforms) => {

  return (point) => {
    let [x, y] = point;

    for(let transform of transforms) {
      let  [a0, a1, a2, a3, a4, a5] = transform;
      x = a0 * x + a1 * y + a2;
      y = a3 * x + a4 * y + a5;
    }

    return [x, y];
  };
};
