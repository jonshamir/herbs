import React from "react";
import HerbTree from "./components/HerbTree/HerbTree";
import "./App.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <div className="ContentRight">
          <h1>עלה טעם</h1>
          <p>
            זה פה טקסט מויקיפדיה. עשבי תיבול הוא שם כולל לכל אותם צמחים אשר ניתן
            להשתמש בהם לתיבול 'כמו שהם' - ללא ייבוש, טחינה, בישול או עיבוד אחר
            כלשהו.
          </p>
          <p>
            במטבח הישראלי משמשים עשבי תיבול שמקורם במטבחי העדות השונות, בין השאר
            שמיר מהמטבח האשכנזי, כוסברה ונענע מהמטבח המזרחי, ובזיליקום ואורגנו
            שאומצו מהמטבח האיטלקי. פטרוזיליה משמשת במתכונים של מטבחי רוב העדות.
          </p>
          <p>
            רוב עשבי התבלין קלים לגידול, ואינם שיחים המצריכים גינה לשם גידולם,
            דבר זה מאפשר לגדל אותם באדניות או עציצים קטנים גם בבתים חסרי גינה אך
            בעלי חלון או מרפסת, וכך גם דיירי בניינים נהנים מעשבי תיבול טריים
            בתבשיליהם.
          </p>
        </div>
        <HerbTree />
      </div>
    );
  }
}

export default App;
