import React from "react";
import { Redirect } from "react-router-dom";
import HerbTree from "../../components/HerbTree/HerbTree";
// import WindowHeader from "../../components/WindowHeader/WindowHeader";
import "./HomePage.scss";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirect: null };
  }

  handleNodeClick = (node) => {
    this.setState({ redirect: `/herb/${node.slug}` });
  };

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} push />;

    return (
      <div className="HomePage">
        <div className="columns">
          <div className="ContentLeft">
            <HerbTree onNodeClick={this.handleNodeClick} />
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
