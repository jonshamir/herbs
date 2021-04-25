import React from "react";
import { Redirect } from "react-router-dom";
import HerbTree from "../../components/HerbTree/HerbTree";
import "./HomePage.scss";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirect: null };
  }

  handleNodeClick = (node) => {
    this.setState({ redirect: `/herb/${node.slug}` });
  };

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} push />;

    return (
      <div className="HomePage">
        <div className="hero">
          <div className="WindowIllustration">
            <img src="images/illustrations/fan.png" className="fan" />

            <img src="images/illustrations/window.png" className="window" />
          </div>
          <h1>אדנית התבלינים</h1>
          <span className="tagline">~ מדריך שימושי לצמחי תבלין ~</span>
        </div>
        <div className="columns">
          <div className="ContentRight">
            <h2>פה יש הסבר על העץ</h2>
            <p>
              אך זה למעשה טקסט מויקיפדיה. עשבי תיבול הוא שם כולל לכל אותם צמחים
              אשר ניתן להשתמש בהם לתיבול 'כמו שהם' - ללא ייבוש, טחינה, בישול או
              עיבוד אחר כלשהו.
            </p>
            <p>
              במטבח הישראלי משמשים עשבי תיבול שמקורם במטבחי העדות השונות, בין
              השאר שמיר מהמטבח האשכנזי, כוסברה ונענע מהמטבח המזרחי, ובזיליקום
              ואורגנו שאומצו מהמטבח האיטלקי. פטרוזיליה משמשת במתכונים של מטבחי
              רוב העדות.
            </p>
            <p>
              רוב עשבי התבלין קלים לגידול, ואינם שיחים המצריכים גינה לשם גידולם,
              דבר זה מאפשר לגדל אותם באדניות או עציצים קטנים גם בבתים חסרי גינה
              אך בעלי חלון או מרפסת, וכך גם דיירי בניינים נהנים מעשבי תיבול
              טריים בתבשיליהם.
            </p>
          </div>
          <div className="ContentLeft">
            <HerbTree onNodeClick={this.handleNodeClick} />
            <ul className="TabSelect">
              <li>מקור גיאוגרפי</li>
              <li className="active">עץ גנטי</li>
              <li>מפת טעמים</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
