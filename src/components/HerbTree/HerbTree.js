import React from "react";
import * as d3 from "d3";
import "./HerbTree.css";
import herbHeirarcy from "../../data/herbHeirarcy.json";
import herbData from "../../data/herbData.json";
import { degToRad, radToDeg } from "../../utils/math";
const clearColor = "#f7f2f1";

let width = 400;
let height = 400;
const radius = 3;
const margin = 40;
let graphEl;
let simulation;

class HerbTree extends React.Component {
  constructor(props) {
    super(props);
    this.d3ref = React.createRef();
  }

  componentDidMount() {
    this.setGraphSize();

    const herbHeirarcyPruned = removeSingleChildren(
      JSON.parse(JSON.stringify(herbHeirarcy))
    );
    graphEl = graph(this.d3ref, herbHeirarcyPruned);

    window.addEventListener("resize", (e) => this.handleResize(e));
  }

  handleResize(e) {
    this.setGraphSize();
  }

  setGraphSize() {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    width = w / 2;
    height = h / 2;
    d3.select(graphEl).attr("viewBox", [
      -width / 2,
      -height / 2,
      width,
      height,
    ]);
    if (simulation) simulation.alphaTarget(0.3).restart();

    // TODO update root node positions
  }

  render() {
    return (
      <div className="App">
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
    // && node.rank !== "Familia"
  ) {
    const { children, name } = node.children[0];
    node.children = children;
    node.name = name;
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

const graph = (ref, data) => {
  const root = d3.hierarchy(data);
  const links = root.links();
  const nodes = root.descendants();

  root.fixed = true;
  root.fx = 0;
  root.fy = 0.5 * height - 0.8 * margin;

  simulation = d3
    .forceSimulation(nodes)
    .alphaDecay(0.008)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(18)
        .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(-45))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force("growth", (alpha) => {
      nodes.forEach((node) => {
        // Cause nodes to be above their parents
        if (node.parent && node.y > node.parent.y - 50) {
          node.y -= alpha * 3;
        }
      });
    })
    .force("bounding", (alpha) => {
      // Repel walls
      nodes.forEach((node) => {
        const wallRepulsionX =
          alpha * Math.max(1, Math.abs(node.x) - (width / 2 - margin));
        node.x -= Math.sign(node.x) * wallRepulsionX;
        const wallRepulsionY =
          alpha * Math.max(1, Math.abs(node.y) - (height / 2 - margin));
        node.y -= Math.sign(node.y) * wallRepulsionY;
      });
    });

  const svg = d3
    .select(ref.current)
    .append("svg")
    .attr("class", "graphContainer")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const link = svg
    .append("g")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 1)
    .selectAll("line")
    .data(links)
    .join("line");

  const node = svg
    .append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", "node")
    .call(drag(simulation));

  node
    .append("circle")
    .attr("fill", (d) => (d.children ? "#999" : clearColor))
    .attr("stroke", (d) => (d.children ? null : clearColor))
    .attr("stroke-width", (d) => (d.children ? 0 : 1.5))
    .attr("r", (d) => (d.children ? 0.5 * radius : radius));

  node.append("title").text((d) => d.data.name);
  node.append("text").text((d) => d.data.id);

  const imageSize = 15;

  node
    .filter((d) => !d.children)
    .append("svg:image")
    .attr("xlink:href", "/images/herb.png")
    .attr("x", -imageSize / 2)
    .attr("y", -imageSize / 2)
    .attr("width", imageSize)
    .attr("height", imageSize);

  simulation.on("tick", (e) => {
    // Update node positions
    node.attr("transform", (d) => {
      let transform = `translate(${d.x},${d.y})`;
      if (!d.children) {
        const deltaX = d.x - d.parent.x;
        const deltaY = d.y - d.parent.y;
        const angle = radToDeg(Math.atan2(deltaY, deltaX)) + 90;
        transform += ` rotate(${angle})`;
      }

      return transform;
    });

    // Update link positions
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  });

  return svg.node();
};

export default HerbTree;
