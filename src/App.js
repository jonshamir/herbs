import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import IntroPage from "./pages/IntroPage/IntroPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import AllRecipesPage from "./pages/AllRecipesPage/AllRecipesPage";
import RecipePage from "./pages/RecipePage/RecipePage";
import HerbPage from "./pages/HerbPage/HerbPage";
import HerbTree from "./components/HerbTree/HerbTree";
import Search from "./components/Search/Search";
import Menu from "./components/Menu/Menu";

let DEBUG = false;

// refresh if no interaction
let timeout;
document.onmousemove = function () {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    window.location.href = "/";
  }, 5 * 60 * 1000);
};

const App = () => {
  const history = useHistory();
  const location = useLocation();

  if (window.history.scrollRestoration)
    window.history.scrollRestoration = "manual";

  const [shouldShowIntro, setShouldShowIntro] = useState(
    location.pathname === "/"
  );

  const handleNodeClick = (node) => {
    history.push(`/herb/${node.slug}`);
  };

  return (
    <div>
      <Menu />
      <Search />
      <HerbTree onNodeClick={handleNodeClick} debug={DEBUG} />
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
            <AllRecipesPage />
          </Route>
          <Route exact path="/recipes/:slug">
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
