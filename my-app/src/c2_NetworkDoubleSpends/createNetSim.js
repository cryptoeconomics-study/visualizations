var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('./networksim')
var {Node, getTxHash} = require('./nodeAgent')

// Spender is a Node that sends a random transaction at every tick()
class Spender extends Node {
  constructor (wallet, genesis, network) {
    super(wallet, genesis, network)
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
    if (this.state[this.wallet.address].balance < 10) {
      console.log('We are honest so we wont send anything :)')
      return
    }
    // Generate random transaction 5% of the time
    console.log(Math.round((new Date()).getTime() / 10000))
    if(Math.random() < 0.005 && (Math.round((new Date()).getTime() / 10000) % 3 === 0)) {
      const tx = this.generateTx(this.getRandomReceiver(), 10)
      this.transactions.push(tx)
      this.applyTransaction(tx)
      // Broadcast this tx to the network
      this.network.broadcast(this.pid, tx)
    }
  }
}

// ****** Test this out using a simulated network ****** //
const numNodes = 5
const wallets = []
const genesis = {}
const network = new NetworkSimulator(50, 0);
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
  nodes.push(new Spender(wallets[i], JSON.parse(JSON.stringify(genesis)), network))
  network.connectPeer(nodes[i], 2)
}

module.exports = {nodes, network}
