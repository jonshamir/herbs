import React from "react";

import "./Button.scss";

const Nav = (props) => {
  return <button className="Button">{props.children}</button>;
};

export default Nav;
