import React, { Component } from 'react';



class NodeControls extends Component {
  render() {
    const {doubleSpend, spend, showState, hide, visibleState} = this.props
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
            {visibleState() ? 'Hide State' : 'Show State'}
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
}

export default NodeControls;
