import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Network from './Network.js';



class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Cryptoeconomics.study!</h1>
        </header>
        <Network/>
      </div>
    );
  }
}

export default App;
