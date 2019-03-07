import React from 'react';
import '../styles/App.css';
// import Sandbox from './Sandbox.js';
import Sandbox from './latency-based-consensus/Sandbox.js';



const App = () => {
  return (
    <div className="App">
      <Sandbox/>
    </div>
  );
}

export default App;
