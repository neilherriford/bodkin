import {QUADRANT_TYPE} from '../pmtree/Quadrant';
import {offset as offsetPoint} from '../geometry/Point';

class Painter {
  constructor(ctx) {
    this.ctx = ctx;
  }

  clear() {
    const width = this.ctx.canvas.clientWidth;
    const height = this.ctx.canvas.clientHeight;
    this.ctx.clearRect(0, 0, width, height);
  }

  drawPolyline(polyline, lineStyle='DarkGreen', fillStyle='LightCoral') {
    for(let line of polyline) this.drawLine(line, lineStyle, fillStyle);
  }

  drawLine(line, lineStyle='DarkGreen', fillStyle='LightCoral') {
    if(line === null) return;

    this.ctx.lineStyle = lineStyle;
    this.ctx.fillStyle = fillStyle;
    this.ctx.beginPath();
    this.ctx.moveTo(...line.head);
    this.ctx.lineTo(...line.tail);
    this.ctx.stroke();
    this.fillCircle(line.head, 0.25);
    this.fillCircle(line.tail, 0.25);
  }

  fillCircle(center, radius, lineStyle='DarkGreen', fillStyle='LightCoral') {
    this.ctx.beginPath();
    this.ctx.arc(...center, radius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawQuadrant(quadrant, highlight = null) {
    const working = [quadrant];
    let shouldLabel = false;
    let currentLetter = -1;

    while(working.length > 0) {
      let current = working.pop();
      const width = current.bounds.halfWidth * 2;
      switch(current.type) {
        case QUADRANT_TYPE.WHITE:
          shouldLabel = true;
          this.ctx.fillStyle = 'Gainsboro';
          this.ctx.strokeStyle = 'LightGray';
          break;
        case QUADRANT_TYPE.GRAY:
          this.ctx.fillStyle = 'DarkGray';
          this.ctx.strokeStyle = 'DimGray';
          break;
        case QUADRANT_TYPE.BLACK:
          shouldLabel = true;
          this.ctx.fillStyle = 'DarkSlateGray';
          this.ctx.strokeStyle = 'Black';
          break;
      }
      this.ctx.strokeRect(...current.bounds.nw, width, width);
      this.ctx.fillRect(...current.bounds.nw, width, width);
      if(shouldLabel) {
        this.ctx.fillStyle = 'violet';
        this.ctx.fillText(current.id, ...offsetPoint(current.bounds.ne, -5, 5));
      }

      let children = current.children();
      if(children === null) continue;

      for(let child of children) {
        if(child === null) continue;
        working.push(child);
      }
    }

    if(highlight === null) return;
    const width = highlight.bounds.halfWidth * 2;
    this.ctx.strokeStyle = 'Fuchsia';
    this.ctx.strokeRect(...highlight.bounds.nw, width, width);
  }

  fillPolygon(points, lineStyle='DarkGreen', fillStyle='LightCoral') {
    this.ctx.lineStyle = lineStyle;
    this.ctx.fillStyle = fillStyle;
    this.ctx.beginPath();
    this.ctx.moveTo(...points[0]);
    for(let index = 1; index <= points.length; ++index) {
      this.ctx.lineTo(...points[index % points.length]);
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  label(location, text, tyle='violet') {
    this.ctx.fillStyle = style;
    this.ctx.fillText(text, ...location);
  }

  fillBounds(bounds, lineStyle='DarkGreen', fillStyle='LightCoral') {
    this.fillPolygon([
      bounds.nw,
      bounds.ne,
      bounds.se,
      bounds.sw
    ]);
  }
}

export default Painter;
