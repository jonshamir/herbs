import React from "react";

const OutLink = ({ href, children, ...rest }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

export default OutLink;
