import React from "react";
import { Redirect } from "react-router-dom";
import { debounce } from "lodash";
import HerbTree from "../../components/HerbTree/HerbTree";
// import WindowHeader from "../../components/WindowHeader/WindowHeader";
import "./HomePage.scss";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirect: null, introOpacity: 1 };
  }

  componentDidMount() {
    const debouncedHandleScroll = debounce(this.handleScroll, 10);
    window.addEventListener("scroll", debouncedHandleScroll);
  }

  handleScroll = () => {
    const currScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const totalHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const distToBottom = totalHeight - currScroll;

    const opacityThreshold = 100;

    if (distToBottom > opacityThreshold) {
      if (this.state.introOpacity !== 0) this.setState({ introOpacity: 0 });
    } else {
      this.setState({ introOpacity: 1 - distToBottom / opacityThreshold });
    }
  };

  handleNodeClick = (node) => {
    this.setState({ redirect: `/herb/${node.slug}` });
  };

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} push />;
    const { introOpacity } = this.state;
    const introDisplay = introOpacity > 0 ? "block" : "none";

    return (
      <div className="HomePage">
        <HerbTree onNodeClick={this.handleNodeClick} />
        <div
          className="intro"
          style={{ opacity: introOpacity, display: introDisplay }}
        >
          <h1>על טעם וריח</h1>
          <h2>מדריך שימושי לעשבי תיבול</h2>
          <p>
            צמחים שעליהם משמשים להוסיף טעם למאכלים ומשקאות. הרבה מעשבי התיבול
            המוכרים ביותר כיום, כגון בזיליקום, פטרוזיליה ואורגנו, התפתחו
            אבולוציונית באזור הים התיכון. באופן כללי, ניתן ללמוד הרבה על צמח
            מהשיוך הגנטי שלו - איך כדאי לגדל אותו, איך לבשל איתו ואילו טעמים הוא
            עשוי להכיל.
          </p>
          <p>
            העץ שלפניכם מציג את השיוך הגנטי של צמחי תבלין נפוצים. שורש העץ מייצג
            את האב הקדמון של כל הצמחים בכדור הארץ. כל ענף מכיל צמחים בעלי מקור
            גנטי משותף, שבא לידי ביטוי גם במאפיינים שונים של הצמח. עברו עם העכבר
            על נקודות שונות בעץ כדי לגלות עוד פרטים.
          </p>
        </div>
      </div>
    );
  }
}

export default HomePage;
