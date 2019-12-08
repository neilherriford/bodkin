import {equal as pointsEqual} from './Point';
let nextLineId = -1;
const LINES = {};

class LineFactory {
  static createLine(head, tail) {
    const id = ++nextLineId;
    const line =  {id: id, head: [...head], tail: [...tail]};
    LINES[id] = line;
    return line;
  }

  static destructurePolyline(polyline) {
    if(polyline === null) return [];
    if(polyline.length === 0) return [];

    const result = [
      polyline[0].head,
      polyline[0].tail
    ];

    for(let i = 1; i < polyline.length; ++i) {
      let current = polyline[i];
      let previous = result[result.length - 1];

      if(!pointsEqual(previous, current.head)) result.push(current.head);
      if(!pointsEqual(previous, current.tail)) result.push(current.tail);
    }

    return result;
  }

  static createPolyline(points) {
    if(points === null) return null;
    if(points.length === 1) return [];
    let result = [];

    for(let i = 1; i < points.length; ++i) {
      let current = points[i];
      let previous = points[i - 1];
      result.push(LineFactory.createLine(previous, current));
    }

    return result;
  }

  static getLineById(id) {
    return LINES[id];
  }

  static getLinesByIds(ids) {
    return ids.map((id) => LINES[id]);
  }
 }

export default LineFactory;
