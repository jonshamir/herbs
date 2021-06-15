import React from "react";
import { withRouter, Link } from "react-router-dom";

import FadeInOut from "../../components/FadeInOut/FadeInOut";
import IconButton from "../../components/IconButton/IconButton";

import "./HomePage.scss";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
  }

  render() {
    return (
      <FadeInOut className="HomePage">
        <Link to="/intro">
          <IconButton icon="help" />
        </Link>
      </FadeInOut>
    );
  }
}

export default withRouter(HomePage);
