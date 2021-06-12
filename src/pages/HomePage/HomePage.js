import React from "react";
import { withRouter, Link } from "react-router-dom";

import FadeInOut from "../../components/FadeInOut/FadeInOut";
import IconButton from "../../components/IconButton/IconButton";

import "./HomePage.scss";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { logoOpacity: 1 };
  }

  componentDidMount() {
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
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
    return (
      <FadeInOut className="HomePage">
        {/*<HerbTree onNodeClick={this.handleNodeClick} />*/}
        <Link to="/intro">
          <IconButton icon="help" />
        </Link>
      </FadeInOut>
    );
  }
}

export default withRouter(HomePage);
