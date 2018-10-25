import React, { Component } from 'react';
import {Graph} from './react-d3-graph-custom/src/index';
import {nodes, network} from '../c2_NetworkDoubleSpends/createNetSim'
import Controls from './Controls.js'
import Ledgers from './Ledgers.jsx'
import Instructions from './Instructions.jsx'
import Tray from './Tray.jsx'
// import Parameters from './Parameters.js'
import clone  from 'clone';

const ICONS = [
  'https://i.imgur.com/Wi9yFXw.png',
  'https://i.imgur.com/U5Y99Rm.png',
  'https://i.imgur.com/NPH4rqg.png',
  'https://i.imgur.com/MptO0GC.png',
  'https://i.imgur.com/yHwPVBF.png',
  'https://i.imgur.com/yvv1MMb.png',
  'https://i.imgur.com/I4Dlkik.png',
  'https://i.imgur.com/jNB8LS6.png'
]

// graph payload (with minimalist structure)
const data = {
  nodes: [],
  links: []
}

let iconMap = {}
for (let i = 0; i < nodes.length; i++) {
  // add peers
  data.nodes.push({
    id: nodes[i].pid,
    name: nodes[i].pid.slice(0, 5),
    gerbil: ICONS[i]
  })
  iconMap[nodes[i].pid] = ICONS[i]
}
for (const node of nodes) {
  // connect them
  for (const peer of network.peers[node.pid]) {
    data.links.push({
      source: node.pid,
      target: peer.pid
    })
  }
}

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
  automaticRearrangeAfterDropNode: true,
  staticGraph: false,
  nodeHighlightBehavior: true,
  node: {
      size: 400,
      highlightStrokeColor: 'blue',
      labelProperty: 'name'
  },
  link: {
      highlightColor: 'lightblue'
  }
};

const onClickLink = function(source, target) {
     window.alert(`Clicked link between ${source} and ${target}`);
};

const onMouseOverLink = function(source, target) {
     // window.alert(`Mouse over in link between ${source} and ${target}`);
};

const onMouseOutLink = function(source, target) {
     // window.alert(`Mouse out link between ${source} and ${target}`);
};

class Network extends Component {
  constructor() {
    super()
    this.state = {clickedNode: null, selectedNodes:{}, history: [], paused: false, pausedTxs: true, speed: 10}
  }

  componentDidMount() {
    for (let node of nodes) {
      this.showState(node)
    }
  }

  setMessageQueue(network){
    let oldQ = network.messageQueue
    var newQ = []
    Object.keys(oldQ).forEach(function(key,index) {
      for (let message of oldQ[key]) {
        newQ.push({...message, rcvTime: key})
      }
    });
    return newQ
  }

  tick() {
    network.tick()
    const history = this.state.history
    history.push(clone(network)) // push a deep clone of the network object
    this.setState({history: history})
  }

  //sets Messages
  getTick(time) {
    const {history, selectedNodes, clickedNode} = this.state
    if(time > history.length) {
      throw new Error('You skipped a time step!')
    } else if (time === history.length ) {
      this.tick()
    }
    let messages = this.setMessageQueue(history[time])
    // Update states if agent already clicked
    if (clickedNode){
      const node = this.getNode(clickedNode.pid, time)
      this.setState({clickedNode: node})
    }

    for (var nodeId in selectedNodes) {
      selectedNodes[nodeId] = this.getNode(nodeId, time)
    }

    this.setState({selectedNodes: selectedNodes, messages: messages, time: time})
  }

  getNode (nodeId, time) {
    const currNetwork = this.state.history[time]
    if (currNetwork) {
      return currNetwork.agents.find((node) => {
        return node.pid === nodeId;
      });
    }
  }

  getCurrNode(nodeId) {
    if (network) {
      return network.agents.find((node) => {
        return node.pid === nodeId;
      });
    }
  }

  onClickNode (nodeId) {
    const {clickedNode, time} = this.state
    const node = this.getNode(nodeId, time)
    // console.log('Clicked node', node.state, node.invalidNonceTxs)

    if (clickedNode && node.pid === clickedNode.pid) {
      this.setState({clickedNode: null})
    } else {
      this.setState({clickedNode: node})
    }
  };

  onMouseOverNode (nodeId) {
    // const node = getNode(nodeId)
    // this.setState({clickedNode: node})
    // if not clicked, highlight node in green
  };

  onMouseOutNode (nodeId) {
    // if(!this.state.isNodeClicked) this.setState({clickedNode: this.state.prevNode})
    // if not clicked, change nodes color back to normal
  }

  pause(){
    this.setState({ paused: !this.state.paused })
    //this.state.speed = 1    //(reset FF/Rewind)
  }
  pauseTxs(){
    this.setState({ pausedTxs: !this.state.pausedTxs })
    for(let node of nodes) {
      node.pausedSpending = !node.pausedSpending
    }
  }

  rewind(){
    let speed = this.state.speed
    if(speed*1.5 > 10){
      return
    }
    this.setState({speed : speed *= 1.5})
    console.log('rewind', speed)
  }

  fastforward(){
    let speed = this.state.speed
    if(speed/1.5 < .005){
      return
    }
    this.setState({speed : speed /= 1.5})
    console.log('fastforward', speed)
  }

  stepbackward(){
    console.log('stepbackward')
    const {time} = this.state
    if(time < 1){
      return
    }
    this.setState({paused:true})
    this.graph.step(time - 1)
    this.getTick(time - 1)
    this.graph.animate()
    //this.graph.setState({messages: this.setMessageQueue(this.history[time])})
  }

  stepforward(){
    console.log('stepforward')
    const {time} = this.state
    this.setState({paused:true})
    this.graph.step(time + 1)
    this.getTick(time + 1)
    this.graph.animate()
  }

