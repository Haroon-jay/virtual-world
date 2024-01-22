class GraphEditor {
  constructor(viewport, graph) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
    this.graph = graph;
    this.ctx = this.canvas.getContext("2d");
    this.lastAddedPoint = null;
    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.mouse = null;
    this.#addEventListeners();
  }
  #removePoint(point) {
    this.graph.removePoint(point);
    this.hovered = null;
    if (this.selected === point) this.selected = null;
  }
  display() {
    this.graph.draw(this.ctx);
    if (this.selected) {
      const intent = this.hovered ? this.hovered : this.mouse;
      new Segment(this.selected, intent).draw(ctx, {
        dash: [3, 3],
      });
      this.selected.draw(this.ctx, { fill: true });
    }
    if (this.hovered) {
      this.hovered.draw(this.ctx, { color: "red" });
    }
  }

  dispose() {
    this.graph.dispose();
    this.selected = null;
    this.hovered = null;
  }
  #select(point) {
    if (this.selected) {
      const seg = new Segment(this.selected, point);
      this.graph.tryAddSegment(seg);
    }
    this.selected = point;
  }

  #handleMouseDown(e) {
    console.log(e);
    if (e.button === 2) {
      if (this.selected) {
        this.selected = null;
      } else if (this.hovered) {
        this.#removePoint(this.hovered);
      }
    }
    if (e.button === 0) {
      if (this.hovered) {
        this.#select(this.hovered);
        this.hovered = null;
        this.dragging = true;
        return;
      }
      this.#select(this.mouse);
      this.graph.addPoint(this.mouse);
      this.hovered = null;
    }
  }

  #handleMouseMove(e) {
    this.mouse = this.viewport.getMouse(e, true);
    this.hovered = getNearestPoint(
      this.mouse,
      this.graph.points,
      12 * this.viewport.zoom
    );
    if (this.dragging) {
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  }

  #addEventListeners() {
    this.canvas.addEventListener("mouseup", () => {
      this.dragging = false;
    });
    this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
    this.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
  }
}
