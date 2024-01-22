class ViewPort {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.zoom = 1;
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    this.offset = scale(this.center, -1);

    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      active: false,
    };
    this.#addEventListeners();
  }

  reset() {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(0.5, 0.5);
    this.ctx.translate(this.center.x, this.center.y);
    this.ctx.scale(1 / this.zoom, 1 / this.zoom);
    const offset = this.getOffset();
    this.ctx.translate(offset.x, offset.y);
  }

  getMouse(evt, subDragOffset = false) {
    const p = new Point(
      (evt.offsetX - this.center.x) * this.zoom - this.offset.x,
      (evt.offsetY - this.center.y) * this.zoom - this.offset.y
    );
    return subDragOffset ? subtract(p, this.drag.offset) : p;
  }

  #handleMouseDown(evt) {
    console.log(evt.button);
    if (evt.button === 0) {
      this.drag.active = true;
      this.drag.start = this.getMouse(evt);
    }
  }
  #handleMouseMove(evt) {
    if (this.drag.active) {
      this.drag.end = this.getMouse(evt);
      //   this.offset = this.offset.add(this.drag.end.sub(this.drag.start));
      this.drag.offset = subtract(this.drag.end, this.drag.start);
    }
  }

  getOffset() {
    return add(this.offset, this.drag.offset);
  }
  #handleMouseUp(evt) {
    if (this.drag.active) {
      this.offset = add(this.offset, this.drag.offset);
      this.drag = {
        start: new Point(0, 0),
        end: new Point(0, 0),
        offset: new Point(0, 0),
        active: false,
      };
    }
  }
  #addEventListeners() {
    this.canvas.addEventListener(
      "mousewheel",
      this.#handleMouseWheel.bind(this)
    );
    this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.#handleMouseUp.bind(this));
  }

  #handleMouseWheel(e) {
    const dir = Math.sign(e.deltaY);
    const step = 0.05;
    this.zoom += dir * step;
    this.zoom = Math.max(1, Math.min(5, this.zoom));
  }
}
