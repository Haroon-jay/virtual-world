class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(other) {
    const xDiff = this.x - other.x;
    const yDiff = this.y - other.y;
    return Math.sqrt(xDiff ** 2 + yDiff ** 2);
  }
  draw(
    ctx,
    { size = 18, color = "black", outline = false, fill = false } = {}
  ) {
    const rad = size / 2;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, rad, 0, 2 * Math.PI);
    ctx.fill();
    if (outline) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.arc(this.x, this.y, rad * 0.6, 0, 2 * Math.PI);
      ctx.stroke();
    }
    if (fill) {
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.arc(this.x, this.y, rad * 0.4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}
