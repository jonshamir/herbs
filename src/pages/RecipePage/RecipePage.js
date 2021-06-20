import React from "react";
import ReactMarkdown from "react-markdown";
import { withRouter, Link } from "react-router-dom";

import recipeInfo from "../../data/recipeInfo.json";

import FadeInOut from "../../components/FadeInOut/FadeInOut";

import "./RecipePage.scss";

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

    const recipe = recipeInfo.filter((recipe) => recipe.slug === slug)[0];
    const { title, herbs } = recipe;

    return (
      <FadeInOut className="RecipePage PageContainer">
        <main>
          <h1>{title}</h1>
          {herbs.map((herbSlug) => (
            <img
              className="HerbIcon"
              src={`/images/icons/${herbSlug}.png`}
              alt={herbSlug}
              key={herbSlug}
            />
          ))}

          <img
            className="RecipePhoto"
            src={`/images/recipes/${slug}.jpg`}
            alt={title}
          />
        </main>
      </FadeInOut>
    );
  }
}

export default withRouter(RecipePage);
