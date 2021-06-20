import React from "react";
import ReactMarkdown from "react-markdown";
import { withRouter, Link } from "react-router-dom";
import lang from "../../lang";

import FadeInOut from "../../components/FadeInOut/FadeInOut";

import "./HerbPage.scss";

class RecipePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { md: "loading..." };
  }

  async componentDidMount() {
    const { slug } = this.props.match.params;
    const response = await fetch(`/recipes/${slug}.md`);
    const text = await response.text();

    this.setState({
      md: text,
    });

    window.scrollTo(0, 0);
  }

  render() {
    const { slug } = this.props.match.params;

    return (
      <FadeInOut className="RecipePage PageContainer">
        <main>
          <h1>זה פה מתכון</h1>
        </main>
      </FadeInOut>
    );
  }
}

export default withRouter(RecipePage);
