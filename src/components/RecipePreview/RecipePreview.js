import React from "react";

import "./RecipePreview.scss";

const RecipePreview = ({ slug, title }) => {
  return (
    <div className="RecipePreview">
      <h2>{title}</h2>
    </div>
  );
};

export default RecipePreview;
