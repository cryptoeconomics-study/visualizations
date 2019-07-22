import React from 'react';
import '../styles/App.css';
import Home from './Home';
import NaiveSandbox from './Sandbox.js';
import LatencySandbox from './latency-based-consensus/Sandbox.js';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <div className="App">
      <NaiveSandbox/>
{/*      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/naive-consensus" component={NaiveSandbox} />
          <Route path="/latency-based-consensus" component={LatencySandbox} />
        </Switch>
      </Router>*/}
    </div>
  )
}


export default App;
