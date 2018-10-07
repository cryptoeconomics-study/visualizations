import React, { Component } from 'react';
import {Graph, Node} from './react-d3-graph-custom/src/index';
import {nodes, network} from './c2_NetworkDoubleSpends/createNetSim'
import networkSim from  './c2_NetworkDoubleSpends/networksim.js'
import Sidebar from './Sidebar.js'
import Controls from './Controls.js'
import Parameters from './Parameters.js'
import clone  from 'clone';
const _ = require('lodash')

const ICONS = [
  'https://i.imgur.com/Wi9yFXw.png',
  'https://i.imgur.com/BBUyb4e.png',
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

for (let i = 0; i < nodes.length; i++) {
  // add peers
  data.nodes.push({
    id: nodes[i].pid,
    name: nodes[i].pid.slice(0, 10),
    // svg: ICONS[i]
  })
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
        size: 120,
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
// }

const delay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration))

class Network extends Component {
  constructor() {
    super()
    this.state = {clickedNode: null, history: [], paused: false, speed: 10}
  }
  componentDidMount() {
    //run when play is hit
    // try {
    //   this.run(300).then(()=>{
    //     this.getTick(200)
    //   }
    //   )
    // } catch (e) {
    // }
  }
  async run (steps) {
    for (let i = 0; i < steps; i++) {
      this.getTick(i)
      await delay(10)
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
    history.push(clone(network))
    this.setState({history: history})
  }
  //
  //sets Messages
  getTick(time) {
    const {history, clickedNode} = this.state
    if(time > history.length) {
      throw new Error('You skipped a time step!')
    } else if (time === history.length ) {
      this.tick()
    }
    // console.log('time:', time, 'history at time:', history[time])
    let messages = this.setMessageQueue(history[time])
    // Update states if agent already clicked
    if (clickedNode){
      const node = this.getNode(clickedNode.pid, time)
      this.setState({clickedNode: node, isNodeClicked: true})
    }
    this.setState({messages: messages, time: time})
  }

  getNode (nodeId, time) {
    const currNetwork = this.state.history[time]
    if (currNetwork) {
      return currNetwork.agents.find((node) => {
        return node.pid === nodeId;
      });
    }
  }

  onClickNode (nodeId) {
    const {clickedNode, time} = this.state
    const node = this.getNode(nodeId, time)
    // console.log('Clicked node', node.state, node.invalidNonceTxs)
    if (clickedNode && node.pid === clickedNode.pid) {
      this.setState({clickedNode: null, isNodeClicked: false})
    } else {
      this.setState({clickedNode: node, isNodeClicked: true})
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
    console.log('pause')
    this.setState({ paused: !this.state.paused })
    //this.state.speed = 1    //(reset FF/Rewind)
    // this.state.pause ^= 1  //toggle pause
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
    const {clickedNode, time} = this.state
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
    const {clickedNode, time} = this.state
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
  
  reset(){
    console.log('reset')
    const {clickedNode, time} = this.state
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
    const {clickedNode, messages, time, paused, speed} = this.state

    return (
      <div id="App-container">
        <div id="Text-container"><h3>V2: A Distributed Ledger</h3><div id="Text">Building a centralized payments processor like Paypal is simple, but relies on trust that Paypal will not break the rules. A simple way to decentralize PayPal is to make clients download all transactions and run the PayPal code to generate their belief of the current state.  In this section we see why this is not enough, how to mentally model a network & synchrony assumptions.<br/><br/>

<b>Synchronous network</b> -- Global clock, & there is a known (constant) latency L in which all messages are assumed to be received. For instance all messages propagate in 5 seconds.<br/><br/>

<b>Partially Synchronous network</b> -- There is some unknown latency L in which all messages are assumed to be received. It is important to note that this latency is unknown and could be extremely high.<br/><br/>

<b>Asynchronous network</b> -- Local clock, & there are no timing assumptions made. We are not able to determine objectively the time ordering of transactions, though each individual node still has an idea of what order it saw messages arrive in (and different nodes can disagree).<br/><br/>

In a decentralized system, we cannot rely on a global clock, and we cannot assume a constant latency for all messages to be delivered.<br/><br/>

This is the root cause of the double spend problem: an attacker can send one message to Jing & another message to Aparna each spending the same coins. If Jing and Aparna both accept those transactions, their states will diverge and we will have a fork. Not good! We need decentralized consensus!</div></div>
        <div id = "Network-container-">
          <Graph ref={instance => { this.graph = instance; }}
           id='graph-id' // id is mandatory, if no id is defined rd3g will throw an error
           data={data}
           config={myConfig}
           onClickNode={this.onClickNode.bind(this)}
           onClickLink={onClickLink}
           onMouseOverNode={this.onMouseOverNode.bind(this)}
           onMouseOutNode={this.onMouseOutNode.bind(this)}
           onMouseOverLink={onMouseOverLink}
           onMouseOutLink={onMouseOutLink}
           messages={messages}
           time={time}
           speed={speed}
           paused={paused}
           onTick = {this.getTick.bind(this)}
           nodeState = {this.getNode.bind(this)}/>
          <div id="input-container">
            <div id="Controls-container">
              <Controls 
              pause = {this.pause.bind(this)}
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
        <div id="Sidebar-container">
          <Sidebar id="Sidebar"
          node = {clickedNode}
          doubleSpend = {this.doubleSpend.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default Network;