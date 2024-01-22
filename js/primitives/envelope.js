class Envelope {
  constructor(skeleton, width, roundness = 1) {
    this.skeleton = skeleton;
    this.poly = this.#generatePoly(width, roundness);
  }

  #generatePoly(width, roundness) {
    if (!this.skeleton) return;
    const { p1, p2 } = this.skeleton;
    const radius = width / 2;
    const alpha = angle(subtract(p1, p2));
    const alphaCw = alpha + Math.PI / 2;
    const alphaCcw = alpha - Math.PI / 2;

    const points = [];
    const step = Math.PI / Math.max(1, roundness);
    const eps = step / 2;
    for (let i = alphaCcw; i < alphaCw + eps; i += step) {
      points.push(translate(p1, i, radius));
    }
    for (let i = alphaCcw; i < alphaCw + eps; i += step) {
      points.push(translate(p2, Math.PI + i, radius));
    }

    return new Polygon(points);
  }

  draw(ctx, options) {
    this.poly?.draw(ctx, options);
    this.poly.drawSegments(ctx);
  }
}
