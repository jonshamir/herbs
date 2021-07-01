import React from "react";

import FadeInOut from "../../components/FadeInOut/FadeInOut";
import OutLink from "../../components/OutLink/OutLink";

import "./AboutPage.scss";

const AboutPage = (props) => {
  return (
    <FadeInOut className="AboutPage PageContainer">
      <main>
        <h1>אודות האתר</h1>
        <p>מאת יונתן שמיר</p>
        <p>
          תמונות הצמחים באתר צולמו ב
          <OutLink href="http://nnhc.huji.ac.il/herbarium/">
            עשביית האוניברסיטה העברית
          </OutLink>
          <br />
          תודה על האירוח והגישה לאוספים
        </p>
        <p>
          מידע על הסיווג המדעי של הצמחים מ-
          <OutLink href="https://species.wikimedia.org">Wikispecies</OutLink>
        </p>
        <p>תודה לאמיתי גלעד על ההנחייה והליווי</p>
        <p>תודה לרונית ורד על ההשראה והייעוץ הקולינרי</p>
        <p>תודה לפרופ' נתיב דודאי על המידע המדעי</p>
        <p>תודה לטורקיה על הייעוץ, המתכונים והבישולים המשותפים</p>
        <p>תודה לשי על התמיכה והעזרה בהכל</p>

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
};

export default AboutPage;
