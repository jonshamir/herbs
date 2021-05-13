import React from "react";

import herbHierarchy from "../../data/herbHierarchy.json";
import { graph, updateGraphSize } from "./graphUtils";

import "./HerbTree.scss";

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
    this.simulation = graph(this.d3ref, herbHierarchyPruned, this);

    window.scrollTo(0, document.body.scrollHeight);
    window.addEventListener("resize", (e) => this.handleResize(e));
  }

  handleResize(e) {
    this.setGraphSize();
  }

  handleClick(event, node) {
    if (node.height === 0) this.props.onNodeClick(node.data);
  }

  setGraphSize() {
    const w = document.documentElement.clientWidth;
    const h = Math.min(document.documentElement.clientHeight, 750);
    updateGraphSize(w, h);
  }

  logPositions() {
    const nodePositions = {};
    this.simulation.nodes().forEach((node, i) => {
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
    const { children, name, id, slug, rank, rankHebrew } = node.children[0];
    node.id = id;
    node.children = children;
    node.name = name;
    node.slug = slug;
    node.rank = rank;
    node.rankHebrew = rankHebrew;
  }
  return node;
};

export default HerbTree;
