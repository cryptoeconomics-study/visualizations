import React, { Component } from 'react';

class Instructions extends Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup-inner'>
          <button onClick={this.props.closePopup}>close me</button>
          <h1>Instructions</h1>
        </div>
        <div className = 'instruction-text'>
          <p>
          This is a simulation of a peer-to-peer network of nodes all running their own individual Paypal client. The color of each node/ledger is just the hash of the node's state turned into a color! If two nodes have the same exact color, they are in agreement about the state of the ledger!
          <br></br>
          Click on a node to view node-specific controls like spending or double spending.
          <br></br>
          Click "Pause" to pause the simulation. Click it again to play the simulation again.
          <br></br>
          Click "Send Transactions" to make the nodes randomly send transactions to one another.
          </p>
        </div>
      </div>
    );
  }
}

export default Instructions;
