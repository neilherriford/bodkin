let nextLineId = -1;
const LINES = {};

class Geometry {
  static  hashDouble(number) {
      const buffer = new ArrayBuffer(8);
      const float64Array = new Float64Array(buffer);

      float64Array[0] = number;

      let result = 0;
      for(let word of Array.from(new Int32Array(buffer))) {
          result ^= word;
      }

      return result;
  }

  static offsetPoint(point, deltaX = 0, deltaY = 0) {
    return [point[0] + deltaX, point[1] + deltaY];
  }

  static floatsEqual(left, right) {
    const precision = 0.0001;
    return Math.abs(Math.abs(left) - Math.abs(right)) <= precision;
  }

  static pointsEqual(left, right) {
    return Geometry.floatsEqual(left[0], right[0]) && Geometry.floatsEqual(left[1], right[1]);
  }

  static createLine(head, tail, label=null) {
    // let id = hashDouble(head[0]);
    // id ^= hashDouble(head[1]);
    // id ^= hashDouble(tail[0]);
    // id ^= hashDouble(tail[1]);
    const id = ++nextLineId;
    const line =  {id: id, head: [...head], tail: [...tail], label: label};
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

export default Geometry;
