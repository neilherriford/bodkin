import NonAxisAlignedBoundingBox from '../non_axis_aligned_bounding_box/NonAxisAlignedBoundingBox';
import LineFactory from '../geometry/LineFactory';

class ZhaoSaalfeldSimplifier {
  constructor(epsilon) {
    this.epsilon = epsilon;
  }

  withinSleeve(polyline, startIndex, endIndex) {
    const boundingBox = new NonAxisAlignedBoundingBox(
      polyline[startIndex],
      polyline[endIndex],
      this.epsilon);

    for(let index = startIndex + 1; index < endIndex; ++index) {
      if(boundingBox.contains(polyline[index])) {
        continue;
      }
      return false;
    }

    return true;
  }

  simplify(polyline) {
    if(polyline === null) return null;
    if(polyline.length === 1) return polyline;

    let points = LineFactory.destructurePolyline(polyline);

    const result = [points[0]];
    var startIndex = 0;
    var endIndex = 2;

    while(endIndex < points.length) {
      if(this.withinSleeve(points, startIndex, endIndex)) {
        endIndex++;
        continue;
      }
      result.push(points[endIndex - 1]);
      startIndex = endIndex - 1;
      ++endIndex;
    }

    result.push(points[points.length - 1]);

    return LineFactory.createPolyline(result);
  }
}

export default ZhaoSaalfeldSimplifier;
