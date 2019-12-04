import LineFactory from '../geometry/LineFactory';

export const OUTCODES = {
  ABOVE: 1<<3,
  BELOW: 1<<2,
  RIGHT: 1<<1,
  LEFT: 1<<0,
  CONTAINED: 0
};

class AxisAlignedBoundingBox {
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

  containsPoint(point) {
    return this.code(point) === OUTCODES.CONTAINED;
  }

  containsLine(line) {
    return this.clipLine(line) !== null;
  }

  clipPolyline(polyline) {
    const result = [];
    for(let segment of polyline) {
      let clipped = this.clipLine(segment);
      if(clipped === null) continue;
      result.push(clipped);
    }
    return result;
  }

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
