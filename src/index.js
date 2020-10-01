import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import Login from "./components/login";
import Edit from "./components/edit";
import Transactions from "./components/transactions";
import Form from "./components/form";
// import Client from "./components/client";
import Client2 from "./components/client2";

import Blotter from "./components/blotter";
import Manualinput from "./components/manualinput";

import AppProvider from "./components/store/provider";

const Routing = (props) => (
  <AppProvider>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" render={() => <Login />} />
        <Route path="/form" component={Form} />
        <Route path="/blotter" component={Blotter} />
        <Route path="/invoice" component={Client2} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/manualinput" component={Manualinput} />
        <Route path="/updateid/:id" component={Edit} />
      </Switch>
    </BrowserRouter>
  </AppProvider>
);

ReactDOM.render(<Routing />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
