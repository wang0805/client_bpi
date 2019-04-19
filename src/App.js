import React, { Component } from "react";
// import logo from "./logo.svg";
import bpi from "./bpi.png";
import "./App.css";
import AppProvider from "./components/store/provider";

import Form from "./components/form";

class App extends Component {
  render() {
    return (
      <AppProvider>
        <div className="App">
          <header className="App-header">
            <img src={bpi} className="App-logo" alt="logo" />
            <div>
              INPUT
              <Form />
            </div>
          </header>
        </div>
      </AppProvider>
    );
  }
}

export default App;
