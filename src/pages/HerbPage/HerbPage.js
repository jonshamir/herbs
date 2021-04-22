import React from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import herbData from "../../data/herbData.json";

import "./HerbPage.scss";

const HerbPage = (props) => {
  let { slug } = useParams();
  const herb = herbData.filter((herb) => herb.slug === slug)[0];

  console.log(herb);

  return (
    <div className="HerbPage">
      <h1>{herb.hebrewName}</h1>
      <img className="HerbIcon" src={`/images/icons/${slug}.png`} />
    </div>
  );
};

export default HerbPage;
