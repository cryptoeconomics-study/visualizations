import React, { Component } from 'react';



class NodeControls extends Component {
  render() {
    const {doubleSpend, spend, showState, hide} = this.props
    return (
        <div id = "NodeControls">
          <button id = "doubleSpend" onClick={()=> {
            doubleSpend()
            hide()
          }}>
            Double Spend
          </button>
          <button id = "showState" onClick={()=> {
            showState()
            hide()
          }}>
            Show State
          </button>
        </div>
    );
  }
}

export default NodeControls;
