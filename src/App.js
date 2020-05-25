import React, { Component } from "react";
// import logo from "./logo.svg";
// import bpi from "./bpi.png";
import "./App.css";
import Fdashboard from "./components/dashboard/fdashboard";

class App extends Component {
  render() {
    return <Fdashboard {...this.props} />;
  }
}

export default App;
