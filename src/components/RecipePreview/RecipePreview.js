import React from "react";

import "./RecipePreview.scss";

const RecipePreview = ({ recipe }) => {
  const { title, herbs } = recipe;
  return (
    <div className="RecipePreview">
      {herbs.map((herbSlug) => (
        <img
          src={`/images/icons/${herbSlug}.png`}
          alt={herbSlug}
          key={herbSlug}
        />
      ))}
      <h2>{title}</h2>
    </div>
  );
};

export default RecipePreview;
