import React from "react";
import { Link } from "react-router-dom";
import Image from "../Image/Image";

import "./RecipePreview.scss";

const RecipePreview = ({ recipe }) => {
  const { title, herbs, slug, time, difficulty } = recipe;
  return (
    <Link to={`/recipes/${slug}`} className="RecipePreview">
      <Image
        className="RecipePhoto"
        src={`/images/recipes/${slug}/cover.jpg`}
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
        <p>
          {time} | {difficulty}
        </p>
      </div>
    </Link>
  );
};

export default RecipePreview;