  doubleSpend(evilNode){
    const drEvil = evilNode.pid
    const victims = [network.peers[drEvil][0], network.peers[drEvil][1]]
    const spends = [evilNode.generateTx(victims[0].wallet.address, 10), evilNode.generateTx(victims[1].wallet.address, 10)]
    spends[0].isDoubleSpend = true
    spends[1].isDoubleSpend = true
    network.broadcastTo(drEvil, victims[0], spends[0])
    network.broadcastTo(drEvil, victims[1], spends[1])

    console.log("Double spender:", drEvil, "victims:", victims, "spends:", spends)
  }

  spend(currNode){
    const node = this.getCurrNode(currNode.pid)
    const tx = node.generateTx(node.getRandomReceiver(), 10)
    node.transactions.push(tx)
    node.applyTransaction(tx)
    // Broadcast this tx to the network
    network.broadcast(node.pid, tx)

    // initiate random spend
  }

  showState(node){
    // create popup with state
    const {selectedNodes} = this.state
    if (selectedNodes[node.pid]) {
      delete selectedNodes[node.pid]
    } else {
      selectedNodes[node.pid] = node
    }
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  visibleState(node){
    return !!this.state.selectedNodes[node.pid]
  }

  deselectNode(){
    this.setState({clickedNode: null})
  }

  reset(){
    console.log('reset')
    this.getTick(0)
  }
  setSpeed(value){
    let speed = value/1000.0
    this.setState({speed : speed})
    console.log("speeedooo", speed)

  }
  setLatency(event){
    let raw = event.target.value
    let scaled = Math.min(Math.max(parseInt(raw), 1), 10)
    console.log("latency", raw, scaled)

  }
  setPacketLoss(event){
    let raw = event.target.value
    let scaled = Math.min(Math.max(parseInt(raw), 1), 20)
    console.log("packetloss", raw, scaled)

  }
  render() {
    const {clickedNode, selectedNodes, messages, time, paused, pausedTxs, speed} = this.state
    return (
      <div id="App-container">
        <div id="Text-container">
          <div id="Overflow-top"></div>
          <h3>2.2: The Double Spend</h3><div id="Text">Building a centralized payments processor like Paypal is simple, but relies on trust that Paypal will not break the rules. A simple way to decentralize PayPal is to make clients download all transactions and run the PayPal code to generate their belief of the current state. {/* In this section we see why this is not enough, how to mentally model a network & synchrony assumptions.<br/><br/>

  <b>Synchronous network</b><br/>Global clock, & there is a known (constant) latency L in which all messages are assumed to be received. For instance all messages propagate in 5 seconds.<br/><br/>

  <b>Partially Synchronous network</b><br/>There is some unknown latency L in which all messages are assumed to be received. It is important to note that this latency is unknown and could be extremely high.<br/><br/>

  <b>Asynchronous network</b><br/>Local clock, & there are no timing assumptions made. We are not able to determine objectively the time ordering of transactions, though each individual node still has an idea of what order it saw messages arrive in (and different nodes can disagree). */}<br/><br/>

 In a decentralized system, we cannot rely on a global clock, and we cannot assume a constant latency for all messages to be delivered.<br/><br/>

  This is the root cause of the double spend problem: an attacker can send one message to Jing & another message to Karl each spending the same coins. If Jing and Karl both accept those transactions, their states will diverge and we will have a fork. Not good! We need decentralized consensus!
            </div>
          <div id="Overflow-bottom"></div>
        </div>
        <div id = "Network-container">
          <div id = "Graph-container">
            <Tray
              nodes={nodes}
              selectedNodes={selectedNodes}
              showState = {this.showState.bind(this)}
              icons = {iconMap}
            />
            <Ledgers
              nodes={selectedNodes}
              icons = {iconMap}/>
            <Graph ref={instance => { this.graph = instance; }}
             id='graph-id' // id is mandatory, if no id is defined rd3g will throw an error
             data={data}
             config={myConfig}
             onClickNode={this.onClickNode.bind(this)}
             clickedNode = {clickedNode}
             onClickLink={onClickLink}
             onMouseOverNode={this.onMouseOverNode.bind(this)}
             onMouseOutNode={this.onMouseOutNode.bind(this)}
             onMouseOverLink={onMouseOverLink}
             onMouseOutLink={onMouseOutLink}
             doubleSpend = {this.doubleSpend.bind(this)}
             spend = {this.spend.bind(this)}
             showState = {this.showState.bind(this)}
             deselectNode = {this.deselectNode.bind(this)}
             visibleState = {this.visibleState.bind(this)}
             messages={messages}
             time={time}
             speed={speed}
             paused={paused}
             onTick = {this.getTick.bind(this)}
             nodeState = {this.getNode.bind(this)}/>
          </div>
          <div id="Input-container">
            <div id="Controls-container">
              <Controls
              onPause = {this.pause.bind(this)}
              onPauseTxs = {this.pauseTxs.bind(this)}
              paused = {paused}
              pausedTxs = {pausedTxs}
              togglePopup = {this.togglePopup.bind(this)}
              stepbackward = {this.stepbackward.bind(this)}
              stepforward = {this.stepforward.bind(this)}
              rewind = {this.rewind.bind(this)}
              fastforward = {this.fastforward.bind(this)}
              reset = {this.reset.bind(this)}/>
            </div>
            {/*<div id="Parameters-container">
              <Parameters
              setSpeed = {this.setSpeed.bind(this)}
              setLatency = {this.setLatency.bind(this)}/>
            </div>*/}
          </div>
        </div>
        <Instructions
        show= {this.state.showPopup}
        handleClose={this.togglePopup.bind(this)}
        />
      </div>
    );
  }
}

export default Network;
