import React from "react";
import ReactMarkdown from "react-markdown";
import { withRouter } from "react-router-dom";
import lang from "../../lang";

import FadeInOut from "../../components/FadeInOut/FadeInOut";
import HerbSummary from "../../components/HerbSummary/HerbSummary";
import herbInfo from "../../data/herbInfo.json";
import familyInfo from "../../data/familyInfo.json";

import "./HerbPage.scss";

class HerbPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { md: "loading...", imageLoaded: false, timerComplete: false };
  }

  async componentDidMount() {
    const { slug } = this.props.match.params;
    // const slug = "bay-leaf";
    const response = await fetch(`/herb-pages/${slug}.md`);
    const text = await response.text();

    this.setState({
      md: text,
    });

    setTimeout(() => this.setState({ timerComplete: true }), 1000);
  }

  handleImageLoad(e) {
    this.setState({ imageLoaded: true });
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
          <HerbSummary herb={herb} slug={slug} family={family} />
          <div className="HerbContent">
            <div className="herbPhoto">
              <img
                src={`/images/photos/${slug}.jpg`}
                alt={herb.commonName[lang]}
                className={imageLoaded && timerComplete ? "loaded" : ""}
                onLoad={(e) => this.handleImageLoad(e)}
              />
            </div>
            <div className="mainText">
              <h1>{herb.commonName[lang]}</h1>
              <ReactMarkdown>{this.state.md}</ReactMarkdown>
              <h2>משפחת ה{family.name[lang]}</h2>
              <p>{family.description[lang]}</p>
            </div>
          </div>
        </main>
      </FadeInOut>
    );
  }
}

export default withRouter(HerbPage);
