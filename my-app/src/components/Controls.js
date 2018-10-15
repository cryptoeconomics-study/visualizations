import React, { Component } from 'react';



class Controls extends Component {
  constructor(props) {
    super(props)
    // this.state = {node: props.node}
  }
  render() {
    const {paused, onPause, onPauseTxs, pausedTxs, stepforward, stepbackward, rewind, fastforward, reset} = this.props
    return (
        <div id = "Controls">

          <button onClick={onPause}>{paused ? 'Resume' : 'Pause'}</button>
          <button onClick={onPauseTxs}>{pausedTxs ? 'Resume Txs' : 'Pause Txs'}</button>

        </div>
    );
  }
}

export default Controls;
