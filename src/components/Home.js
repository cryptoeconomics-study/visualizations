import React from 'react';
import '../styles/App.css';
import NaiveSandbox from './Sandbox.js';
import LatencySandbox from './latency-based-consensus/Sandbox.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Home = () => {
  return (
      <div>
      <h1>Sandboxes</h1>
        <ul>
          <li>
            <Link to="/naive-consensus">2.1 - Naive Consensus</Link>
          </li>
          <li>
            <Link to="/latency-based-consensus">2.3 - Latency-based Consensus</Link>
          </li>
        </ul>
        <hr />
      </div>
  )
}

export default Home;
