import React, { Component } from 'react';
import Table from 'rc-table'
import 'rc-table/assets/index.css';

const columns = [{
    title: 'Address', dataIndex: 'address', key:'address', width: 200,
  }, {
    title: 'Balance', dataIndex: 'balance', key:'balance', width: 100,
  }, {
    title: 'Nonce', dataIndex: 'nonce', key:'nonce', width: 50,
  }];


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
    const data = (clickedNode) ?
      Object.keys(clickedNode.state).map(nodeId => { return {...clickedNode.state[nodeId], address: nodeId.substring(0,10), key: nodeId}}) : null
    const getInvalidNonceTxs = (address) => {
      if (clickedNode.invalidNonceTxs && clickedNode.invalidNonceTxs[address]){
        return JSON.stringify(clickedNode.invalidNonceTxs[address])
      } else return 'None'
    }
    //<p>{'Node ' + clickedNode.pid + '\n State:' + JSON.stringify(clickedNode.state) + '\n Invalid Nonce Txs:' +  JSON.stringify(clickedNode.invalidNonceTxs)
    return (
        <div id = "Node-state">
          {clickedNode ? (
            <div>
              <h4>Node {clickedNode.pid.substring(0,10)}</h4>
              <Table columns= {columns} data = {data} expandedRowRender={record => {return 'Invalid Nonce Txs: ' + getInvalidNonceTxs(record.key)}} expandIconAsCell/>
              <button style={{background:"red"}} onClick={()=>doubleSpend(clickedNode)}>Double Spend</button>
            </div>) :
            'No node selected.'
          }

        </div>
    );
  }
}

export default Sidebar;
