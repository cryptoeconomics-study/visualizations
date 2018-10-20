import React, { Component } from 'react';

class Ledger extends Component {
  render() {
    const {node,
      //stepforward, stepbackward, rewind, fastforward, reset
    } = this.props

    const data = Object.keys(node.state).map(function(nodeId) {
      return (
        <tr> 
          <td>{nodeId.substring(0,10)}</td>
          <td>{node.state[nodeId].balance}</td>
          <td>{node.state[nodeId].nonce}</td>
        </tr>
      )
    })

    const getInvalidNonceTxs = (address) => {
      if (node.invalidNonceTxs && node.invalidNonceTxs[address]){
        return JSON.stringify(node.invalidNonceTxs[address])
      } else return 'None'
    }

    const color = node.color

    return (
        <div className="Ledger" id={"ledger-" + node.pid} style={{ backgroundColor: color }}>
          <span className="ledger-title">Node {node.pid.substring(0,10)}</span>
          <table>
           <tbody>
            <tr>
              <th>Address</th>
              <th>Balance</th>
              <th>Nonce</th>
            </tr>
            { data }
           </tbody>
          </table>
          {/*<Table columns= {columns} data = {data} expandedRowRender={record => {return 'Invalid Nonce Txs: ' + getInvalidNonceTxs(record.key)}} expandIconAsCell/>*/}
        </div>
    );
  }
}

export default Ledger;
