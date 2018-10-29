import React, { Component } from 'react';
import { Button, Glyphicon, Well} from 'react-bootstrap';
import Switch from 'rc-switch';


class Controls extends Component {
  render() {
    const {paused, onPause, onPauseTxs, pausedTxs, togglePopup} = this.props

    return (
        <div id = "Controls">
          <Button onClick={onPause}>{paused ?
            <Glyphicon glyph="play" />
           : <Glyphicon glyph="pause" />}</Button>
          <div id="txToggle">
          Send Transactions <Switch
             onChange={onPauseTxs}
           />
           </div>
          <Button onClick={togglePopup}>
            <Glyphicon glyph="question-sign" />
          </Button>
        </div>
    );
  }
}

export default Controls;
