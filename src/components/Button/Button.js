import React from "react";

import "./Button.scss";

const Nav = ({ children, ...rest }) => {
  return (
    <button {...rest} className="Button">
      {children}
    </button>
  );
};

export default Nav;
