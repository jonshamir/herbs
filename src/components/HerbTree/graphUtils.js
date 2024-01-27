import * as d3 from "d3";
import { forceManyBodyReuse } from "d3-force-reuse";
import {
  radToDeg,
  degToRad,
  normalize2D,
  dist2D,
  clamp01,
  rotateVector,
  cross2D,
  sumVectors,
} from "../../utils/math";

import herbInfo from "../../data/herbInfo.json";
import familyInfo from "../../data/familyInfo.json";
import initialNodePositions from "../../data/initialNodePositions.json";

import lang from "../../lang";

// Simulation Parameters
const TABLET_WIDTH = 1000;
const LEAF_SIZE = 40;
const COLLISION_RADIUS = 16;
const REPULSION_STRENGTH = -80;

// Global variables
let width, height;
let allowDrag = false;
let mousePos = { x: -1, y: -1 };
let currentZoom = 1;
let currentXPan = 0;
let currentYPan = 0;

let zoom, svg, link, node, text, textGroup, root, rootNode;
let tooltip, tooltipContainer;
let simulation;
let containerElement;

export const initializeGraph = (
  ref,
  tooltipRef,
  data,
  parentComponent,
  onSubtreeActivate,
  shouldAllowDrag
) => {
  allowDrag = shouldAllowDrag;
  containerElement = ref.current;

  rootNode = d3.hierarchy(data);
  rootNode.descendants().forEach((node) => {
    const { id } = node.data;
    if (id !== 1000 && initialNodePositions[id]) {
      const { x, y } = initialNodePositions[id];
      node.x = x;
      node.y = y;
    }
  });

  rootNode.fixed = true;
  rootNode.fx = 0;
  rootNode.fy = 0.5 * height;

  setupSimulation();
  drawTree();
  setupTooltip(tooltipRef);
  setupInteractions(parentComponent, onSubtreeActivate);

  simulation.on("tick", (e) => {
    node.attr("transform", (d) => {
      let transform = `translate(${d.x},${d.y})`;
      if (!d.children) {
        if (d.angleOffset === undefined) d.angleOffset = 0;
        const deltaX = d.x - d.parent.x;
        const deltaY = d.y - d.parent.y;
        const angle = radToDeg(Math.atan2(deltaY, deltaX) + d.angleOffset) + 90;

        transform += ` rotate(${angle})`;
      } else if (d.depth > 0) {
        // Has children
        // Calculate bezier control incoming direction using children
        d.bezierDir = { x: 0, y: 0 };
        let maxChildHeight = 0;
        d.children.forEach((child) => {
          const childDir = normalize2D(child.x - d.x, child.y - d.y);
          if (maxChildHeight === child.height) {
            // Average direction
            d.bezierDir = sumVectors(d.bezierDir, childDir);
          } else if (maxChildHeight < child.height) {
            // Replace direction
            maxChildHeight = child.height;
            d.bezierDir = childDir;
          }
        });
        const parentDir = normalize2D(d.x - d.parent.x, d.y - d.parent.y);
        d.bezierDir = normalize2D(d.bezierDir.x, d.bezierDir.y);
        d.bezierDir = normalize2D(
          d.bezierDir.x + parentDir.x,
          d.bezierDir.y + parentDir.y
        );
      }
      return transform;
    });

    link.attr("d", (d) => {
      const length = dist2D(d.source, d.target);
      // Calculate direction vectors
      const prevDir = d.source.parent
        ? normalize2D(
            d.source.x - d.source.parent.x,
            d.source.y - d.source.parent.y
          )
        : { x: 0, y: -1 };
      let currDir = normalize2D(
        d.target.x - d.source.x,
        d.target.y - d.source.y
      );

      let control1strength = d.target.height === 0 ? 0.3 : 0.4;
      let control2strength = d.target.height === 0 ? 0.5 : 0.3;

      const control1dir = normalize2D(
        prevDir.x + currDir.x,
        prevDir.y + currDir.y
      );

      const control1pos = {
        x: d.source.x + control1dir.x * length * control1strength,
        y: d.source.y + control1dir.y * length * control1strength,
      };

      // Rotate leaves to look more natural
      if (d.target.height === 0) {
        const angle = Math.asin(cross2D(prevDir, currDir)) / 3;
        currDir = rotateVector(currDir, angle);
        d.target.angleOffset = angle;
      } else {
        currDir = d.target.bezierDir;
      }

      const control2pos = {
        x: d.target.x - currDir.x * length * control2strength,
        y: d.target.y - currDir.y * length * control2strength,
      };

      const endPointPos = d.target.height === 0 ? 0.3 : 0;

      const endPos = {
        x: d.target.x - currDir.x * LEAF_SIZE * endPointPos,
        y: d.target.y - currDir.y * LEAF_SIZE * endPointPos,
      };

      return `
            M 
              ${d.source.x} ${d.source.y} 
            C 
              ${control1pos.x} ${control1pos.y}
              ${control2pos.x} ${control2pos.y}
              ${endPos.x} ${endPos.y}
          `;
    });

    text.attr("transform", getTextTransform);

    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  });

  return simulation;
};

