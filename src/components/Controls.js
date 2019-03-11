import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import Switch from 'rc-switch';

const Controls = ({paused, onPause, onPauseTxs, pausedTxs, togglePopup, adjustSpeed}) => {
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
         <Button onClick={adjustSpeed}>
           <Glyphicon glyph="question-sign" />
         </Button>
        <Button onClick={togglePopup}>
          <Glyphicon glyph="question-sign" />
        </Button>
      </div>
  );
}

export default Controls;
