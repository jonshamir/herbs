import React from "react";

import recipeInfo from "../../data/recipeInfo.json";

import FadeInOut from "../../components/FadeInOut/FadeInOut";
import RecipePreview from "../../components/RecipePreview/RecipePreview";

import "./AllRecipesPage.scss";

const AllRecipesPage = (props) => {
  return (
    <FadeInOut className="AllRecipesPage PageContainer">
      <main>
        <h1>מתכונים</h1>
        {recipeInfo.map((recipe) => (
          <RecipePreview key={recipe.slug} recipe={recipe} />
        ))}
      </main>
    </FadeInOut>
  );
};

export default AllRecipesPage;
