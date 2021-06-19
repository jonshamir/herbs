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
        <div className="Menu">
          <Link to="/intro">
            <IconButton icon="help" label="מה זה?" />
          </Link>
          <Link to="/about">
            <IconButton icon="about" label="אודות" />
          </Link>
        </div>
      </FadeInOut>
    );
  }
}

export default withRouter(HomePage);
