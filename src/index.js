import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { App } from "./App";
import { Create } from "./Create";
import { SignIn, SignUp } from "./Authentication";
import { BrowserRouter, Route, Switch } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/create">
        <Create />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/app">
        <App />
      </Route>
      <Route path="/">
        <SignIn />
      </Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
