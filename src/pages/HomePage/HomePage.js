import React from "react";
import { Redirect, Link } from "react-router-dom";

import FadeInOut from "../../components/FadeInOut/FadeInOut";
import Button from "../../components/Button/Button";

import "./HomePage.scss";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirect: null };
  }

  componentDidMount() {
    // if (window.history.scrollRestoration) {
    //   window.history.scrollRestoration = "manual";
    // }
  }

  componentWillUnmount() {}

  handleScroll = () => {
    const currScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const totalHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const distToBottom = totalHeight - currScroll;

    const opacityThreshold = 100;

    if (distToBottom > opacityThreshold) {
      if (this.state.introOpacity !== 0) this.setState({ introOpacity: 0 });
    } else {
      this.setState({ introOpacity: 1 - distToBottom / opacityThreshold });
    }
  };

  handleNodeClick = (node) => {
    this.setState({ redirect: `/herb/${node.slug}` });
  };

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} push />;
    return (
      <FadeInOut className="HomePage">
        {/*<HerbTree onNodeClick={this.handleNodeClick} />*/}
        <Link to="/intro" className="Help">
          <Button>מה זה?</Button>
        </Link>
        <h1 className="Logo">על טעם וריח</h1>
      </FadeInOut>
    );
  }
}

export default HomePage;
