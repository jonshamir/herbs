import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import IntroPage from "./pages/IntroPage/IntroPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import RecipePage from "./pages/RecipePage/RecipePage";
import HerbPage from "./pages/HerbPage/HerbPage";
import HerbTree from "./components/HerbTree/HerbTree";
import Search from "./components/Search/Search";
import Menu from "./components/Menu/Menu";

const App = () => {
  const [shouldShowIntro, setShouldShowIntro] = useState(true);
  const history = useHistory();
  const location = useLocation();

  const handleNodeClick = (node) => {
    history.push(`/herb/${node.slug}`);
  };

  return (
    <div>
      <Menu />
      <Search />
      <HerbTree onNodeClick={handleNodeClick} />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/">
            <HomePage shouldShowIntro={shouldShowIntro} />
          </Route>
          <Route exact path="/intro">
            <IntroPage onMount={() => setShouldShowIntro(false)} />
          </Route>
          <Route exact path="/about">
            <AboutPage />
          </Route>
          <Route exact path="/recipes">
            <RecipePage />
          </Route>
          <Route path="/herb/:slug">
            <HerbPage />
          </Route>
        </Switch>
      </AnimatePresence>
    </div>
  );
};

export default App;
