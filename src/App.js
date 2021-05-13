import React from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Switch, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import HerbPage from "./pages/HerbPage/HerbPage";

const App = () => {
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <Switch location={location} key={location.pathname}>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/herb/:slug">
          <HerbPage />
        </Route>
      </Switch>
    </AnimatePresence>
  );
};

export default App;
