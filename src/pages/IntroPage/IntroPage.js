import React from "react";
import lang from "../../lang";
import { motion } from "framer-motion";

import Button from "../../components/Button/Button";

import "./IntroPage.scss";

const IntroPage = (props) => {
  return (
    <motion.div
      className="IntroPage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <main>
        <div className="P1">
          <h1>על טעם וריח</h1>
          <h2>מדריך לעשבי תיבול במטבח</h2>
          <Button>מה זה?</Button>
          <Button>דלג ></Button>
        </div>
        <div className="P2">
          <p>כל הצמחים בעולם התפתחו מאב קדמון אחד.</p>
        </div>
        <div className="P2">
          <p>
            במשך מאות מיליוני שנים הצמחים התפתחו לאינספור זנים שונים. לרבים מהם
            מצאו בני האדם שימושים: לבנות בתים, לרקום בדים, ואולי השימוש החשוב
            ביותר - מאכל.
          </p>
        </div>
      </main>
    </motion.div>
  );
};

export default IntroPage;
