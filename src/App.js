import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
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
            <HomePage />
          </Route>
          <Route exact path="/about">
            <AboutPage />
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
