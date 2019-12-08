import ZhaoSaalfeldSimplifier from './ZhaoSaalfeldSimplifier';
import LineFactory from '../geometry/LineFactory';
import diff from 'jest-diff';
import {equal as pointsEqual} from '../geometry/Point';

const byPointsAscending = (left, right) => {
  if(left[0] === right[0]) return left[1] - right[1];
  return left[0] - right[0];
};

expect.extend({
  toBeEquivilentToPolyline(received, expected) {
    const receivedPoints = LineFactory.destructurePolyline(received).sort(byPointsAscending);
    const expectedPoints = LineFactory.destructurePolyline(expected).sort(byPointsAscending);

    let pass = true;
    if(receivedPoints.length === expectedPoints.length) {
      for(let i = 0; i < receivedPoints.length; ++i) {
        if(pointsEqual(receivedPoints[i], expectedPoints[i])) continue;
        pass = false;
        break;
      }
    } else {
      pass = false;
    }

    const message = pass
      ? () => this.utils.matcherHint('.not.toBeEquivilentToPolyline') + '\n\n' +
        `Expected polyline to not be equivilent:\n` +
        `  ${this.utils.printExpected(expectedPoints)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(receivedPoints)}`
      : () => {
        const diffString = diff(expectedPoints, receivedPoints, {
          expand: this.expand,
        });
        return this.utils.matcherHint('.toBeEquivilentToPolyline') + '\n\n' +
        `Expected polyline to be equivilent:\n` +
        `  ${this.utils.printExpected(expectedPoints)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(receivedPoints)}` +
        (diffString ? `\n\nDifference:\n\n${diffString}` : '');
      };

    return {actual: received, message, pass};
  }
});

describe('ZhaoSaalfeldSimplifier', () => {
  it('should ignore null polylines', () => {
    const simplifier = new ZhaoSaalfeldSimplifier(0.5);
    const actual = simplifier.simplify(null);
    expect(actual).toBeNull();
  });

  it('should ignore single segment polylines', () => {
    const givenPolyline = [
      {head: [5, 5], tail: [10, 10]}
    ];
    const simplifier = new ZhaoSaalfeldSimplifier(0.5);
    const actual = simplifier.simplify(givenPolyline);
    expect(actual).toEqual(givenPolyline);
  });

  it('should smooth a polyline which fits within the sleeve', () => {
    const givenPolyline = [
      {head: [5, 5], tail: [15, 10]},
      {head: [15, 10], tail: [20, 20]}
    ];
    const simplifier = new ZhaoSaalfeldSimplifier(5);
    const actual = simplifier.simplify(givenPolyline);
    expect(actual).toBeEquivilentToPolyline([
      {head: [5, 5], tail:  [20, 20]},
    ]);
  });


  it('should not smooth a polyline which does not fit within the sleeve', () => {
    const givenPolyline = [
      {head: [5, 5], tail: [15, 10]},
      {head: [15, 10], tail: [20, 20]}
    ];
    const simplifier = new ZhaoSaalfeldSimplifier(1);
    const actual = simplifier.simplify(givenPolyline);
    expect(actual).toBeEquivilentToPolyline(givenPolyline);
  });

});
