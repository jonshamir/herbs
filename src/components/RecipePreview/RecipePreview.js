import React from "react";

import "./RecipePreview.scss";

const RecipePreview = ({ recipe }) => {
  const { title, herbs, slug } = recipe;
  return (
    <div className="RecipePreview">
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
    </div>
  );
};

export default RecipePreview;
