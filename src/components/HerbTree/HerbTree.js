import React from "react";
import taxonomyTree from "../../data/taxonomyTree.json";
import { graph, updateGraphSize } from "./graphUtils";
import "./HerbTree.scss";

class HerbTree extends React.Component {
  constructor(props) {
    super(props);
    this.d3ref = React.createRef();
  }

  componentDidMount() {
    this.setGraphSize();

    const taxonomyTreePruned = removeSingleChildren(
      JSON.parse(JSON.stringify(taxonomyTree))
    );
    this.simulation = graph(this.d3ref, taxonomyTreePruned, this);

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
        {/*<button onClick={() => this.logPositions()}>Get positions</button>*/}
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

export default HerbTree;
