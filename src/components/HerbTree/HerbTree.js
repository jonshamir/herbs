import React from "react";
import { withRouter } from "react-router-dom";
import taxonomyTree from "../../data/taxonomyTree.json";
import taxonomyTreeOverrides from "../../data/taxonomyTreeOverrides.json";
import {
  initTree,
  updateGraphSize,
  highlightHerb,
  unhighlightAll,
  growTree,
} from "./graphUtils";
import "./HerbTree.scss";

class HerbTree extends React.Component {
  constructor(props) {
    super(props);
    this.d3ref = React.createRef();
    this.tooltipRef = React.createRef();

    this.state = {
      isHidden: true,
      isMinimal: false,
      isInteractive: false,
      initalLoad: false,
    };
  }

  componentDidMount() {
    this.setGraphSize();

    const taxonomyTreePruned = applyNodeOverrides(
      removeSingleChildren(JSON.parse(JSON.stringify(taxonomyTree)))
    );
    this.simulation = initTree(
      this.d3ref,
      this.tooltipRef,
      taxonomyTreePruned,
      this
    );

    window.scrollTo(0, document.body.scrollHeight);
    window.addEventListener("resize", (e) => this.handleResize(e));
    setTimeout(() => this.onRouteChanged(), 200);
  }

  handleResize(e) {
    this.setGraphSize();
  }

  handleClick(event, node) {
    if (node.height === 0) this.props.onNodeClick(node.data);
  }

  setGraphSize() {
    const w = document.documentElement.clientWidth;
    const h = Math.min(document.documentElement.clientHeight, 710);
    updateGraphSize(w, h);
  }

  logPositions() {
    const nodePositions = {};
    this.simulation.nodes().forEach((node, i) => {
      nodePositions[node.data.id] = { x: node.x, y: node.y };
    });
    console.log(JSON.stringify(nodePositions));
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    const route = this.props.location.pathname;
    const routeParts = route.split("/");
    if (route === "/") {
      this.setState({ isMinimal: false, isHidden: false });
      unhighlightAll();
      if (!this.state.initalLoad) {
        this.setState({ initalLoad: true });
        growTree(400, () => {
          this.setState({ isInteractive: true });
        });
      }
    } else {
      this.setState({ isInteractive: false });
      if (routeParts[1] === "herb") {
        this.setState({
          isMinimal: true,
          isHidden: false,
        });
        growTree(0);
        const herbSlug = routeParts[2];
        highlightHerb(herbSlug);
      } else if (routeParts[1] === "intro") {
        this.setState({
          isMinimal: false,
          isHidden: true,
        });
      }
    }
  }

  render() {
    const { isMinimal, isHidden, isInteractive } = this.state;
    let classNames = "HerbTree";
    if (isMinimal) classNames += " minimal";
    if (isHidden) classNames += " hidden";
    if (isInteractive) classNames += " interactive";
    if ((isMinimal || isHidden) && this.simulation) this.simulation.stop();

    return (
      <div className={classNames}>
        {/*<button onClick={() => this.logPositions()}>Get positions</button>*/}
        <div className="treeContainer" ref={this.d3ref}>
          <div className="tooltipContainer" ref={this.tooltipRef}></div>
        </div>
      </div>
    );
  }
}

const applyNodeOverrides = (node) => {
  if (node.children) node.children.forEach(applyNodeOverrides);

  // applyNodeOverrides
  if (node.slug in taxonomyTreeOverrides) {
    const overrideNode = taxonomyTreeOverrides[node.slug];
    node.name = overrideNode.name;
    node.rank = overrideNode.rank;
    node.slug = overrideNode.slug;
  }
  return node;
};

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

export default withRouter(HerbTree);
