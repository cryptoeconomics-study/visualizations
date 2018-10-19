import React, { Component } from 'react';



class Controls extends Component {
  render() {
    const {paused, onPause, onPauseTxs, pausedTxs, doubleSpend, clickedNode,
      //stepforward, stepbackward, rewind, fastforward, reset
    } = this.props
    let nodeControls = "";

    if (clickedNode) {
      nodeControls =
        <div id = "nodeControls">
          <button id = "doubleSpend"
            onClick={()=>doubleSpend(clickedNode)}
          >
            Double Spend
          </button>
{/*          <button
            onClick={()=>createTransaction(clickedNode)}
          >
            Create Transaction
          </button>*/}
        </div>

    }

    return (
        <div id = "Controls">

          <button onClick={onPause}>{paused ? 'Resume' : 'Pause'}</button>
          <button onClick={onPauseTxs}>{pausedTxs ? 'Resume Txs' : 'Pause Txs'}</button>
          {nodeControls}
        </div>
    );
  }
}

export default Controls;
