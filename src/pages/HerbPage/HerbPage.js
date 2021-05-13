import React from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { withRouter } from "react-router-dom";
import herbData from "../../data/herbData.json";

import "./HerbPage.scss";

class HerbPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { md: "loading..." };
  }

  async componentDidMount() {
    // const { slug } = this.props.match.params;
    const slug = "bay-leaf";
    const file = await import(`../../data/herbs/${slug}.md`);
    const response = await fetch(file.default);
    const text = await response.text();

    this.setState({
      md: text,
    });
  }

  render() {
    const { slug } = this.props.match.params;
    // const slug = "bay-leaf";
    const herb = herbData.filter((herb) => herb.slug === slug)[0];

    return (
      <motion.div
        className="HerbPage"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="HerbInfo">
          <img
            className="HerbIcon"
            src={`/images/icons/${slug}.png`}
            alt={slug}
          />
        </div>
        <div className="HerbContent">
          <h1>{herb.hebrewName}</h1>
          <ReactMarkdown>{this.state.md}</ReactMarkdown>
        </div>
      </motion.div>
    );
  }
}

export default withRouter(HerbPage);
