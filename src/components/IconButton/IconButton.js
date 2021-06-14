import React from "react";

import "./IconButton.scss";

const IconButton = ({ icon, label, ...rest }) => {
  return (
    <div className="IconButton">
      <button className="Button">
        <img src={`/images/ui/${icon}.svg`} alt={label} />
      </button>
      <span>{label}</span>
    </div>
  );
};

export default IconButton;
