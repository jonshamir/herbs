import React from "react";

import FadeInOut from "../../components/FadeInOut/FadeInOut";

import "./RecipePage.scss";

class RecipePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FadeInOut className="RecipePage">
        <h1>אודות</h1>
      </FadeInOut>
    );
  }
}

export default RecipePage;
