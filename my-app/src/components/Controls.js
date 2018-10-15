import React, { Component } from 'react';



class Controls extends Component {
  constructor(props) {
    super(props)
    // this.state = {node: props.node}
  }
  render() {
    const {paused, onPause, onPauseTxs, pausedTxs, doubleSpend, clickedNode, stepforward, stepbackward, rewind, fastforward, reset} = this.props
    let doubleSpendButton;

    if (clickedNode) {
      doubleSpendButton = <button style={{background:"red", color:"white" }} onClick={()=>doubleSpend(clickedNode)}>Double Spend</button>
    } else {
      doubleSpendButton = <button disabled={true}>Double Spend</button>
    }

    return (
        <div id = "Controls">

          <button onClick={onPause}>{paused ? 'Resume' : 'Pause'}</button>
          <button onClick={onPauseTxs}>{pausedTxs ? 'Resume Txs' : 'Pause Txs'}</button>
          {doubleSpendButton}
        </div>
    );
  }
}

export default Controls;
