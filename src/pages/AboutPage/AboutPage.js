import React from "react";

import FadeInOut from "../../components/FadeInOut/FadeInOut";
import OutLink from "../../components/OutLink/OutLink";

import "./AboutPage.scss";

class AboutPage extends React.Component {
  render() {
    return (
      <FadeInOut className="AboutPage">
        <main>
          <h1>אודות האתר</h1>
          <p>
            מאת <OutLink href="https://jonshamir.com/">יונתן שמיר</OutLink>.
          </p>
          <p>
            תודה ל
            <OutLink href="http://nnhc.huji.ac.il/herbarium/">
              עשביית האוניברסיטה העברית
            </OutLink>{" "}
            על האירוח והגישה לאוספים.
          </p>
          <p>
            מידע על הסיווג המדעי של הצמחים מ-
            <OutLink href="https://species.wikimedia.org">Wikispecies</OutLink>.
          </p>
          <p>תודה לאמיתי גלעד, רונית ורד ונתיב דודאי על הייעוץ.</p>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <p>
            <img
              src="images/ui/bezalel.svg"
              className="BezalelLogo"
              alt="בצלאל"
            />
            בצלאל אקדמיה לאמנות ועיצוב
          </p>
          <p></p>
        </main>
      </FadeInOut>
    );
  }
}

export default AboutPage;
