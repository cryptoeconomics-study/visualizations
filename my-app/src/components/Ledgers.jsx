import React, { Component } from 'react';
import Ledger from './Ledger.jsx'


class Ledgers extends Component {
  render() {
    const {nodes,
      //stepforward, stepbackward, rewind, fastforward, reset
    } = this.props

    return (
        <div id = "Ledgers">
        { 
        	Object.keys(nodes).map((pid, index) => ( 
        		<Ledger node={nodes[pid]}/>
        	))
        }
        </div>
    );
  }
}

export default Ledgers;
