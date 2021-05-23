import * as d3 from "d3";
import { radToDeg, normalize2D, dist2D } from "../../utils/math";

import herbInfo from "../../data/herbInfo.json";
import rankInfo from "../../data/rankInfo.json";
import initialNodePositions from "../../data/initialNodePositions.json";

import lang from "../../lang";

let width = 400;
let height = 400;
const radius = 2;
const marginX = 15;
const marginY = 30;
const offsetX = -30;
const imageSize = 40;
const collisionRadius = 16;

let simulation;
let rootNode;
let graphEl;

export const graph = (ref, data, parentComponent) => {
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
  rootNode.fx = offsetX;
  rootNode.fy = 0.5 * height - 1 * marginY;

  simulation = setupSimulation(nodes, links);

  const { svg, link, node, text } = drawGraph(ref, simulation, nodes, links);
  graphEl = svg.node();

  const { tooltipContainer, tooltip } = setupTooltip(svg);

  // Enterance transition
  setTimeout(() => {
    enteranceTransition(link, svg);
    setupInteractions(
      svg,
      link,
      node,
      text,
      tooltip,
      tooltipContainer,
      parentComponent
    );
  }, 1000);

  simulation.on("tick", (e) => {
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

    text.attr("transform", (d) => {
      let xPos = d.x;
      let yPos = d.y;
      if (!d.children) {
        // Leaf nodes
        const label = getNodeLabel(d);
        const deltaX = d.x - d.parent.x;
        const deltaY = d.y - d.parent.y;
        const dir = normalize2D(deltaX, deltaY);
        xPos += dir.x * (imageSize * 0.5 + label.length * 1.5);
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

  return simulation;
};

export const setupSimulation = (nodes, links) => {
  return d3
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
    .force("x", d3.forceX(offsetX / 4))
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
      nodes.forEach((node) => {
        const wallRepulsionX =
          alpha *
          Math.max(1, Math.abs(node.x + offsetX) - (width / 2 - marginX));
        node.x -= Math.sign(node.x) * wallRepulsionX;
        // const wallRepulsionY =
        //   alpha * Math.max(1, Math.abs(node.y) - (height / 2 - marginY));
        // node.y -= Math.sign(node.y) * wallRepulsionY;
      });
    });
};

const getNodeLabel = (d) => {
  if (d.children) return `${d.data.name}`;
  else return herbInfo[d.data.id].commonName[lang];
};

export const drawGraph = (ref, simulation, nodes, links) => {
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
    .attr("class", (d) => `node node-${d.data.slug}`)
    .classed("internode", (d) => d.children)
    .classed("leaf", (d) => !d.children)
    .attr("id", (d) => d.data.id);

  // Allow dragging for all but root node
  node.filter((d) => d.depth > 0).call(drag(simulation));

  // Internodes
  node
    .filter((d) => d.children)
    .append("circle")
    .attr("r", radius)
    .attr("opacity", 0);

  // Leaf images
  node
    .filter((d) => !d.children)
    .append("svg:image")
    .attr("xlink:href", (d) => `./images/icons/${d.data.slug}.png`)
    .attr("class", (d) => `image-${d.data.slug}`)
    .on("error", function (d) {
      d3.select(this).attr("xlink:href", "./images/herb.png");
    })
    .attr("x", -imageSize / 2)
    .attr("y", -imageSize / 2)
    .attr("width", imageSize)
    .attr("height", imageSize)
    .attr("transform", "scale(0.01)");

  // Leaf circle overlays
  node
    .filter((d) => !d.children)
    .append("circle")
    .attr("r", collisionRadius + 4);

  // Leaf text
  const text = svg
    .append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .append("text")
    .text(getNodeLabel)
    .attr("class", "nodeText")
    .classed("visible", (d) => !d.children)
    .attr("text-anchor", "middle")
    .attr("y", (d) => (d.children ? -5 : 0))
    .attr("opacity", 0);
  return { svg, link, node, text };
};

export const setupTooltip = (svg) => {
  const tooltipContainer = svg
    .append("foreignObject")
    .attr("class", "tooltipContainer")
    .attr("width", 200)
    .attr("height", 400);

  const tooltip = tooltipContainer
    .append("xhtml:div")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  return { tooltipContainer, tooltip };
};

export const setupInteractions = (
  svg,
  link,
  node,
  text,
  tooltip,
  tooltipContainer,
  parentComponent
) => {
  node
    .on("mouseover", (e, d) => {
      const { slug, name, rank } = d.data;

      if (d.children) {
        // console.log(d3.select(`.node-${slug}`));
        d3.select(`.node-${slug}`).raise();
        svg.classed("inactive", true);
        // text.filter((d) => d.data.id === id).classed("visible", true);

        setSubtreeActive(d, true);

        node.classed("active", (d) => d.isActive);
        text.classed("active", (d) => d.isActive);
        link.classed("active", (d) => d.source.isActive);

        const nodeInfo = rankInfo[slug];

        if (nodeInfo) {
          const rankType = nodeInfo.rankOverride
            ? nodeInfo.rankOverride[lang]
            : rank[lang];
          tooltip.html(
            `<h4>${nodeInfo.name[lang]} /<span> ${rankType}</span></h4><p>${nodeInfo.description[lang]}</p>`
          );
        } else {
          tooltip.html(`<h4>${name} /<span> ${rank[lang]}</span></h4>`);
        }
        tooltipContainer.attr("transform", `translate(${d.x - 200},${d.y})`);
        tooltip.transition().duration(300).style("opacity", 1);
      } else {
        // d3.select(`.image-${slug}`).attr("transform", `scale(1.1)`);
      }
    })
    .on("mouseout", (e, d) => {
      // const { slug } = d.data;

      if (d.children) {
        svg.classed("inactive", false);
        setSubtreeActive(d, false);

        const { id } = d.data;
        text.filter((d) => d.data.id === id).classed("visible", false);

        tooltip.transition().duration(200).style("opacity", 0);
      } else {
        // d3.select(`.image-${slug}`).attr("transform", `scale(1)`);
      }
    })
    .on("click", (e, d) => {
      parentComponent.handleClick(e, d);
    });
};

export const enteranceTransition = (link, svg) => {
  const growthTime = 400;
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
    .selectAll("circle, text")
    .transition()
    .delay((d) => d.depth * growthTime + 500)
    .duration(growthTime)
    .attr("opacity", 1);

  svg
    .selectAll("image")
    // .attr("opacity", 1)
    .transition()
    .delay((d) => d.depth * growthTime + 600 * Math.random() - 300)
    .duration(growthTime)
    .attr("transform", "scale(1)");
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

export const updateGraphSize = (w, h) => {
  width = w / 2;
  height = h;
  d3.select(graphEl).attr("viewBox", [-width / 2, -height / 2, width, height]);
  if (simulation) {
    simulation.alphaTarget(0.1).restart();

    rootNode.fx = offsetX;
    rootNode.fy = 0.5 * height - 1 * marginY;
  }
};
