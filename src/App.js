import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import HerbPage from "./pages/HerbPage/HerbPage";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/herb/:slug">
          <HerbPage />
        </Route>
      </Router>
    );
  }
}

export default App;
