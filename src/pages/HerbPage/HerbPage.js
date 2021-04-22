import React from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
// import "./HerbPage.scss";

const HerbPage = (props) => {
  let { id } = useParams();

  return (
    <div className="HerbPage">
      <h1>עמוד צמח</h1>
      <h2>{id}</h2>
    </div>
  );
};

export default HerbPage;
