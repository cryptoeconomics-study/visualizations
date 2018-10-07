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

    return (
        <div id = "Node-state">
          <a>{clickedNode ? ('Node ' + clickedNode.pid + '\n State:' + JSON.stringify(clickedNode.state) + '\n Invalid Nonce Txs:' +  JSON.stringify(clickedNode.invalidNonceTxs)) : 'No node selected.'}</a>
        </div>
    );
  }
}

export default Sidebar;
