import React from "react";
import * as d3 from "d3";

import { radToDeg, normalize2D, dist2D } from "../../utils/math";

import herbHierarchy from "../../data/herbHierarchy.json";
import herbData from "../../data/herbData.json";
import initialNodePositions from "../../data/initialNodePositions.json";

import "./HerbTree.scss";
const clearColor = "#f9f5f4";

let width = 400;
let height = 400;
const radius = 3;
const marginX = 5;
const marginY = 20;
const offsetX = -50;
const imageSize = 40;
const collisionRadius = 16;

let graphEl;
let simulation;

class HerbTree extends React.Component {
  constructor(props) {
    super(props);
    this.d3ref = React.createRef();
  }

  componentDidMount() {
    this.setGraphSize();

    const herbHierarchyPruned = removeSingleChildren(
      JSON.parse(JSON.stringify(herbHierarchy))
    );
    graphEl = graph(this.d3ref, herbHierarchyPruned, this);

    window.addEventListener("resize", (e) => this.handleResize(e));
  }

  handleResize(e) {
    this.setGraphSize();
  }

  handleClick(event, node) {
    // this.props.onNodeClick(node.data);
  }

  setGraphSize() {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    width = w / 2;
    height = h;
    d3.select(graphEl).attr("viewBox", [
      -width / 2,
      -height / 2,
      width,
      height,
    ]);
    if (simulation) simulation.alphaTarget(0.1).restart();

    // TODO update root node positions
  }

  logPositions() {
    const nodePositions = {};
    simulation.nodes().forEach((node, i) => {
      nodePositions[node.data.id] = { x: node.x, y: node.y };
    });
    console.log(JSON.stringify(nodePositions));
  }

  render() {
    return (
      <div className="HerbTree">
        {/*<button onClick={this.logPositions}>Get positions</button>*/}
        <div ref={this.d3ref}></div>
      </div>
    );
  }
}

const removeSingleChildren = (node) => {
  if (node.children) node.children.forEach(removeSingleChildren);
  if (
    node.children &&
    node.children.length === 1 &&
    node.rank !== "Cladus"
    //  && node.rank !== "Familia"
  ) {
    const { children, name, id, slug } = node.children[0];
    node.id = id;
    node.children = children;
    node.name = name;
    node.slug = slug;
  }
  return node;
};

const drag = (simulation) => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

const setSubtreeActive = (root, isActive) => {
  root.isActive = isActive;
  root.children && root.children.forEach((d) => setSubtreeActive(d, isActive));
};

const linkLength = (link) => {
  return dist2D(link.source, link.target) + 3;
};