export const setupSimulation = () => {
  const links = rootNode.links();
  const nodes = rootNode.descendants();

  simulation = d3
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
    .force("charge", forceManyBodyReuse().strength(REPULSION_STRENGTH))
    .force(
      "collision",
      d3.forceCollide().radius((d) => (d.children ? 2 : COLLISION_RADIUS))
    )
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force("mouse", (alpha) => {
      nodes.forEach((d) => {
        if (mousePos.x !== -1 && !d.fixed) {
          const dist = dist2D(d, mousePos);
          if (dist < 30) {
            // Snap to cursor
          } else if (dist < 250) {
            const invDist = Math.pow(
              clamp01(1 - (6 * dist) / height),
              2 * currentZoom
            );
            const deltaX = d.x - mousePos.x;
            const deltaY = d.y - mousePos.y;
            const movementDir = normalize2D(deltaX, deltaY);
            d.x += movementDir.x * invDist * 12 * alpha;
            d.y += movementDir.y * invDist * 12 * alpha;
          }
        }
      });
    });
};

export const drawTree = () => {
  const links = rootNode.links();
  const nodes = rootNode.descendants();

  svg = d3
    .select(containerElement)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .lower();

  root = svg.append("g");

  // Center marker
  // root.append("circle").attr("r", 5).attr("fill", "red");

  link = root
    .append("g")
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke-width", (d) => {
      const rank = d.target.data.rank["en"];
      switch (rank) {
        case "Cladus":
          return 3;
        case "Ordo":
          return 2;
        case "Familia":
          return 1.5;
        default:
          return 1;
      }
    })
    .attr("opacity", 0);

  node = root
    .append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", (d) => `node node-${d.data.slug}`)
    .classed("internode", (d) => d.children)
    .classed("moreInfo", (d) => d.data.slug in familyInfo)
    .classed("leaf", (d) => !d.children)
    .attr("id", (d) => d.data.id);

  // Internode
  node
    .filter((d) => d.children)
    .append("circle")
    .attr("r", (d) => (d.data.slug in familyInfo ? 2 : 1.5))
    .attr("transform", "scale(0.01)");

  // Internode hover areas
  node
    .filter((d) => d.children)
    .append("circle")
    .attr("r", 18)
    .attr("fill-opacity", 0)
    .attr("stroke-width", 0);

  // Leaf images
  const imageCenter = -LEAF_SIZE / 2;
  node
    .filter((d) => !d.children)
    .append("svg:image")
    .attr("xlink:href", (d) => `/images/icons/${d.data.slug}.png`)
    .attr("class", (d) => `image-${d.data.slug}`)
    .on("error", function (d) {
      d3.select(this).attr("xlink:href", "images/herb.png");
    })
    .attr("x", imageCenter)
    .attr("y", imageCenter)
    .attr("width", LEAF_SIZE)
    .attr("height", LEAF_SIZE)
    .attr("transform", "scale(0.01)");

  // Leaf circle overlays
  node
    .filter((d) => !d.children)
    .append("circle")
    .attr("class", "imageOverlay")
    .attr("r", COLLISION_RADIUS + 4);

  // Minimal leaf nodes
  node
    .filter((d) => !d.children)
    .append("circle")
    .attr("class", "minimalLeaf")
    .attr("r", 3);

  // Mouse hover effect
  svg.on("mousemove", handleMouseMove);

  // Leaf text
  textGroup = text = root.append("g").attr("class", "textGroup");
  text = textGroup
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

