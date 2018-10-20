import React, { Component } from 'react';



class NodeControls extends Component {
  render() {
    const {doubleSpend, spend, showState} = this.props
    return (
        <div id = "NodeControls">
          <button id = "doubleSpend" onClick={()=>doubleSpend()}>
            Double Spend
          </button>
          <button id = "showState" onClick={()=>showState()}>
            Show State
          </button>
        </div>
    );
  }
}

export default NodeControls;
