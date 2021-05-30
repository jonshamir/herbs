import React from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import HerbPage from "./pages/HerbPage/HerbPage";
import HerbTree from "./components/HerbTree/HerbTree";
import Search from "./components/Search/Search";

const App = () => {
  const history = useHistory();
  const location = useLocation();

  const handleNodeClick = (node) => {
    history.push(`/herb/${node.slug}`);
  };

  return (
    <div>
      <Search />
      <HerbTree
        isMinimal={location.pathname !== "/"}
        onNodeClick={handleNodeClick}
      />
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
    </div>
  );
};

export default App;
