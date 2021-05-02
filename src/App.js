import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/*">
          <HomePage />
        </Route>
      </Router>
    );
  }
}

export default App;
