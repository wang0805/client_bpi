import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Link } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import Login from "./components/login";
import Edit from "./components/edit";

const Routing = props => (
  <BrowserRouter>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>

      <Route exact path="/" component={App} />
      <Route path="/login" render={() => <Login />} />
      <Route path="/updateid/:id" component={Edit} />
    </div>
  </BrowserRouter>
);

ReactDOM.render(<Routing />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
