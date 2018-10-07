import React, { Component } from 'react';



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
    const doubleSpend = this.props.doubleSpend
    return (
        <div id = "Node-state">
          {clickedNode ? (<div><p>{'Node ' + clickedNode.pid + '\n State:' + JSON.stringify(clickedNode.state) + '\n Invalid Nonce Txs:' +  JSON.stringify(clickedNode.invalidNonceTxs)}</p><button style={{background:"red"}} onClick={()=>doubleSpend(clickedNode)}>Double Spend</button></div>): 'No node selected.' }

        </div>
    );
  }
}

export default Sidebar;
