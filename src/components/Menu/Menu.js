import React from "react";
import { Link, withRouter } from "react-router-dom";

import IconButton from "../IconButton/IconButton";

import "./Menu.scss";

const Menu = (props) => {
  let className = "Menu";
  const logoOnly = props.history.location.pathname !== "/";

  if (logoOnly) className += " logoOnly";

  return (
    <nav className={className}>
      <Link to="/">
        <img src="/images/ui/logo.svg" className="LogoIcon" alt="על טעם וריח" />
      </Link>
      <div className="IconButtonContainer">
        <Link to="/intro">
          <IconButton icon="help" label="מה זה?" />
        </Link>
        <Link to="/about">
          <IconButton icon="about" label="אודות" />
        </Link>
      </div>
    </nav>
  );
};

export default withRouter(Menu);
