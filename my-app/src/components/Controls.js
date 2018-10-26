import React, { Component } from 'react';



class Controls extends Component {
  render() {
    const {paused, onPause, onPauseTxs, pausedTxs, togglePopup} = this.props

    return (
        <div id = "Controls">
          <button onClick={onPause}>{paused ? 'Resume' : 'Pause'}</button>
          <button onClick={onPauseTxs}>{pausedTxs ? 'Resume Txs' : 'Pause Txs'}</button>

          <button onClick={togglePopup}>?</button>
        </div>
    );
  }
}

export default Controls;
