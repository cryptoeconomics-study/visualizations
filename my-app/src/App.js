import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Network from './Network.js';



class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Understanding Consensus</h1>
        </header>
        <Network/>
      </div>
    );
  }
}

export default App;
