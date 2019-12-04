import {equal as pointsEqual} from '../geometry/Point';

const pm1Validator = (bounds, lines) => {
  if(lines.length === 0) return true;

  const first = lines[0];
  const containsHead = bounds.containsPoint(first.head);
  const containsTail = bounds.containsPoint(first.tail);

  if(lines.length === 1) return !(containsHead && containsTail);

  const point = containsHead ? first.head : first.tail;

  for(let index = 1; index < lines.length; ++index) {
    const next = lines[index];
    const isCoincidentWithHead = pointsEqual(point, next.head);
    const isCoincidentWithTail = pointsEqual(point, next.tail);

    if(!isCoincidentWithHead && !isCoincidentWithTail) {
      return false;
    }

    if(isCoincidentWithHead && bounds.containsPoint(next.tail)) return false;
    if(isCoincidentWithTail && bounds.containsPoint(next.head)) return false;
  }
  return true;
};

export default pm1Validator;
