import React from "react";
import randomTree from "../../data/randomTree.json";
import {
  initTree,
  updateGraphSize,
  showProtoPlant,
  moveProtoPlant,
  growTree,
  fadeOut,
} from "./introGraphUtils";

import "./IntroGraph.scss";

class IntroGraph extends React.Component {
  constructor(props) {
    super(props);
    this.d3ref = React.createRef();
    // this.tree = removeSingleChildren(getRandomTree(8));
    this.tree = randomTree;
  }

  componentDidMount() {
    this.setGraphSize();

    this.simulation = initTree(this.d3ref, this.tree, this);
    // moveProtoPlant().then(growTree);

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
    switch (page) {
      case 1:
        showProtoPlant();
        break;
      case 2:
        moveProtoPlant().then(growTree);
        break;
      case 3:
        fadeOut();
        break;
      default:
        break;
    }
  }

  logTree() {
    const nodePositions = {};
    this.simulation.nodes().forEach((node, i) => {
      nodePositions[node.data.id] = { x: node.x, y: node.y };
    });
    console.log(JSON.stringify(this.tree));

    console.log(JSON.stringify(nodePositions));
  }

  render() {
    return (
      <div className="IntroGraph" ref={this.d3ref}>
        {/*<button onClick={() => this.logTree()}>Log Tree</button>*/}
      </div>
    );
  }
}

// const leafNode = { children: [] };
// const NUM_CHILDREN = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 4];
// const NUM_CHILDREN_LEN = NUM_CHILDREN.length;
// let nodeId = 0;
//
// const getRandomTree = (depth) => {
//   const node = { id: nodeId++, children: [] };
//   if (depth === 0) return node;
//   const numChilren = NUM_CHILDREN[Math.floor(Math.random() * NUM_CHILDREN_LEN)];
//   for (let i = 0; i < numChilren; i++) {
//     node.children.push(randomTree(depth - 1));
//   }
//   return node;
// };
//
// const removeSingleChildren = (node) => {
//   if (node.children) node.children.forEach(removeSingleChildren);
//   if (node.children && node.children.length === 1) {
//     const { id, children } = node.children[0];
//     node.id = id;
//     node.children = children;
//   }
//   return node;
// };

export default IntroGraph;
