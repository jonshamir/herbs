import React from "react";
import HerbTree from "./components/HerbTree/HerbTree";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <HerbTree />
      </div>
    );
  }
}

export default App;
