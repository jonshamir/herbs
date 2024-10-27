import React from "react";

import FadeInOut from "../../components/FadeInOut/FadeInOut";
import OutLink from "../../components/OutLink/OutLink";

import "./AboutPage.scss";

const AboutPage = () => {
  return (
    <FadeInOut className="AboutPage PageContainer">
      <main>
        <h1>About</h1>
        <p>
          Project by&nbsp;
          <OutLink href="https://jonshamir.com/">Jon Shamir</OutLink>
        </p>
        <p>
          Taxonomy information taken from{" "}
          <OutLink href="https://species.wikimedia.org">Wikispecies</OutLink>
        </p>
        <p>
          Typefaces: <OutLink href="https://www.lexend.com/">Lexend</OutLink> +{" "}
          <OutLink href="https://github.com/iaolo/iA-Fonts">
            iA writter Quattro
          </OutLink>
        </p>
        <p>Github link</p>
        <br />
        <br />
        <br />
        <br />
        <p></p>
      </main>
    </FadeInOut>
  );
};

export default AboutPage;
