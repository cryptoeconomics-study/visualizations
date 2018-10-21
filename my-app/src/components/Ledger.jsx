import React, { Component } from 'react';

class Ledger extends Component {
  render() {
    const {node, icons} = this.props

    const data = Object.keys(node.state).map(function(nodeId, i) {
      return (
        <tr key={i}>
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

    const backgroundColor = Number.parseInt(node.color.slice(1), 16)

    const r = (backgroundColor >> 16) & 0xff
    const g = (backgroundColor >> 8) & 0xff
    const b = backgroundColor & 0xff

    const brightness = (r * 0.299 + g * 0.587 + b * 0.114)/255

    let textColor = "white"
    if (brightness > 0.5) {
      textColor = "black"
    }

    return (
        <div className="Ledger" id={"ledger-" + node.pid} style={{ backgroundColor: node.color, color: textColor }}>
          <img src={icons[node.pid]} width="50" />
          <span className="ledger-title">
            {node.pid.substring(0,5)}
          </span>
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
