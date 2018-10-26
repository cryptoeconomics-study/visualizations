import React, { Component } from 'react';
import Ledger from './Ledger.jsx'


class Ledgers extends Component {
  render() {
    const {nodes, icons, showState} = this.props

    return (
        <div id = "Ledgers">
        {
        	Object.keys(nodes).map((pid, index) => (
        		<Ledger key={pid} node={nodes[pid]} icons={icons} showState={showState}/>
        	))
        }
        </div>
    );
  }
}

export default Ledgers;
