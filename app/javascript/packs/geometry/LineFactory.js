let nextLineId = -1;
const LINES = {};

class LineFactory {
  static createLine(head, tail) {
    const id = ++nextLineId;
    const line =  {id: id, head: [...head], tail: [...tail]};
    LINES[id] = line;
    return line;
  }

  static getLineById(id) {
    return LINES[id];
  }

  static getLinesByIds(ids) {
    return ids.map((id) => LINES[id]);
  }
 }

export default LineFactory;
