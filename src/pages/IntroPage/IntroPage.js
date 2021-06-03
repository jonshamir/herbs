import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Button from "../../components/Button/Button";
import FadeInOut from "../../components/FadeInOut/FadeInOut";

import "./IntroPage.scss";

const IntroPage = (props) => {
  const [page, setPage] = useState(0);

  return (
    <FadeInOut className="IntroPage">
      <AnimatePresence exitBeforeEnter>
        {renderPage(page, setPage)}
      </AnimatePresence>
      <Link to="/" className="Skip">
        <Button>דלג ></Button>
      </Link>
    </FadeInOut>
  );
};

const renderPage = (page, setPage) => {
  switch (page) {
    case 0:
      return (
        <FadeInOut className="page P0" key="P0">
          <h1>על טעם וריח</h1>
          <h2>מדריך לעשבי תיבול במטבח</h2>
          <Button onClick={() => setPage(1)}>מה הקטע?</Button>
        </FadeInOut>
      );
    case 1:
      return (
        <FadeInOut className="page P1" key="P1">
          <div className="ProtoPlant"></div>
          <p>כל הצמחים בעולם התפתחו מאב קדמון אחד.</p>
          <Button onClick={() => setPage(2)}>אוקיי</Button>
        </FadeInOut>
      );
    case 2:
      return (
        <FadeInOut
          className="page P2"
          key="P2"
          style={{
            backgroundImage: "url('/images/tree-bg-big.jpg')",
          }}
        >
          <p>לאורך עידנים הצמחים השתנו, התפצלו והתפתחו לאינספור זנים שונים.</p>
          <Button onClick={() => setPage(3)}>סבבה</Button>
        </FadeInOut>
      );
    case 3:
      return (
        <FadeInOut
          className="page P3"
          key="P3"
          style={{
            backgroundImage: "url('/images/tree-bg-small.jpg')",
          }}
        >
          <p>
            האתר שלפניכם נותן הצצה לעץ החיים הענק הזה, דרך צמחי התבלין.
            <br />
            בנוסף תוכלו למצוא הסברים, מתכונים, ושימושים לצמחים השונים.
          </p>
          <Link to="/">
            <Button>יאללה!</Button>
          </Link>
        </FadeInOut>
      );
    default:
      return "";
  }
};

export default IntroPage;
