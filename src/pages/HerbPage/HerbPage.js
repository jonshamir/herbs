import React from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import herbData from "../../data/herbData.json";

import "./HerbPage.scss";

const HerbPage = (props) => {
  let { slug } = useParams();

  return (
    <div className="HerbPage">
      <h1>עמוד צמח</h1>
      <h2>{slug}</h2>
      <img className="HerbIcon" src={`/images/icons/${slug}.png`} />
    </div>
  );
};

export default HerbPage;
