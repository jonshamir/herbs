import React from "react";
import ReactMarkdown from "react-markdown";
import { withRouter, Link } from "react-router-dom";
import lang from "../../lang";

import FadeInOut from "../../components/FadeInOut/FadeInOut";
import HerbSummary from "../../components/HerbSummary/HerbSummary";
import HerbLink from "../../components/HerbLink/HerbLink";
import herbInfo from "../../data/herbInfo.json";
import familyInfo from "../../data/familyInfo.json";
import recipeInfo from "../../data/recipeInfo.json";

import "./HerbPage.scss";

class HerbPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { md: "טוען...", imageLoaded: false, timerComplete: false };
  }

  async componentDidMount() {
    const { slug } = this.props.match.params;
    const response = await fetch(`../herb-pages/${slug}.md`);
    const text = await response.text();

    this.setState({
      md: text,
    });

    window.scrollTo(0, 0);

    setTimeout(() => this.setState({ timerComplete: true }), 1100);
  }

  renderLink({ href, children, title }) {
    if (title === "HerbIcon") return <HerbLink slug={href} title={children} />;
    const hrefParts = href.split("/");
    if (hrefParts.length < 2) {
      return <HerbLink slug={href} title={children} inline />;
    }

    return <Link to={href}>{children}</Link>;
  }

  renderRecipes(herb) {
    const { slug } = herb;
    const recipes = recipeInfo.filter((recipe) =>
      recipe.herbs.map((h) => h.slug).includes(slug)
    );

    if (recipes.length > 0) {
      return (
        <>
          <h2>מתכונים</h2>
          <p>
            ניתן למצוא פה באתר רעיונות לשימושים של {herb.commonName[lang]}{" "}
            בבישול:
          </p>
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.slug}>
                <Link
                  to={`../../recipes/${recipe.slug}`}
                  className="RecipeLink"
                >
                  {recipe.title + " >"}
                </Link>
              </li>
            ))}
          </ul>
        </>
      );
    }
  }

  onTitleClick() {
    const { slug } = this.props.match.params;

    if (slug === "dill") this.props.history.push("/herb/dill/shamir");
  }

  render() {
    const { slug } = this.props.match.params;
    const { imageLoaded, timerComplete } = this.state;
    // const slug = "bay-leaf";
    const herb = herbInfo.filter((herb) => herb.slug === slug)[0];
    const familyName = herb.taxonomy.find((rank) =>
      rank.hasOwnProperty("Familia")
    ).Familia;
    const family = familyInfo[familyName.toLowerCase()];

    return (
      <FadeInOut className="HerbPage">
        <main>
          {/*
          <Link to="/" className="backIcon">
            <IconButton icon="arrow-right" label="חזרה לעץ" />
          </Link>*/}
          <HerbSummary herb={herb} slug={slug} family={family} />
          <div className="HerbContent">
            <div className="mainText">
              <h1 onClick={() => this.onTitleClick()}>
                {herb.commonName[lang]}
              </h1>
              <ReactMarkdown
                components={{
                  a: this.renderLink,
                  // code: this.renderCustomComponent,
                }}
              >
                {this.state.md}
              </ReactMarkdown>
              <h2>משפחת ה{family.name[lang]}</h2>
              <p>{family.description[lang]}</p>
              {this.renderRecipes(herb)}
            </div>
          </div>
          <div className="herbPhoto">
            <img
              src={`../../images/photos/${slug}.jpg`}
              alt={herb.commonName[lang]}
              className={imageLoaded && timerComplete ? "loaded" : ""}
              onLoad={(e) => this.setState({ imageLoaded: true })}
            />
          </div>
        </main>
      </FadeInOut>
    );
  }
}

export default withRouter(HerbPage);
