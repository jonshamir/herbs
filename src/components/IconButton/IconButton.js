import React from "react";

import "./IconButton.scss";

const IconButton = ({ icon, label, ...rest }) => {
  return (
    <div className="IconButton">
      <img src={`/images/ui/${icon}.svg`} alt={label} className="Button" />
      <span>{label}</span>
    </div>
  );
};

export default IconButton;
