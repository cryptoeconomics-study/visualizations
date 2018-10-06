const NetworkSimulator = require('./networksim')

class NetworkHistory extends NetworkSimulator {
  constructor (latency, packetLoss) {
    super(latency, packetLoss)
    this.history = []
  }
  tick () {
    super.tick();
    for (let a of this.agents) {
      //store state and invalid nonce txs of agents at each tick
    }
    //store message queue
  }
}

module.exports = NetworkHistory