const graph = (ref, data, parentComponent) => {
  const root = d3.hierarchy(data);
  const links = root.links();
  const nodes = root.descendants();
  nodes.forEach((node, i) => {
    const { id } = node.data;
    if (id !== 1000 && initialNodePositions[id]) {
      const { x, y } = initialNodePositions[id];
      node.x = x;
      node.y = y;
    }
  });

  root.fixed = true;
  root.fx = offsetX;
  root.fy = 0.5 * height - 1 * marginY;

  simulation = d3
    .forceSimulation(nodes)
    .alphaDecay(0.05)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(40)
        .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(-80))
    .force(
      "collision",
      d3.forceCollide().radius((d) => (d.children ? 2 : collisionRadius))
    )
    .force("x", d3.forceX(offsetX))
    .force("y", d3.forceY())
    .force("growth", (alpha) => {
      nodes.forEach((node) => {
        // Cause nodes to be above their parents
        if (node.parent && node.y > node.parent.y - 100) {
          node.y -= alpha * 6;
        }
      });
    })
    .force("bounding", (alpha) => {
      // Repel walls
      nodes.forEach((node) => {
        const wallRepulsionX =
          alpha * Math.max(1, Math.abs(node.x) - (width / 2 - marginX));
        node.x -= Math.sign(node.x) * wallRepulsionX;
        const wallRepulsionY =
          alpha * Math.max(1, Math.abs(node.y) - (height / 2 - marginY));
        // node.y -= Math.sign(node.y) * wallRepulsionY;
      });
    });

  const svg = d3
    .select(ref.current)
    .append("svg")
    .attr("class", "graphContainer")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const link = svg
    .append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("class", "link")
    .attr("opacity", 0);

  const node = svg
    .append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", "node")
    .classed("internode", (d) => d.children)
    .classed("leaf", (d) => !d.children)
    .attr("id", (d) => d.data.id)
    .call(drag(simulation));

  node
    .filter((d) => d.children)
    .append("circle")
    .attr("r", 0.5 * radius)
    .attr("opacity", 0);

  node
    .filter((d) => !d.children)
    .append("svg:image")
    .attr("xlink:href", (d) => `/images/icons/${d.data.slug}.png`)
    .on("error", function (d) {
      d3.select(this).attr("xlink:href", "/images/herb.png");
    })
    .attr("x", -imageSize / 2)
    .attr("y", -imageSize / 2)
    .attr("width", imageSize)
    .attr("height", imageSize)
    .attr("opacity", 0);

  node
    .filter((d) => !d.children)
    .append("circle")
    .attr("r", collisionRadius + 4);

  const text = svg
    .append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .append("text")
    .text((d) => (d.children ? d.data.name : herbData[d.data.id].hebrewName))
    .attr("class", "nodeText")
    .classed("visible", (d) => !d.children)
    .attr("text-anchor", "middle")
    .attr("y", (d) => (d.children ? -5 : 0))
    .attr("opacity", 0);

  // ==== enterance transition ====
  setTimeout(() => {
    const growthTime = 600;
    link
      .attr("opacity", 1)
      .attr("stroke-dasharray", (d) => linkLength(d) + " " + linkLength(d))
      .attr("stroke-dashoffset", (d) => linkLength(d))
      .transition()
      .delay((d) => d.source.depth * growthTime - 100)
      .duration((d) => growthTime)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    svg
      .selectAll("circle, image, text")
      .transition()
      .delay((d) => d.depth * growthTime)
      .duration(growthTime)
      .attr("opacity", 1);

    // svg
    //   .selectAll("image")
    //   .attr("opacity", 1)
    //   .attr("transform")
    //   .transition()
    //   .delay((d) => d.depth * growthTime)
    //   .duration(growthTime);
  }, 1000);

  node
    .on("mouseover", (e, d) => {
      if (d.children) {
        graphEl.classList.add("inactive");
        const { id } = d.data;
        text.filter((d) => d.data.id === id).classed("visible", true);

        setSubtreeActive(d, true);

        node.classed("active", (d) => d.isActive);
        text.classed("active", (d) => d.isActive);
        link.classed("active", (d) => d.source.isActive);
      }
    })
    .on("mouseout", (e, d) => {
      if (d.children) {
        graphEl.classList.remove("inactive");
        const { id } = d.data;
        text.filter((d) => d.data.id === id).classed("visible", false);
        setSubtreeActive(d, false);
      }
    })
    .on("click", (e, d) => {
      parentComponent.handleClick(e, d);
    });

  simulation.on("tick", (e) => {
    node
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .select("image")
      .attr("transform", (d) => {
        let transform = "";
        if (!d.children) {
          const deltaX = d.x - d.parent.x;
          const deltaY = d.y - d.parent.y;
          const angle = radToDeg(Math.atan2(deltaY, deltaX)) + 90;
          transform += ` rotate(${angle})`;
        }
        return transform;
      });

    text.attr("transform", (d) => {
      let xPos = d.x;
      let yPos = d.y;
      if (!d.children) {
        const deltaX = d.x - d.parent.x;
        const deltaY = d.y - d.parent.y;
        const dir = normalize2D(deltaX, deltaY);
        xPos += dir.x * imageSize * 0.5;
        yPos += dir.y * imageSize * 0.5;
      }

      return `translate(${xPos},${yPos})`;
    });

    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  });

  return svg.node();
};

export default HerbTree;
