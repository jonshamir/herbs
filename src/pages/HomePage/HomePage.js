import React from "react";
import { Redirect } from "react-router-dom";

import FadeInOut from "../../components/FadeInOut/FadeInOut";

import "./HomePage.scss";

class HomePage extends React.Component {
  componentDidMount() {
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
  }

  render() {
    if (this.props.shouldShowIntro) {
      return <Redirect to="/intro" />;
    }
    return <FadeInOut className="HomePage"></FadeInOut>;
  }
}

export default HomePage;