export const growTree = (growthTime = 600, growImages = true) => {
  svg.attr("opacity", 1);

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
    .selectAll(".moreInfo circle")
    .transition()
    .delay((d) => d.depth * growthTime - 100)
    .duration(growthTime)
    .attr("transform", "")
    .end();

  svg
    .selectAll("text")
    .transition()
    .delay((d) => d.depth * growthTime + 500)
    .duration(growthTime)
    .attr("opacity", 1)
    .end();

  svg
    .selectAll(".leaf circle")
    .transition()
    .delay((d) => d.depth * growthTime + 600 * Math.random() - 300)
    .duration(growthTime)
    .attr("opacity", 1);

  if (growImages) {
    svg
      .selectAll("image")
      .attr("opacity", 1)
      .transition()
      .delay((d) => d.depth * growthTime + 600 * Math.random() - 300)
      .duration(growthTime)
      .attr("transform", "scale(1.1)");
  }
};

function linkLength(link) {
  return dist2D(link.source, link.target) + 3;
}

function getNodeLabel(d) {
  return d.children ? `${d.data.name}` : herbInfo[d.data.id].commonName[lang];
}

function getTextTransform(d) {
  let xPos = d.x;
  let yPos = d.y;
  if (!d.children) {
    // Leaf nodes
    const label = getNodeLabel(d);
    const deltaX = d.x - d.parent.x;
    const deltaY = d.y - d.parent.y;
    const dir = normalize2D(deltaX, deltaY);
    xPos += dir.x * (LEAF_SIZE * 0.5 + (label.length * 1.5) / currentZoom);
    yPos += dir.y * LEAF_SIZE * 0.5;
  }

  const scale = Math.max(1 / currentZoom, 0.5);
  return `translate(${xPos},${yPos}) scale(${scale})`;
}

let isIntroMode = true;
let clientHeight;

export const updateGraphSize = (clientWidth, _clientHeight) => {
  width = clientWidth / 2;
  height = 700;
  clientHeight = _clientHeight;

  if (!svg) return;
  svg.attr("viewBox", [-width / 2, 0, width, height]);

  if (!zoom || !isIntroMode) return;
  svg.call(zoom.transform, getZoomTransform());
};

function getZoomTransform() {
  if (!isIntroMode) return d3.zoomIdentity;
  else
    return width < TABLET_WIDTH / 2
      ? d3.zoomIdentity.scale(0.6).translate(0, clientHeight / 4 - 280)
      : d3.zoomIdentity.scale(0.8).translate(150, clientHeight / 4 - 200);
}

export const toggleIntroMode = (value, duration = 1000) => {
  isIntroMode = value;
  svg
    .transition()
    .duration(duration)
    .ease(d3.easeQuadInOut)
    .call(zoom.transform, getZoomTransform());
};

// ================== Interactions ==================

let hoverTimer;
const HIGHLIGHT_DURATION = 600;

