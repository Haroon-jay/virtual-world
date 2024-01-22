class Graph {
  constructor(points = [], segments = []) {
    this.points = points;
    this.segments = segments;
  }

  static load(info) {
    const points = info.points.map((p) => new Point(p.x, p.y));
    const segments = info.segments.map(
      (s) => new Segment(new Point(s.p1.x, s.p1.y), new Point(s.p2.x, s.p2.y))
    );
    return new Graph(points, segments);
  }

  hash() {
    return JSON.stringify(this);
  }
  containsPoint(point) {
    return this.points.find((p) => p.equals(point));
  }

  removeSegment(seg) {
    this.segments = this.segments.filter((s) => !s.equals(seg));
  }
  tryAddPoint(point) {
    if (this.containsPoint(point)) {
      return false;
    }

    this.addPoint(point);
    return true;
  }

  containsSegment(seg) {
    return this.segments.find((s) => s.equals(seg));
  }

  getSegmentsWithPoint(point) {
    return this.segments.filter((s) => s.includes(point));
  }
  removePoint(point) {
    this.points = this.points.filter((p) => !p.equals(point));
    const segmentsToRemove = this.getSegmentsWithPoint(point);
    for (const seg of segmentsToRemove) {
      this.removeSegment(seg);
    }
  }

  dispose() {
    this.points.length = 0;
    this.segments.length = 0;
  }

  getClosestPoint(point) {
    let closest = null;
    let closestDistance = Infinity;
    for (const p of this.points) {
      const distance = p.distanceTo(point);
      if (distance < closestDistance) {
        closest = p;
        closestDistance = distance;
      }
    }
    return closest;
  }

  tryAddSegment(seg) {
    console.log("adding segment", seg);
    if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
      this.addSegment(seg);
      return true;
    }
    return false;
  }
  addSegment(seg) {
    this.segments.push(seg);
  }
  addPoint(point) {
    this.points.push(point);
  }
  draw(ctx) {
    for (const seg of this.segments) {
      seg.draw(ctx);
    }

    for (const point of this.points) {
      point?.draw(ctx);
    }
  }
}
