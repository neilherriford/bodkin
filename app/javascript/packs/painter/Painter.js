import {QUADRANT_TYPE} from '../pmtree/Quadrant';
import Geometry from '../geometry/Geometry';

class Painter {
  constructor(ctx) {
    this.ctx = ctx;
  }

  clear() {
    const width = this.ctx.canvas.clientWidth;
    const height = this.ctx.canvas.clientHeight;
    this.ctx.clearRect(0, 0, width, height);
  }

  drawPolyline(polyline) {
    for(let line of polyline) this.drawLine(line);
  }

  drawLine(line, color='SaddleBrown') {
    if(line === null) return;
    this.ctx.strokeStyle = 'SaddleBrown';
    this.ctx.fillStyle = 'SaddleBrown';

    this.ctx.beginPath();
    this.ctx.moveTo(...line.head);
    this.ctx.lineTo(...line.tail);
    this.ctx.stroke();
    this.fillCircle(line.head, 1);
    this.fillCircle(line.tail, 1);

    const midpoint = [
      (line.head[0] + line.tail[0]) / 2,
      (line.head[1] + line.tail[1]) / 2,
    ];

    this.ctx.fillStyle = 'orange';
    ctx.fillText(line.id, ...midpoint);
  }

  fillCircle(center, radius) {
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
}

export default Painter;
