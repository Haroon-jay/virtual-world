class World {
  constructor(
    graph,
    roadWidth = 100,
    roundness = 10,
    buildingWidth = 150,
    buildingMinLength = 150,
    spacing = 50,
    treeSize = 100
  ) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roudRoundness = roundness;
    this.buildingWidth = buildingWidth;
    this.buildingMinLength = buildingMinLength;
    this.spacing = spacing;
    this.envelopes = [];
    this.treeSize = treeSize;
    this.intersections = [];
    this.roadBorders = [];
    this.buildings = [];
    this.trees = [];
    this.maxTries = 100;
    this.generate();
  }
  generate() {
    this.envelopes.length = 0;
    for (const seg of this.graph.segments) {
      this.envelopes.push(
        new Envelope(seg, this.roadWidth, this.roudRoundness)
      );
    }
    this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
    this.buildings = this.#generateBuildings();
    this.trees = this.#generateTrees();
  }

  #generateTrees() {
    const points = [
      ...this.roadBorders.map((seg) => [seg.p1, seg.p2]).flat(),
      ...this.buildings.map((b) => b.points).flat(),
    ];
    const left = Math.min(...points.map((p) => p.x));
    const right = Math.max(...points.map((p) => p.x));
    const top = Math.min(...points.map((p) => p.y));
    const bottom = Math.max(...points.map((p) => p.y));

    const illegalPolys = [
      ...this.buildings,
      ...this.envelopes.map((e) => e.poly),
    ];

    const trees = [];
    let tryCount = 0;
    while (tryCount < this.maxTries) {
      const p = new Point(
        lerp(left, right, Math.random()),
        lerp(top, bottom, Math.random())
      );
      let keep = true;
      for (const poly of illegalPolys) {
        console.log(poly.distanceToPoint(p), "distance");
        if (
          poly.containsPoint(p) ||
          poly.distanceToPoint(p) < this.treeSize / 2
        ) {
          keep = false;
          break;
        }
      }
      if (keep) {
        for (const tree of trees) {
          if (distance(tree, p) < this.treeSize) {
            keep = false;
            break;
          }
        }
      }
      if (keep) {
        trees.push(p);
        tryCount = 0;
      }
      tryCount++;
    }
    return trees;
  }
  #generateBuildings() {
    const tmpEnvelopes = [];
    for (const seg of this.graph.segments) {
      tmpEnvelopes.push(
        new Envelope(
          seg,
          this.roadWidth + this.buildingWidth + this.spacing * 2,
          this.roudRoundness
        )
      );
    }
    const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly));

    for (let i = 0; i < guides.length; i++) {
      const seg = guides[i];
      if (seg.length() < this.buildingMinLength) {
        guides.splice(i, 1);
        i--;
      }
    }
    const supports = [];
    for (let seg of guides) {
      const len = seg.length() + this.spacing * 2;
      const buildingCount = Math.floor(
        len / (this.buildingMinLength + this.spacing)
      );
      const buildingLength = len / buildingCount - this.spacing;
      const dir = seg.directionVector();
      let q1 = seg.p1;
      let q2 = add(q1, scale(dir, buildingLength));
      supports.push(new Segment(q1, q2));

      for (let i = 2; i < buildingCount; i++) {
        q1 = add(q2, scale(dir, this.spacing));
        q2 = add(q1, scale(dir, buildingLength));
        supports.push(new Segment(q1, q2));
      }
    }

    const bases = [];
    for (const seg of supports) {
      bases.push(new Envelope(seg, this.buildingWidth).poly);
    }
    for (let i = 0; i < bases.length; i++) {
      for (let j = i + 1; j < bases.length; j++) {
        if (bases[i].intersectsPoly(bases[j])) {
          bases.splice(j, 1);
          j--;
        }
      }
    }
    return bases;
  }

  draw(ctx) {
    for (const env of this.envelopes) {
      env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
    }
    for (const seg of this.graph.segments) {
      seg.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
    }
    for (const seg of this.roadBorders) {
      seg.draw(ctx, { color: "white", width: 4 });
    }
    for (const tree of this.trees) {
      tree.draw(ctx, { color: "green", size: this.treeSize });
    }
    for (const building of this.buildings) {
      building.draw(ctx, { color: "green", width: 4 });
    }
  }
}