const handleHover = (
  event,
  d,
  svg,
  link,
  node,
  text,
  tooltip,
  tooltipContainer,
  onSubtreeActivate
) => {
  const { slug, name, rank } = d.data;

  onSubtreeActivate(true, slug, d.children !== undefined);
  const currNode = d3.select(`.node-${slug}`);

  if (d.children) {
    currNode.raise();
    svg.classed("inactive", true);

    setSubtreeActive(d, true);

    node.classed("active", (d) => d.isActive);
    text.classed("active", (d) => d.isActive);
    link.classed("active", (d) => d.source.isActive);

    const nodeInfo = familyInfo[slug];

    if (nodeInfo) {
      tooltip.html(
        `<img src="images/family-icons/${slug}.png">
        <h4>${nodeInfo.name[lang]} /<span> ${rank[lang]}</span></h4>
        <p>${nodeInfo.description[lang]}</p>`
      );
    } else {
      tooltip.html(`<h4>${name} /<span> ${rank[lang]}</span></h4>`);
    }

    const [x, y] = d3.pointer(event);

    tooltipContainer.attr("style", `transform: translate(${x}px, ${y}px)`);
    tooltip.transition().duration(300).style("opacity", 1);
  } else {
    // d3.select(`.image-${slug}`).attr("transform", `scale(1.1)`);
  }
};

const setSubtreeActive = (root, isActive) => {
  root.isActive = isActive;
  root.children && root.children.forEach((d) => setSubtreeActive(d, isActive));
};

const setupInteractions = (parentComponent, onSubtreeActivate) => {
  function handleZoom({ transform }) {
    currentZoom = transform.k;
    if (currentZoom < 0.8) {
      // Don't allow panning when zoomed out
      // transform.x = currentXPan;
      // transform.y = currentYPan;
    }
    currentXPan = transform.x;
    currentYPan = transform.y;
    root.attr("transform", transform);
    textGroup.attr("opacity", (d) => {
      return currentZoom > 0.8 ? 1 : 0;
    });
    text.attr("transform", getTextTransform);
  }

  zoom = d3
    .zoom()
    .extent([
      [0, 0],
      [width, height],
    ])
    // .translateExtent([
    //   [-width, -height / 2],
    //   [width * 2, height * 2],
    // ])
    .scaleExtent([0.5, 4])
    // .wheelDelta((e) => {
    //   return e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002);
    // })
    .on("zoom", handleZoom);

  svg.call(zoom);

  node
    .on("mouseover", (e, d) => {
      hoverTimer = setTimeout(() => {
        handleHover(
          e,
          d,
          svg,
          link,
          node,
          text,
          tooltip,
          tooltipContainer,
          onSubtreeActivate
        );
      }, 300);

      // Show small internode on hover
      d3.select(`.node-${d.data.slug} circle`)
        .transition()
        .duration(250)
        .attr("transform", "scale(1)");
    })
    .on("mouseout", (e, d) => {
      // Hide small internode on hover
      if (d.data.children) {
        d3.select(`.node-${d.data.slug}:not(.moreInfo) circle`)
          .transition()
          .duration(250)
          .attr("transform", "scale(0.01)");
      }

      clearTimeout(hoverTimer);
      if (d.children) {
        svg.classed("inactive", false);
        setSubtreeActive(d, false);

        const { id } = d.data;
        text.filter((d) => d.data.id === id).classed("visible", false);

        tooltip.transition().duration(200).style("opacity", 0);
        onSubtreeActivate(false);
      }
    })
    .on("click", (e, d) => {
      parentComponent.handleClick(e, d);
    });

  text.on("click", (e, d) => {
    parentComponent.handleClick(e, d);
  });

  if (allowDrag) setupDrag();
};

export const setupTooltip = (tooltipRef) => {
  tooltipContainer = d3.select(tooltipRef.current);

  tooltip = tooltipContainer
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
};

export const highlightHerb = (slug) => {
  svg
    .selectAll("image")
    .raise()
    .transition()
    .attr("opacity", (d) => (d.data.slug === slug ? 1 : 0));

  for (let el of document.getElementsByClassName("highlighted")) {
    d3.select(el).classed("highlighted", false);
  }
  if (slug) {
    const herbNode = document.getElementsByClassName(`node-${slug}`)[0];
    d3.select(herbNode)
      .raise()
      .classed("highlighted", true)
      .select("image")
      .transition()
      .duration(HIGHLIGHT_DURATION / 2)
      .attr("opacity", 1);

    positionHighlightedHerb(HIGHLIGHT_DURATION);
  }
};

