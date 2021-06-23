import React from "react";
import ReactMarkdown from "react-markdown";
import { withRouter, Link } from "react-router-dom";

import recipeInfo from "../../data/recipeInfo.json";

import FadeInOut from "../../components/FadeInOut/FadeInOut";

import "./RecipePage.scss";

class RecipePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { md: "loading...", imageLoaded: false, timerComplete: false };
  }

  async componentDidMount() {
    const { slug } = this.props.match.params;
    const response = await fetch(`/recipes/${slug}.md`);
    const text = await response.text();

    this.setState({
      md: text,
    });

    window.scrollTo(0, 0);
    setTimeout(() => this.setState({ timerComplete: true }), 500);
  }

  renderLink({ href, children, title }) {
    if (title === "HerbIcon")
      return (
        <Link to={href} className="HerbLink">
          <img src={`/images/icons/${href}.png`} alt={children} />
          {children}
        </Link>
      );

    return <Link to={href}>{children}</Link>;
  }

  renderImage({ src, alt }) {
    const { slug } = this.props.match.params;
    return (
      <img src={`/images/recipes/${slug}/${src}`} alt={alt} className={alt} />
    );
  }

  render() {
    const { slug } = this.props.match.params;
    const { imageLoaded, timerComplete } = this.state;

    const recipe = recipeInfo.filter((recipe) => recipe.slug === slug)[0];
    const { title, herbs } = recipe;

    return (
      <FadeInOut className="RecipePage PageContainer">
        <main>
          <div className="RecipePhoto">
            <img
              className={imageLoaded && timerComplete ? "loaded" : ""}
              src={`/images/recipes/${slug}/main.jpg`}
              alt={title}
              onLoad={() => this.setState({ imageLoaded: true })}
            />
          </div>
          <h1>{title}</h1>
          <ReactMarkdown
            components={{
              a: this.renderLink,
              img: (props) => this.renderImage(props),
              // code: this.renderCustomComponent,
            }}
          >
            {this.state.md}
          </ReactMarkdown>
        </main>
      </FadeInOut>
    );
  }
}

export default withRouter(RecipePage);
