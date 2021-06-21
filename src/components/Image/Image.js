import React, { useState, useEffect } from "react";

import "./Image.scss";

const Image = ({
  alt,
  ratio = 1,
  style = {},
  className = "",
  minTimeToLoad = 400,
  ...rest
}) => {
  const [hasImageLoaded, setHasImageLoaded] = useState(false);
  const [isTimerComplete, setIsTimerComplete] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsTimerComplete(true), minTimeToLoad);
  });

  const onImageLoaded = (event) => {
    setHasImageLoaded(true);
  };

  return (
    <div className={"imageWrapper " + className}>
      <img
        {...rest}
        onLoad={onImageLoaded}
        className={hasImageLoaded && isTimerComplete ? "image loaded" : "image"}
        alt={alt}
      />
    </div>
  );
};

export default Image;
