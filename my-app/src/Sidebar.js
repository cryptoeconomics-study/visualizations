import React, { Component } from 'react';
import {Graph, Node} from './react-d3-graph-custom/src/index';
import {nodes, network} from './c2_NetworkDoubleSpends/createNetSim'
import networkSim from  './c2_NetworkDoubleSpends/networksim.js'
import blockies from './blockies-svg.js'



class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {node: props.node}
  }
  componentWillReceiveProps(nextProps) {
      this.setState({node: nextProps.node});
  }
  render() {
    const clickedNode = this.state.node

    return (
        <div id = "Node-state">
          <a>{clickedNode ? ('Node ' + clickedNode.pid + '\n State:' + JSON.stringify(clickedNode.state) + '\n Invalid Nonce Txs:' +  JSON.stringify(clickedNode.invalidNonceTxs)) : 'No node selected.'}</a>
        </div>
    );
  }
}

export default Sidebar;
