export const QUADRANT_TYPE = {
  WHITE: Symbol('WHITE'),
  GRAY: Symbol('GRAY'),
  BLACK: Symbol('BLACK')
};

let nextQuadrantId = -1;

class Quadrant {
  constructor(bounds, validator) {
    this.id = ++nextQuadrantId;
    this.bounds = bounds;
    this.point = null;
    this.qedges = null;

    this.nw = null;
    this.ne = null;
    this.se = null;
    this.sw = null;
    this.type = QUADRANT_TYPE.WHITE;
    this.lineIds = {};
    this.isValid = validator;
  }

  children() {
    return this.type === QUADRANT_TYPE.GRAY
      ? [this.nw, this.ne, this.se, this.sw]
      : [];
  }

  lines() {
    return Geometry.getLinesByIds(Object.getOwnPropertyNames(this.lineIds));
  }

  add(polyline) {
    const lines = [];
    const proposed = [...this.lines()];
;
    let canAddLines = false;

    for(let line of polyline) {
      if(!this.bounds.containsLine(line)) continue;
      canAddLines = true;
      lines.push(line);
      proposed.push(line);
    }

    if(!canAddLines) return;

    if(this.type === QUADRANT_TYPE.WHITE) {
      if(this.isValid(this.bounds, proposed)) {
        this.lineIds = Object.fromEntries(proposed.map((line) => [line.id, true]));
        this.type = QUADRANT_TYPE.BLACK;
        return;
      }
      this.split();
    }
    this.type = QUADRANT_TYPE.GRAY;
    for(let child of this.children()) {
      child.add(lines);
    }
  }

  remove(line) {
    if(this.type === QUADRANT_TYPE.WHITE) return;

    const isPertinent = this.hasLine(line) || this.bounds.containsLine(line);
    if(!isPertinent) return;

    if(this.type === QUADRANT_TYPE.BLACK) {
      delete this.lineIds[line.id];
      if(Object.getOwnPropertyNames(this.lineIds).length === 0) {
        this.type = QUADRANT_TYPE.WHITE;
      }
      return;
    }

    for(let child of this.children()) {
      child.remove(line);
    }

    if(this.canMerge()) {
      const bufferLineIds = {};
      if(this.merge(this, bufferLineIds)) {
        this.lineIds = bufferLineIds;
        this.nw = null;
        this.ne = null;
        this.se = null;
        this.sw = null;
        this.type = QUADRANT_TYPE.BLACK;
      }
    }
  }

  canMerge() {
    let result = false;
    for(let child of this.children()) {
      if(child.type === QUADRANT_TYPE.WHITE) return true;
    }
    return result;
  }

  merge(root, lineList) {
    if(this.type === QUADRANT_TYPE.WHITE) return true;

    if(this.type === QUADRANT_TYPE.BLACK) {
      Object.assign(lineList, this.lineIds);
      return true;
    }

    for(let child of this.children()) {
      if(!child.merge(root, lineList)) return false;
    }

    return this.isValid(
        root.bounds,
        Geometry.getLinesByIds(Object.getOwnPropertyNames(lineList)));
  }

  split() {
    this.type = QUADRANT_TYPE.GRAY;
    const quarterWidth = this.bounds.halfWidth / 2;
    let [x, y] = this.bounds.nw;

    this.nw = new Quadrant(
      new AxisAlignedBoundingBox([x + quarterWidth, y + quarterWidth], quarterWidth),
      this.isValid
    );
    [x, y] = this.bounds.ne;
    this.ne = new Quadrant(
      new AxisAlignedBoundingBox([x - quarterWidth, y + quarterWidth], quarterWidth),
      this.isValid
    );
    [x, y] = this.bounds.se;
    this.se = new Quadrant(
      new AxisAlignedBoundingBox([x - quarterWidth, y - quarterWidth], quarterWidth),
      this.isValid
    );
    [x, y] = this.bounds.sw;
    this.sw = new Quadrant(
      new AxisAlignedBoundingBox([x + quarterWidth, y - quarterWidth], quarterWidth),
      this.isValid
    );
  }

  hasLine(line) {
    return this.lineIds[line.id] !== undefined;
  }
}

export default Quadrant;
