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
          <OutLink href="https://www.instagram.com/yonshamir/">
            Jon Shamir
          </OutLink>
        </p>
        <p>
          Plant specimens photographed at the{" "}
          <OutLink href="http://nnhc.huji.ac.il/herbarium/">
            Hebrew University Herbarium
          </OutLink>
        </p>
        <p>
          taxonomy information taken from{" "}
          <OutLink href="https://species.wikimedia.org">Wikispecies</OutLink>
        </p>
        <p>Typefaces: Lexend + iA writter Quattro</p>
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
