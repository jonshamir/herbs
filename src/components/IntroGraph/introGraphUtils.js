import * as d3 from "d3";
import { forceManyBodyReuse } from "d3-force-reuse";
import { dist2D } from "../../utils/math";

import initialNodePositions from "../../data/initialNodePositionsRandom.json";

let width = 400;
let height = 400;
const collisionRadius = 16;
const marginY = 50;
let centerOffsetX = 0;
let centerOffsetY = -250;

// Global variables
let svg, link, node;
let protoPlant;
let simulation;
let rootNode;
let svgEl;
let containerEl;

const HIDE_TREE = true;

const getCirclePath = (cx, cy, r) =>
  `M ${cx - r}, ${cy}
   a ${r},${r} 0 1,0 ${r * 2},0
   a ${r},${r} 0 1,0 -${r * 2},0`;

export const initTree = (ref, data, parentComponent) => {
  rootNode = d3.hierarchy(data);
  const links = rootNode.links();
  const nodes = rootNode.descendants();
  nodes.forEach((node, i) => {
    const { id } = node.data;
    if (id !== 1000 && initialNodePositions[id]) {
      const { x, y } = initialNodePositions[id];
      node.x = x;
      node.y = y;
    }
  });

  rootNode.fixed = true;
  rootNode.fx = 0;
  rootNode.fy = 0.5 * height - 1 * marginY;

  setupSimulation(nodes, links);
  drawTree(ref, simulation, nodes, links);

  protoPlant = svg.append("g").classed("protoPlant", true).attr("opacity", 0);
  for (let i = 1; i <= 4; i++) {
    protoPlant
      .append("path")
      .attr("d", getCirclePath(0, 0, 16))
      .attr("id", `Circle${i}`);
  }

  svgEl = svg.node();

  simulation.on("tick", (e) => {
    node.attr("transform", (d) => `translate(${d.x},${d.y})`);

    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  });

  return simulation;
};

export const setupSimulation = (nodes, links) => {
  simulation = d3
    .forceSimulation(nodes)
    .alphaDecay(0.05)
    .alphaMin(0.01)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(30)
        .strength(0.5)
    )
    .force("charge", forceManyBodyReuse().strength(-50))
    .force(
      "collision",
      d3.forceCollide().radius((d) => (d.children ? 2 : collisionRadius))
    )
    .force("x", d3.forceX(centerOffsetX))
    .force("y", d3.forceY(centerOffsetY))
    .force("growth", (alpha) => {
      const multiplier = Math.pow(alpha, 1);

      nodes.forEach((node) => {
        if (node.parent && node.y > node.parent.y - 1000) {
          node.y -= multiplier * 6;
        }
      });
    });
};

export const showProtoPlant = () => {
  protoPlant
    .attr("transform", "translate(0,-50) scale(0.5)")
    .transition()
    .ease(d3.easeCubicOut)
    .duration(1000)
    .delay(300)
    .attr("opacity", 1)
    .attr("transform", "translate(0,-50) scale(1)");
};

export const moveProtoPlant = () => {
  return protoPlant
    .transition()
    .ease(d3.easeCubicIn)
    .duration(1000)
    .delay(300)
    .attr("transform", `translate(0,${rootNode.fy}) scale(0.12)`)
    .end();
};

export const drawTree = (ref, simulation, nodes, links) => {
  containerEl = ref.current;

  svg = d3
    .select(containerEl)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .lower();

  link = svg
    .append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("class", "link")
    .attr("stroke", "#ccc")
    .attr("stroke-width", (d) => Math.min(d.target.height + 1, 4))
    .attr("opacity", HIDE_TREE ? 0 : 1);

  node = svg
    .append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", (d) => `node node-${d.data.slug}`)
    .classed("internode", (d) => d.children)
    .attr("id", (d) => d.data.id);

  // Internodes
  node
    .append("circle")
    .attr("r", 2.8)
    .attr("fill", "#ccc")
    .attr("stroke", "#f9f5f4")
    .attr("stroke-width", "1.5")
    .attr("transform", HIDE_TREE ? "scale(0.01)" : "");

  node.filter((d) => d.depth > 0).call(drag(simulation));
};

export const fadeOut = () => {
  svg.selectAll("g:not(.protoPlant)").attr("opacity", 1);

  return svg
    .selectAll("g")
    .transition()
    .duration(1000)
    .attr("opacity", 0)
    .end();
};

export const growTree = (growthTime = 500) => {
  svg
    .attr("opacity", 1)
    .transition()
    .duration(growthTime * 8)
    .ease(d3.easeCubicOut)
    .attr("opacity", 0.5);

  protoPlant
    .transition()
    .duration(growthTime * 3)
    .attr("opacity", 1);

  link
    .attr("opacity", 1)
    .attr("stroke-dasharray", (d) => linkLength(d) + " " + linkLength(d))
    .attr("stroke-dashoffset", (d) => linkLength(d))
    .transition()
    .delay((d) => d.source.depth * growthTime - 100)
    .duration((d) => growthTime)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0)
    .end()
    .then(function (e) {
      link.attr("stroke-dasharray", "none");
    });

  svg
    .selectAll("circle")
    .transition()
    .delay((d) => d.depth * growthTime - 100)
    .duration(growthTime)
    .attr("transform", "")
    .end();
};

const linkLength = (link) => {
  return dist2D(link.source, link.target) + 3;
};

export const updateGraphSize = (w, h) => {
  width = w / 2;
  height = h / 2;
  d3.select(svgEl).attr("viewBox", [-width / 2, -height / 2, width, height]);
  if (simulation) {
    simulation.alpha(0.2).restart();

    rootNode.fx = 0;
    rootNode.fy = 0.5 * height - 1 * marginY;
  }
};

const drag = (simulation) => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.4).restart();
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
