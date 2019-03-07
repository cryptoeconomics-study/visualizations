import React, { Component } from 'react';
import _ from 'lodash'

class Ledger extends Component {
  constructor(props) {
    super(props)
    this.invalidNonceTxs = []
  }

  updateInvalidNonceTxs() {
    const {invalidNonceTxs} = this
    const {node} = this.props
    const newTxs = []
    const updatedInvalidNonceTxs = []

    Object.keys(node.invalidNonceTxs).forEach(function(address, i) {
      Object.keys(node.invalidNonceTxs[address]).forEach(function(nonce, i) {
        const tx = node.invalidNonceTxs[address][nonce]
        newTxs.push(tx.contents)
      })
    })
    //add Old txs into updatedInvalidNonceTxs if it's in the array of new txs
    for (let tx of invalidNonceTxs) {
      const hasOldTx = newTxs.find(newTx => _.isEqual(newTx, tx))
      if (hasOldTx) {
        updatedInvalidNonceTxs.push(tx)
      }
    }
    //add all new txs into updatedInvalidNonceTxs
    for(let newTx of newTxs) {
      const hasNewTx = updatedInvalidNonceTxs.find(tx => _.isEqual(newTx, tx))
      if (!hasNewTx) {
        updatedInvalidNonceTxs.push(newTx)
      }
    }
    this.invalidNonceTxs = updatedInvalidNonceTxs
  }

  clicked(showState, node) {
    showState(node)
  }

  render() {
    const {node, icons, showState} = this.props

    this.updateInvalidNonceTxs()

    const data = Object.keys(node.state).map(function(nodeId, i) {
      return (
        <tr key={i}>
          <td>{nodeId.substring(0,5)}</td>
          <td>{node.state[nodeId].balance}</td>
          <td>{node.state[nodeId].nonce}</td>
        </tr>
      )
    })

    const nonceData = this.invalidNonceTxs.map(function(tx, i) {
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
      <div style = {this.invalidNonceTxs.length ? {} : {display: 'none'}}>
        <p>Invalid Nonce Transactions</p>
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
          <img alt="Gerbil" src={icons[node.pid]} width="30" />
          <span className="ledger-title">
            {' ' + node.pid.substring(0,5)}
          </span>
          <button className="LedgerMinimizeButton" onClick={(e) => this.clicked(showState, node)}>
            <div className="LedgerMinimizeButtonIcon" style={{ backgroundColor: textColor }}></div>
          </button>
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
