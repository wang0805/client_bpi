import React, { Component } from "react";
// import logo from "./logo.svg";
import bpi from "./bpi.png";
import "./App.css";
import AppProvider from "./components/store/provider";

import Form from "./components/form";
import Transactions from "./components/transactions";
import Grid from "@material-ui/core/Grid";

class App extends Component {
  render() {
    return (
      <AppProvider>
        <div className="App">
          <header className="App-header">
            <img src={bpi} className="App-logo" alt="logo" />
            <div style={{ width: "100%", marginLeft: 10 }}>
              INPUT
              <div>
                <Grid container spacing={24}>
                  <Grid item sm={12} md={6}>
                    <Form />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    RIGHT
                  </Grid>
                </Grid>
              </div>
              <Transactions {...this.props} />
            </div>
          </header>
        </div>
      </AppProvider>
    );
  }
}

export default App;
