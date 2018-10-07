import React, { Component } from 'react';
import {Graph, Node} from './react-d3-graph-custom/src/index';
import {nodes, network} from './c2_NetworkDoubleSpends/createNetSim'
import networkSim from  './c2_NetworkDoubleSpends/networksim.js'
import Sidebar from './Sidebar.js'
import Controls from './Controls.js'
import Parameters from './Parameters.js'
import clone  from 'clone';

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
    svg: ICONS[i]
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
    this.state = {clickedNode: null, history: []}
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
    console.log('time:', time, 'history at time:', history[time])
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
    return currNetwork.agents.find((node) => {
      return node.pid === nodeId;
    });
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
    //this.state.speed = 1    //(reset FF/Rewind)
    // this.state.pause ^= 1  //toggle pause
  }

  rewind(){
    console.log('rewind')
    // this.state.speed *= 1.5
  }

  fastforward(){
    console.log('fastforward')
    // this.state.speed /= 1.5
  }

  stepbackward(){
    console.log('stepbackward')
    const {clickedNode, time} = this.state
    if(time < 1){
      return
    }
    this.getTick(time - 1)
  }

  stepforward(){
    console.log('stepforward')
    const {clickedNode, time} = this.state
    this.getTick(time + 1)
  }
  
  reset(){
    console.log('reset')
    const {clickedNode, time} = this.state
    this.getTick(0)
  }
  setSpeed(event){
    let raw = event.target.value
    let scaled = Math.min(Math.max(parseInt(raw), 1), 5)
    console.log("speeedooo", raw, scaled)

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
    const {clickedNode, messages, time} = this.state

    return (
      <div>
        <div id = "Network-graph">
          <Graph
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
           speed={0.01}
           onTick = {this.getTick.bind(this)}/>
        </div>
        <div id = "Node-state">
        <Sidebar node = {clickedNode}/>
        <Controls 
          pause = {this.pause.bind(this)}
          stepbackward = {this.stepbackward.bind(this)}
          stepforward = {this.stepforward.bind(this)}
          rewind = {this.rewind.bind(this)}
          fastforward = {this.fastforward.bind(this)}
          reset = {this.reset.bind(this)}/>
        <Parameters
          setSpeed = {this.setSpeed.bind(this)}
          setLatency = {this.setLatency.bind(this)}
          setPacketLoss = {this.setPacketLoss.bind(this)}/> 
        </div>
      </div>
    );
  }
}

export default Network;
