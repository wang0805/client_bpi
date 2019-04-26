import React, { Component } from "react";
// import logo from "./logo.svg";
// import bpi from "./bpi.png";
import "./App.css";
import AppProvider from "./components/store/provider";
import Fdashboard from "./components/dashboard/fdashboard";

class App extends Component {
  render() {
    return (
      <AppProvider>
        <Fdashboard {...this.props} />
      </AppProvider>
    );
  }
}

export default App;
