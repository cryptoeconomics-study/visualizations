import React from 'react';

const NodeControls = ({doubleSpend, spend, hide}) => {
  return (
      <div id = "NodeControls">
        <button id = "doubleSpend" onClick={()=> {
          doubleSpend()
          hide()
        }}>
          Double Spend
        </button>
        <button id = "spend" onClick={()=> {
          spend()
          hide()
        }}>
          Spend
        </button>
      </div>
  );
}

export default NodeControls;
