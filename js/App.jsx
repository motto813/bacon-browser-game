import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Landing from "./Landing";
import GamePlay from "./GamePlay";

const FourOhFour = () => <h1>404</h1>;

const App = () => (
  <BrowserRouter>
    <div className="app">
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/games" component={() => <GamePlay />} />
        <Route component={FourOhFour} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
