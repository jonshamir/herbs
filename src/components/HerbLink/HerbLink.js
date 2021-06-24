import React from "react";
import { Link } from "react-router-dom";

import "./HerbLink.scss";

const HerbLink = ({ slug, title, inline }) => {
  const herbUrl = `/herb/${slug}`;
  return inline ? (
    <Link to={herbUrl} className="InlineHerbLink">
      <span className="herbSmallIcon">
        <img src={`/images/icons/${slug}.png`} />
      </span>
      <span className="linkText">{title}</span>
    </Link>
  ) : (
    <Link to={herbUrl} className="HerbLink">
      <img src={`/images/icons/${slug}.png`} alt={title} />
      {title}
    </Link>
  );
};

export default HerbLink;
