import React from "react";
import taxonomyTree from "../../data/taxonomyTree.json";
import {
  initTree,
  updateGraphSize,
  showProtoPlant,
  moveProtoPlant,
  growTree,
} from "./introGraphUtils";

import "./IntroGraph.scss";

class IntroGraph extends React.Component {
  constructor(props) {
    super(props);
    this.d3ref = React.createRef();
  }

  componentDidMount() {
    this.setGraphSize();

    const taxonomyTreePruned = removeSingleChildren(
      JSON.parse(JSON.stringify(taxonomyTree))
    );

    this.simulation = initTree(this.d3ref, taxonomyTreePruned, this);

    window.addEventListener("resize", (e) => this.handleResize(e));
  }

  handleResize(e) {
    this.setGraphSize();
  }

  setGraphSize() {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    updateGraphSize(w, h);
  }

  componentDidUpdate(prevProps) {
    if (this.props.page !== prevProps.page) {
      this.updateGraph(this.props.page);
    }
  }

  updateGraph(page) {
    console.log(page);
    switch (page) {
      case 1:
        showProtoPlant();
        break;
      case 2:
        moveProtoPlant().then(growTree);
        break;
      default:
    }
  }

  logPositions() {
    const nodePositions = {};
    this.simulation.nodes().forEach((node, i) => {
      nodePositions[node.data.id] = { x: node.x, y: node.y };
    });
    console.log(JSON.stringify(nodePositions));
  }

  render() {
    return <div className="IntroGraph" ref={this.d3ref}></div>;
  }
}

const removeSingleChildren = (node) => {
  if (node.children) node.children.forEach(removeSingleChildren);
  if (
    node.children &&
    node.children.length === 1 &&
    node.rank.en !== "Cladus"
  ) {
    const { id, children, name, rank, slug } = node.children[0];
    node.id = id;
    node.children = children;
    node.name = name;
    node.rank = rank;
    node.slug = slug;
  }
  return node;
};

export default IntroGraph;
