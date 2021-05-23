import React from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { withRouter } from "react-router-dom";
import lang from "../../lang";

import herbInfo from "../../data/herbInfo.json";

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
    const altNames = herb.altNames[lang];

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
          <table className="InfoTable">
            <tbody>
              <tr>
                <td colSpan="2" className="scientificName">
                  {herb.name}
                </td>
              </tr>
              <tr>
                <th>באנגלית</th>
                <td>{herb.commonName["en"]}</td>
              </tr>
              {altNames && (
                <tr>
                  <th>שמות נוספים</th>
                  <td>{altNames}</td>
                </tr>
              )}
              <tr>
                <th>משפחה</th>
                <td>משפחה</td>
              </tr>
              <tr>
                <th>צורת חיים</th>
                <td>
                  {herb.lifeform[lang]} {herb.lifecycle[lang]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="HerbContent">
          <h1>{herb.commonName[lang]}</h1>
          <ReactMarkdown>{this.state.md}</ReactMarkdown>
        </div>
        <img src={`/images/photos/${slug}.jpg`} class="herbPhoto" />
      </motion.div>
    );
  }
}

export default withRouter(HerbPage);
