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
        <div id="Text-container"><div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed libero enim sed faucibus turpis. Placerat vestibulum lectus mauris ultrices eros in cursus. Dolor magna eget est lorem. Lacus sed turpis tincidunt id aliquet risus feugiat in. Turpis tincidunt id aliquet risus feugiat in ante. Sed vulputate mi sit amet mauris commodo quis. Nisl nunc mi ipsum faucibus vitae aliquet nec. Cras fermentum odio eu feugiat pretium nibh. Purus viverra accumsan in nisl nisi scelerisque eu. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam eget. Sapien faucibus et molestie ac feugiat. Arcu felis bibendum ut tristique et. Egestas congue quisque egestas diam. Etiam non quam lacus suspendisse faucibus interdum. Tincidunt dui ut ornare lectus sit. Dictum sit amet justo donec enim diam vulputate. Lorem ipsum dolor sit amet consectetur adipiscing.

Eu sem integer vitae justo eget magna fermentum. Odio tempor orci dapibus ultrices. Amet purus gravida quis blandit turpis cursus in hac habitasse. Augue mauris augue neque gravida in fermentum et sollicitudin. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Velit egestas dui id ornare arcu odio. Tellus integer feugiat scelerisque varius. Felis donec et odio pellentesque diam. Sagittis id consectetur purus ut faucibus pulvinar elementum integer. Leo vel orci porta non pulvinar neque.

Augue neque gravida in fermentum et. Leo duis ut diam quam nulla porttitor massa id. Hac habitasse platea dictumst quisque sagittis. Tortor at auctor urna nunc id. Phasellus vestibulum lorem sed risus ultricies tristique nulla. Nisl nisi scelerisque eu ultrices vitae auctor eu augue ut. Iaculis eu non diam phasellus vestibulum lorem sed risus. Porttitor rhoncus dolor purus non enim. Augue mauris augue neque gravida in fermentum et sollicitudin. Cras tincidunt lobortis feugiat vivamus at. Nulla porttitor massa id neque aliquam vestibulum morbi. Vitae proin sagittis nisl rhoncus. Consectetur libero id faucibus nisl. In iaculis nunc sed augue lacus.

Sodales neque sodales ut etiam sit amet nisl. Quam quisque id diam vel quam elementum pulvinar. Ac orci phasellus egestas tellus rutrum tellus. Consequat nisl vel pretium lectus quam id leo in vitae. Habitant morbi tristique senectus et. At tempor commodo ullamcorper a lacus vestibulum sed arcu. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Tristique senectus et netus et malesuada fames ac turpis. Porttitor lacus luctus accumsan tortor posuere ac ut consequat semper. Magna etiam tempor orci eu lobortis. Tortor posuere ac ut consequat se</div></div>
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
          <div id="Controls">
            <Controls 
            pause = {this.pause.bind(this)}
            stepbackward = {this.stepbackward.bind(this)}
            stepforward = {this.stepforward.bind(this)}
            rewind = {this.rewind.bind(this)}
            fastforward = {this.fastforward.bind(this)}
            reset = {this.reset.bind(this)}/>
            <Parameters
            setSpeed = {this.setSpeed.bind(this)}
            setLatency = {this.setLatency.bind(this)}/>
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
