var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('./networksimFT')
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
    if(Math.random() < 0.01) {
      const tx = this.generateTx(this.getRandomReceiver(), 10)
      // Broadcast this tx to the network
      this.network.broadcast(this.pid, tx)
    }
  }
}

// ****** Test this out using a simulated network ****** //
const numNodes = 5
const wallets = []
const genesis = {}
const latency = 15 //10-15 ticks per message
const packetLoss = 0
const delta = 16
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
