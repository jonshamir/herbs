import React from "react";
import { Redirect } from "react-router-dom";
import HerbTree from "../../components/HerbTree/HerbTree";
// import WindowHeader from "../../components/WindowHeader/WindowHeader";
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
        <div className="">
          <HerbTree onNodeClick={this.handleNodeClick} />
          <div className="intro">
            <h2>צמחי תבלין</h2>
            <p>
              מאז ימי קדם בני אדם משתמשים בצמחים להוסיף טעם למנות. הרבה מצמחי
              התבלין המוכרים לנו כיום במטבח המערבי התפתחו באזור הים התיכון,
              ומצויים ברחבי הארץ.
            </p>
            <p>
              בעץ תוכלו לראות את השיוך הגנטי של צמחי תבין נפוצים. שורש האץ מייצג
              את האב הקדמון של כל הצמחים בכדור הארץ. כל ענף מכיל צמחים בעלי מקור
              גנטי משותף, שבא לידי ביטוי גם במאפיינים שונים של הצמח.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
