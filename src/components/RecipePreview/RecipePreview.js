import React from "react";
import { Link } from "react-router-dom";

import "./RecipePreview.scss";

const RecipePreview = ({ recipe }) => {
  const { title, herbs, slug } = recipe;
  return (
    <Link to={`/recipes/${slug}`} className="RecipePreview">
      <img
        className="RecipePhoto"
        src={`/images/recipes/${slug}.jpg`}
        alt={title}
      />
      <div className="RecipeInfo">
        {herbs.map((herbSlug) => (
          <img
            className="HerbIcon"
            src={`/images/icons/${herbSlug}.png`}
            alt={herbSlug}
            key={herbSlug}
          />
        ))}
        <h2>{title}</h2>
      </div>
    </Link>
  );
};

export default RecipePreview;
