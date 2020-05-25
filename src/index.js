import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import Login from "./components/login";
import Edit from "./components/edit";
import Transactions from "./components/transactions";

const Routing = (props) => (
  <BrowserRouter>
    <React.Fragment>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" render={() => <Login />} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/updateid/:id" component={Edit} />
      </Switch>
    </React.Fragment>
  </BrowserRouter>
);

ReactDOM.render(<Routing />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
