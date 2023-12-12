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
          Project by &nbsp;
          <OutLink href="https://www.instagram.com/yonshamir/">
            Jon Shamir
          </OutLink>
        </p>
        <p>
          Plant specimens photographed at the{" "}
          <OutLink href="http://nnhc.huji.ac.il/herbarium/">
            Hebrew University Herbarium
          </OutLink>
          <br />
          תודה על האירוח והגישה לאוספים
        </p>
        <p>
          taxonomy information taken from{" "}
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
        <p>
          <img
            src="/herbs/images/ui/bezalel.svg"
            className="BezalelLogo"
            alt="בצלאל"
          />
          Bezalel
        </p>
        <p></p>
      </main>
    </FadeInOut>
  );
};

export default AboutPage;
