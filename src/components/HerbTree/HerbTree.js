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
} from "./graphUtils";
import "./HerbTree.scss";

const MIN_LOGO_OPACITY = 0.15;

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
    };

    this.positionHighlightedHerbDebounced = debounce(
      positionHighlightedHerb,
      100
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
      this
    );

    this.containerRef.current.scrollTo(0, this.d3ref.current.scrollHeight);

    window.addEventListener("resize", (e) => this.handleResize(e));
    setTimeout(() => {
      this.onRouteChanged();
      this.containerRef.current.addEventListener("scroll", (e) =>
        this.handleScroll(e)
      );
    }, 200);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    const currScroll = this.containerRef.current.scrollTop;

    const opacityThreshold = 100;

    if (currScroll > opacityThreshold) {
      if (this.state.logoOpacity !== 0)
        this.setState({ logoOpacity: MIN_LOGO_OPACITY });
    } else {
      this.setState({
        logoOpacity: 1 - currScroll / opacityThreshold + MIN_LOGO_OPACITY,
      });
    }
  }

  handleResize(e) {
    this.positionHighlightedHerbDebounced();
    this.setGraphSize();
  }

  handleClick(event, node) {
    if (node.height === 0) {
      this.props.onNodeClick(node.data);
    }
  }

  setGraphSize() {
    const w = document.documentElement.clientWidth;
    // const h = document.documentElement.clientHeight;
    updateGraphSize(w, 710);
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
      this.onRouteChanged(prevProps.location);
    }
  }

  onRouteChanged(prevLocation) {
    const route = this.props.location.pathname;
    const routeParts = route.split("/");
    if (route === "/") {
      this.setState({ isMinimal: false, isHidden: false });
      this.setState({ isInteractive: true });
      unhighlightAll(this.state.initalLoaded);

      if (!this.state.initalLoaded) {
        this.setState({ initalLoaded: true });
        growTree(400);
      }
    } else {
      this.setState({ isInteractive: false });
      // this.containerRef.current.scrollTo({
      //   top: 0,
      //   left: 0,
      //   behavior: "smooth",
      // });
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
    const { isMinimal, isHidden, isInteractive, logoOpacity } = this.state;
    let classNames = "HerbTree";
    if (isMinimal) classNames += " minimal";
    if (isHidden) classNames += " hidden";
    if (isInteractive) classNames += " interactive";
    if ((isMinimal || isHidden) && this.simulation) this.simulation.stop();

    const finalLogoOpacity = isMinimal || isHidden ? 0 : logoOpacity;

    return (
      <div className={classNames} ref={this.containerRef}>
        <h1 className="Logo" style={{ opacity: finalLogoOpacity }}>
          על טעם וריח
        </h1>
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
