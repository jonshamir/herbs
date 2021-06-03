import * as d3 from "d3";
import { forceManyBodyReuse } from "d3-force-reuse";
import { radToDeg, normalize2D, dist2D, clamp01 } from "../../utils/math";

import herbInfo from "../../data/herbInfo.json";
import familyInfo from "../../data/familyInfo.json";
import initialNodePositions from "../../data/initialNodePositions.json";

import lang from "../../lang";

let width = 400;
let height = 400;
// const marginX = 15;
const marginY = 30;
const offsetX = 0;
const imageSize = 40;
const collisionRadius = 16;

let simulation;
let rootNode;
let graphEl;
let mousePos = { x: -1, y: -1 };

export const graph = (ref, tooltipRef, data, parentComponent) => {
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

  const { tooltipContainer, tooltip } = setupTooltip(tooltipRef);

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
    .alphaMin(0.01)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(40)
        .strength(0.5)
    )
    .force("charge", forceManyBodyReuse().strength(-80))
    .force(
      "collision",
      d3.forceCollide().radius((d) => (d.children ? 2 : collisionRadius))
    )
    .force("x", d3.forceX(offsetX / 4))
    .force("y", d3.forceY())
    .force("mouse", (alpha) => {
      nodes.forEach((d) => {
        if (mousePos.x !== -1 && !d.fixed) {
          const dist = dist2D(d, mousePos);
          if (dist < 25) {
            // Snap to cursor
          } else if (dist < 250) {
            const invDist = Math.pow(clamp01(1 - (6 * dist) / height), 2);
            const deltaX = d.x - mousePos.x;
            const deltaY = d.y - mousePos.y;
            const dir = normalize2D(deltaX, deltaY);
            d.x += dir.x * invDist * 12 * alpha;
            d.y += dir.y * invDist * 12 * alpha;
          }
        }
      });
    });
  /*
    .force("growth", (alpha) => {
      const multiplier = Math.pow(alpha, 1);

      nodes.forEach((node) => {
        // Cause nodes to be above their parents
        if (node.parent && node.y > node.parent.y - 1000) {
          node.y -= multiplier * 6;
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
    });*/
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
    .classed("family", (d) => d.data.slug in familyInfo)
    .classed("leaf", (d) => !d.children)
    .attr("id", (d) => d.data.id);

  // Internode
  node
    .filter((d) => d.children)
    .append("circle")
    .attr("r", (d) => (d.data.slug in familyInfo ? 2 : 1.5))
    .attr("opacity", 0);

  // Internode click areas
  node
    .filter((d) => d.children)
    .append("circle")
    .attr("r", 18)
    .attr("fill-opacity", 0)
    .attr("stroke-width", 0);

  // Leaf images
  node
    .filter((d) => !d.children)
    .append("svg:image")
    .attr("xlink:href", (d) => `/images/icons/${d.data.slug}.png`)
    .attr("class", (d) => `image-${d.data.slug}`)
    .on("error", function (d) {
      d3.select(this).attr("xlink:href", "/images/herb.png");
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

  // Mouse hover effect
  svg.on("mousemove", handleMouseMove);

  // Leaf text
  const text = svg
    .append("g")
    .attr("class", "textGroup")
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

export const setupTooltip = (tooltipRef) => {
  const tooltipContainer = d3.select(tooltipRef.current);

  const tooltip = tooltipContainer
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  return { tooltipContainer, tooltip };
};

const onHover = (d, svg, link, node, text, tooltip, tooltipContainer) => {
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

    const nodeInfo = familyInfo[slug];

    if (nodeInfo) {
      tooltip.html(
        `<h4>${nodeInfo.name[lang]} /<span> ${rank[lang]}</span></h4><p>${nodeInfo.description[lang]}</p>`
      );
    } else {
      tooltip.html(`<h4>${name} /<span> ${rank[lang]}</span></h4>`);
    }
    tooltipContainer.attr(
      "style",
      `transform: translate(${2 * d.x}px,${2 * d.y}px)`
    );
    tooltip.transition().duration(300).style("opacity", 1);
  } else {
    // d3.select(`.image-${slug}`).attr("transform", `scale(1.1)`);
  }
};

let hoverTimer;

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
      hoverTimer = setTimeout(() => {
        onHover(d, svg, link, node, text, tooltip, tooltipContainer);
      }, 300);
    })
    .on("mouseout", (e, d) => {
      clearTimeout(hoverTimer);
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

function handleMouseMove(event) {
  const { x, offsetY } = event;
  mousePos = {
    x: (x - width) / 2,
    y: (offsetY - height) / 2,
  };
  simulation.alpha(0.2).restart();
}

/*
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
*/
