import React, { Component } from 'react';

class Ledger extends Component {
  render() {
    const {node, icons} = this.props

    const data = Object.keys(node.state).map(function(nodeId, i) {
      return (
        <tr key={i}>
          <td>{nodeId.substring(0,5)}</td>
          <td>{node.state[nodeId].balance}</td>
          <td>{node.state[nodeId].nonce}</td>
        </tr>
      )
    })
    let invalidNonceTxs = []
    Object.keys(node.invalidNonceTxs).forEach(function(address, i) {
      Object.keys(node.invalidNonceTxs[address]).forEach(function(nonce, i) {
        const tx = node.invalidNonceTxs[address][nonce]
        invalidNonceTxs.push(tx.contents)
      })
    })

    const nonceData = invalidNonceTxs.map(function(tx, i) {
      return (
        <tr key={i}>
          <td>{tx.from.substring(0,5)}</td>
          <td>{tx.to.substring(0,5)}</td>
          <td>{tx.amount}</td>
          <td>{tx.nonce}</td>
        </tr>
      )
    })
    const nonceTable =
    <div style = {invalidNonceTxs.length ? {} : {display: 'none'}}>
        <a>Invalid Nonce Transactions</a>
       <table>
         <tbody>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Nonce</th>
          </tr>
          { nonceData }
         </tbody>
        </table>
        </div>

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
          <img src={icons[node.pid]} width="30" />
          <span className="ledger-title">
            {' ' + node.pid.substring(0,5)}
          </span>
          <table>
           <tbody>
            <tr>
              <th>Address</th>
              <th>Balance</th>
              <th>Nonce</th>
              <th>            </th>
            </tr>
            { data }
           </tbody>
          </table>
          {nonceTable}
        </div>
    );
  }
}

export default Ledger;
