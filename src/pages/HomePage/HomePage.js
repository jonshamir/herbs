import React from "react";
import { withRouter, Link } from "react-router-dom";

import FadeInOut from "../../components/FadeInOut/FadeInOut";
import Button from "../../components/Button/Button";

import "./HomePage.scss";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { logoOpacity: 1 };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const currScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const opacityThreshold = 100;

    if (currScroll > opacityThreshold) {
      if (this.state.logoOpacity !== 0) this.setState({ logoOpacity: 0 });
    } else {
      this.setState({ logoOpacity: 1 - currScroll / opacityThreshold });
    }
  };

  handleNodeClick = (node) => {
    this.props.history.push(`/herb/${node.slug}`);
  };

  render() {
    const { logoOpacity } = this.state;
    return (
      <FadeInOut className="HomePage">
        {/*<HerbTree onNodeClick={this.handleNodeClick} />*/}
        <Link to="/intro" className="Help">
          <Button>מה זה?</Button>
        </Link>
        <h1 className="Logo" style={{ opacity: logoOpacity + 0.15 }}>
          על טעם וריח
        </h1>
      </FadeInOut>
    );
  }
}

export default withRouter(HomePage);
