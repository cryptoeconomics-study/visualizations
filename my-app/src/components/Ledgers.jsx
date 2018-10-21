import React, { Component } from 'react';
import Ledger from './Ledger.jsx'


class Ledgers extends Component {
  render() {
    const {nodes, icons} = this.props

    return (
        <div id = "Ledgers">
        {
        	Object.keys(nodes).map((pid, index) => (
        		<Ledger key={pid} node={nodes[pid]} icons={icons}/>
        	))
        }
        </div>
    );
  }
}

export default Ledgers;
