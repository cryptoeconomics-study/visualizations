var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('../networksim')
var FaultTolerant = require('./FaultTolerant')

class FTSpender extends FaultTolerant {
  constructor (wallet, genesis, network, delta) {
    super(wallet, genesis, network, delta)
    this.pausedSpending = true
  }

  // returns a random wallet address (excluding the Spender)
  getRandomReceiver () {
    const that = this
    // create array without this Node
    const otherNodes = nodes.filter(function (n) {
      return n.wallet.address !== that.wallet.address
    });
    const randomNode = otherNodes[Math.floor(Math.random() * otherNodes.length)]
    return randomNode.wallet.address
  }

  tick () {
    // If we have no money, don't do anything!
    super.tick()
    if (this.state[this.wallet.address].balance < 10 || this.pausedSpending ) {
      return
    }
    // Generate random transaction .5% of the ticks
    if(Math.random() < 0.1) {
      this.sendTx(this.getRandomReceiver(), 10)
      // const tx = this.generateTx(this.getRandomReceiver(), 10)
      // if (this.seen.includes(tx.contents)) return
      // const sigs = this.addressesFromSigs(tx)
      // //TODO catch error if first signee is not tx sender
      // if(this.network.time >= this.timeout(tx.contents.timestamp, sigs.size)) return
      // //seen tx
      // this.seen.push(tx.contents)
      // //TODO Check that each signee is actually a peer in the network
      //   //-possible attack: byzantine node signs a message 100 times with random Private Key
      // const finalTimeout = this.timeout(tx.contents.timestamp, this.network.agents.length)
      // if (!this.pendingTxs[finalTimeout]) this.pendingTxs[finalTimeout] = []
      // //add to pending ( we'll apply this transaction once we hit finalTimeout)
      // this.pendingTxs[finalTimeout].push(tx)
      // //Choice rule: if have two transactions with same sender, nonce, and timestamp apply the one with lower sig first
      // this.pendingTxs[finalTimeout].sort((a, b)=>{
      //   return a.sigs[0] - b.sigs[0]
      // })
      // // Broadcast this tx to the network
      // this.nonce++
      // this.network.broadcast(this.pid, tx)
    }
  }
}

// ****** Test this out using a simulated network ****** //
const numNodes = 5
const wallets = []
const genesis = {}
const latency = 15 //10-15 ticks per message
const packetLoss = 0
const delta = latency
const numConnections = 2
const network = new NetworkSimulator(latency, packetLoss);
for (let i = 0; i < numNodes; i++) {
  // Create new identity
  wallets.push(EthCrypto.createIdentity())
  // Add that node to our genesis block & give them an allocation
  genesis[wallets[i].address] = {
    balance: 100,
    nonce: 0
  }
}
const nodes = []
// Create new nodes based on our wallets, and connect them to the network
for (let i = 0; i < numNodes; i++) {
  nodes.push(new FTSpender(wallets[i], JSON.parse(JSON.stringify(genesis)), network, delta))
  network.connectPeer(nodes[i], numConnections)
}

module.exports = {nodes, network}
