import React from "react";

import FadeInOut from "../../components/FadeInOut/FadeInOut";
import RecipePreview from "../../components/RecipePreview/RecipePreview";

import "./AllRecipesPage.scss";

const AllRecipesPage = (props) => {
  return (
    <FadeInOut className="AllRecipesPage PageContainer">
      <main>
        <h1>מתכונים</h1>
        <RecipePreview title="תערובת זעתר" slug="zaatar-spice" />
        <RecipePreview title="עוגיות רוזמרין" slug="rosemary-cookies" />
        <RecipePreview title="סלט פומלה תאילנדי" slug="yum-som-o" />
        <RecipePreview
          title="גלידת זעתר עם סירופ סומק ועוגיות שומשום"
          slug="zaatar-ice-cream"
        />
        <RecipePreview title="סחוג" slug="zhoug" />
        <RecipePreview title="לבבות ארטישוק בעלי דפנה" slug="bay-artichoke" />
      </main>
    </FadeInOut>
  );
};

export default AllRecipesPage;
