import React from "react";

import "./WindowHeader.scss";

const WindowHeader = (props) => (
  <div className="hero">
    <div className="WindowIllustration">
      <img src="images/illustrations/fan.png" className="fan" />

      <img src="images/illustrations/window.png" className="window" />
    </div>
    <h1>אדנית התבלינים</h1>
    <span className="tagline">~ מדריך שימושי לצמחי תבלין ~</span>
  </div>
);
export default WindowHeader;
