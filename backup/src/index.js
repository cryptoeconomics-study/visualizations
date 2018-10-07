import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// function visualizeNetwork (network) {
//   // Press "Execute" to run your program
//   var Graph = require('p2p-graph')

//   var graph = new Graph(document.getElementById('Network-graph'))

//   // select event
//   graph.on('select', function (id) {
//     console.log(id + ' selected!')
//   })
//   var nodes = network.agents;
//   for (let i = 0; i < nodes.length; i++) {
//     // add peers
//     graph.add({
//       id: nodes[i].pid,
//       name: nodes[i].pid.slice(0, 10)
//     })
//   }
//   for (const node of nodes) {
//     // connect them
//     for (const peer of network.peers[node.pid]) {
//       graph.connect(node.pid, peer.pid)
//       graph.seed(node.pid, true)
//     }
//   }
//   console.log(graph.list())
// }

// var network = require('./c2_NetworkDoubleSpends/networksim')()
// const testAgents = [
//   {
//     pid: 'karl',
//     onReceive: function (message) { console.log(this.pid, 'got', message) },
//     tick: function () {}
//   },
//   {
//     pid: 'aparna',
//     onReceive: function (message) { console.log(this.pid, 'got', message) },
//     tick: function () {}
//   },
//   {
//     pid: 'jing',
//     onReceive: function (message) { console.log(this.pid, 'got', message) },
//     tick: function () {}
//   },
//   {
//     pid: 'bob',
//     onReceive: function (message) { console.log(this.pid, 'got', message) },
//     tick: function () {}
//   },
//   {
//     pid: 'phil',
//     onReceive: function (message) { console.log(this.pid, 'got', message) },
//     tick: function () {}
//   },
//   {
//     pid: 'vitalik',
//     onReceive: function (message) { console.log(this.pid, 'got', message) },
//     tick: function () {}
//   }
// ]
// for (let a of testAgents) {
//   network.connectPeer(a, 1)
// }
// visualizeNetwork(network);
registerServiceWorker();
