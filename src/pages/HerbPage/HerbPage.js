import React from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { withRouter } from "react-router-dom";
import lang from "../../lang";

import HerbSummary from "../../components/HerbSummary/HerbSummary";
import herbInfo from "../../data/herbInfo.json";
import familyInfo from "../../data/familyInfo.json";

import "./HerbPage.scss";

class HerbPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { md: "loading..." };
  }

  async componentDidMount() {
    const { slug } = this.props.match.params;
    // const slug = "bay-leaf";
    const response = await fetch(`/herb-pages/${slug}.md`);
    const text = await response.text();

    this.setState({
      md: text,
    });
  }

  render() {
    const { slug } = this.props.match.params;
    // const slug = "bay-leaf";
    const herb = herbInfo.filter((herb) => herb.slug === slug)[0];
    const familyName = herb.taxonomy.find((rank) =>
      rank.hasOwnProperty("Familia")
    ).Familia;
    const family = familyInfo[familyName.toLowerCase()];

    return (
      <motion.main
        className="HerbPage"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <HerbSummary herb={herb} slug={slug} family={family} />
        <div className="HerbContent">
          <div
            src={`/images/photos/${slug}.jpg`}
            className="herbPhoto"
            style={{ backgroundImage: `url("/images/photos/${slug}.jpg")` }}
          ></div>
          <h1>{herb.commonName[lang]}</h1>
          <ReactMarkdown>{this.state.md}</ReactMarkdown>
          <h2>משפחת ה{family.name[lang]}</h2>
          <p>{family.description[lang]}</p>
        </div>
      </motion.main>
    );
  }
}

export default withRouter(HerbPage);
