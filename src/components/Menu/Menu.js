import React from "react";
import { Link, withRouter } from "react-router-dom";

import IconButton from "../IconButton/IconButton";

import "./Menu.scss";

const Menu = (props) => {
  let className = "Menu";
  const routeParts = props.location.pathname.split("/");
  const logoOnly = routeParts[1] === "herb";

  if (logoOnly) className += " logoOnly";

  return (
    <nav className={className}>
      <Link to="/" className="LogoIcon">
        <img src="/images/ui/logo.svg" alt="על טעם וריח" />
      </Link>
      <div className="IconButtonContainer">
        <Link to="/recipes">
          <IconButton icon="recipes" label="מתכונים" />
        </Link>
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