let positionHerbDuration = HIGHLIGHT_DURATION;

export const positionHighlightedHerb = () => {
  const herbNode = document.getElementsByClassName(`highlighted`)[0];
  if (herbNode) {
    const { scrollTop } = containerElement.parentElement;

    const herbRotation = degToRad(herbNode.transform.baseVal[1].angle);
    let x = -2 * herbNode.transform.baseVal[0].matrix.e;
    let y = -2 * herbNode.transform.baseVal[0].matrix.f;

    const moveX = width < 700 ? width - (70 + 80) : 550;

    let scrollRight = 0;
    if (width * 2 <= TABLET_WIDTH) {
      const scrollingContainer = containerElement.parentElement;
      const { scrollLeft, offsetWidth } = scrollingContainer;
      const maxScroll = TABLET_WIDTH - offsetWidth;
      scrollRight = maxScroll - scrollLeft;
    }

    x -= moveX - 10 * Math.sin(herbRotation) - scrollRight;
    y += -520 + scrollTop - 25 * clamp01(-Math.cos(herbRotation));

    const dist = Math.sqrt(Math.sqrt(x * x + y * y));
    positionHerbDuration = dist * 35;

    svg
      .transition()
      .duration(positionHerbDuration)
      .attr("style", `transform: translate(${x}px, ${y}px)`);
  }
};

export const unhighlightAll = (scaleImages) => {
  if (scaleImages) {
    svg
      .selectAll("image")
      .transition()
      .duration(HIGHLIGHT_DURATION)
      .attr("transform", "scale(1)")
      .attr("opacity", 1)
      .end()
      .then(() => {
        svg.selectAll("image").lower();
      });
  }

  for (let el of document.getElementsByClassName("highlighted")) {
    d3.select(el).classed("highlighted", false);
  }

  d3.select(containerElement).attr("style", "");

  svg
    .transition()
    .duration(positionHerbDuration)
    .attr("style", "transform: translate(0px,0px)");
};

export const setupDrag = () => {
  if (!allowDrag) node.filter((d) => d.depth > 0).call(drag(simulation));
  allowDrag = true;
};

function handleMouseMove(event) {
  const { x, y } = event;
  // TODO disable on mobile
  // if (width * 2 > TABLET_WIDTH) {
  mousePos = {
    x: ((x - width) / 2 - currentXPan) / currentZoom,
    y: (y / 2 - currentYPan) / currentZoom,
  };
  simulation.alpha(0.2).restart();
  // }
}

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

// ================== Print ==================

export const printLayout = () => {
  const lineColor = "#ccc";
  const bgColor = "#fff";
  document.body.style.backgroundImage = "none";
  document.body.style.backgroundColor = bgColor;

  simulation.alpha(0).stop();

  // Position images
  const imageCenter = LEAF_SIZE * 0.5;
  const imageCenterTransform = `translate(${imageCenter} ${imageCenter})`;
  node
    .filter((d) => !d.children)
    .selectAll("image")
    .attr("transform", imageCenterTransform);

  // Style graph
  svg
    .selectAll(".link")
    .attr("class", "")
    .attr("stroke-width", 1)
    .attr("stroke", lineColor);

  node
    .selectAll(".internode circle")
    .attr("r", 2)
    .attr("fill", lineColor)
    .attr("stroke", bgColor)
    .attr("stroke-width", 1);

  node.selectAll(".leaf circle").remove();

  text.filter((d) => d.children).remove();

  svg
    .selectAll("text")
    .attr("class", "")
    .attr("stroke-width", 0)
    .attr("font-size", "8")
    .attr("font-family", "ArbelHagilda");
};
