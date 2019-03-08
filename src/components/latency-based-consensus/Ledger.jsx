import React, { Component } from 'react';
import _ from 'lodash'
import CircularProgressbar from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

class Ledger extends Component {
  constructor(props) {
    super(props)
    this.invalidNonceTxs = []
    this.pendingTxs = []
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

  updatePendingTxs() {
    const {node} = this.props
    const pendingTxs = []
    Object.keys(node.pendingTxs).forEach((timeout, i) => {
      for (let tx of node.pendingTxs[timeout]) {
        pendingTxs.push({...tx, timeout: timeout})
      }
    })
    this.pendingTxs = pendingTxs
  }

  clicked(showState, node) {
    showState(node)
  }

  render() {
    const {node, icons, showState} = this.props
    this.updateInvalidNonceTxs()
    this.updatePendingTxs()
    const pendingTxData = this.pendingTxs.map(function(tx, i) {
      const percentage = Math.floor(100*(node.network.time - tx.contents.timestamp)/(tx.timeout-tx.contents.timestamp))
      console.log('percentage:', percentage, 'color: #', tx.sigs[0].slice(2,8))
      return (
        <tr key={i}>
          <td>{tx.contents.from.substring(0,5)}</td>
          <td>{tx.contents.to.substring(0,5)}</td>
          <td>{tx.contents.amount}</td>
          <td>
          <div style={{ width: '50px' }}>
            <CircularProgressbar
              percentage={percentage}
              strokeWidth={50}
              key = {tx.sigs[0]}
              textForPercentage={null}
              styles={{
                path: {
                  strokeLinecap: 'butt',
                  stroke: '#' + tx.sigs[0].slice(2,8)
                },
                text: { fill: '#000' },
              }}
            />
            </div>
          </td>
        </tr>
      )
    })
    const pendingTxTable =
    <div style = {this.pendingTxs.length ? {} : {display: 'none'}}>
      <p>Pending Transactions</p>
      <table>
        <tbody>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Timeout</th>
          </tr>
          { pendingTxData }
       </tbody>
      </table>
    </div>

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

    const data = Object.keys(node.state).map(function(nodeId, i) {
      return (
        <tr key={i}>
          <td>{nodeId.substring(0,5)}</td>
          <td>{node.state[nodeId].balance}</td>
          <td>{node.state[nodeId].nonce}</td>
        </tr>
      )
    })

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
          {pendingTxTable}
          {nonceTable}
        </div>
    );
  }
}

export default Ledger;
