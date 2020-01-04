export const EQ = Symbol('EQ');
export const LESS_THAN = Symbol('LESS_THAN');
export const GREATER_THAN = Symbol('GREATER_THAN');

export const defaultComparer = (left, right) => {
  if(left === right) return EQ;
  return left > right ? GREATER_THAN : LESS_THAN;
};

