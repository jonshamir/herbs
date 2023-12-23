import React from "react";
import { withRouter } from "react-router-dom";
import { debounce } from "lodash";
import taxonomyTree from "../../data/taxonomyTree.json";
import taxonomyTreeOverrides from "../../data/taxonomyTreeOverrides.json";
import {
  initTree,
  updateGraphSize,
  highlightHerb,
  unhighlightAll,
  positionHighlightedHerb,
  growTree,
  printLayout,
  setupDrag,
} from "./graphUtils";
import { clamp } from "../../utils/math";

import "./HerbTree.scss";

const MIN_LOGO_OPACITY = 0;
const TABLET_WIDTH = 1000;

class HerbTree extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.d3ref = React.createRef();
    this.tooltipRef = React.createRef();

    this.state = {
      logoOpacity: MIN_LOGO_OPACITY,
      isHidden: true,
      isMinimal: false,
      isInteractive: true,
      initalLoaded: false,
      isSubtreeActive: false,
    };

    this.positionHighlightedHerbDebounced = debounce(
      positionHighlightedHerb,
      300
    );
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
      this,
      this.handleSubtreeActivate,
      this.props.debug
    );

    window.addEventListener("resize", (e) => this.handleResize(e));
    setTimeout(() => {
      this.onRouteChanged();
    }, 800);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleResize(e) {
    this.setGraphSize();
    const routeParts = this.props.location.pathname.split("/");
    if (routeParts[1] === "herb") this.positionHighlightedHerbDebounced();
  }

  handleClick(event, node) {
    if (node.height === 0) {
      this.props.onNodeClick(node.data);
    }
  }

  setGraphSize() {
    // const w = Math.max(document.documentElement.clientWidth, TABLET_WIDTH);
    const w = document.documentElement.clientWidth;
    const h = 700;
    updateGraphSize(w, h);
  }

  logPositions() {
    const nodePositions = {};
    this.simulation.nodes().forEach((node, i) => {
      nodePositions[node.data.id] = { x: node.x, y: node.y };
    });
    console.log(JSON.stringify(nodePositions));
  }

  getPrintLayout() {
    this.setState({ isInteractive: false });
    printLayout();
  }

  handleSubtreeActivate = (isActive, slug, hasChildren) => {
    if (!isActive && this.state.isSubtreeActive) {
      this.setState({ isSubtreeActive: false });
    } else if (hasChildren) {
      this.setState({ isSubtreeActive: true });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged(prevProps.location);
    }
  }

  onRouteChanged(prevLocation) {
    const route = this.props.location.pathname;
    const routeParts = route.split("/");
    if (routeParts.slice(-1)[0] === "") routeParts.pop();

    // setupDrag();
    if (route === "/herb/dill/shamir") setupDrag();

    this.setGraphSize();

    if (route)
      if (route === "/") {
        this.setState({ isHidden: false, isInteractive: true });

        if (!this.state.initalLoaded) {
          this.setState({ initalLoaded: true });
          // setTimeout(growTree, 500);
          growTree();
        } else {
          setTimeout(() => {
            this.setState({ isMinimal: false });
            unhighlightAll(this.state.initalLoaded);
          }, 50);
        }
      } else {
        setTimeout(
          () => {
            growTree(0, false);
            unhighlightAll(false);

            this.setState({
              isMinimal: true,
              isHidden: routeParts[1] === "recipes",
              isInteractive: false,
              initalLoaded: true,
            });
            const herbSlug = routeParts[1] === "herb" ? routeParts[2] : false;
            highlightHerb(herbSlug);
          },
          this.state.initalLoaded ? 0 : 1000
        );
      }
  }

  getLogoOpacity() {
    const { isMinimal, isHidden, isSubtreeActive, logoOpacity } = this.state;
    if (isMinimal || isHidden) return 0;
    return 1;
  }

  render() {
    const { isMinimal, isHidden, isInteractive } = this.state;
    let classNames = "HerbTree";
    if (isMinimal) classNames += " minimal";
    if (isHidden) classNames += " hidden";
    if (isInteractive) classNames += " interactive";
    if ((isMinimal || isHidden) && this.simulation) this.simulation.stop();

    return (
      <div className={classNames} ref={this.containerRef}>
        <h1 className="Logo" style={{ opacity: this.getLogoOpacity() }}>
          Herbarium
        </h1>
        {this.props.debug && (
          <div className="DebugMenu">
            <button onClick={() => this.logPositions()}>Get Positions</button>
            <button onClick={() => this.getPrintLayout()}>Print Layout</button>
          </div>
        )}
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
