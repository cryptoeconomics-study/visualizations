import React, { Component } from 'react';
import {Graph} from 'react-d3-graph';
import {nodes, network} from './c2_NetworkDoubleSpends/createNetSim'
import networkSim from  './c2_NetworkDoubleSpends/networksim.js'
import blockies from './blockies-svg.js'



// const createIcon = function(seed) {
//   var icon = blockies({ // All options are optional
//       seed: seed, // seed used to generate icon data, default: random
//       color: '#dfe', // to manually specify the icon color, default: random
//       bgcolor: '#aaa', // choose a different background color, default: random
//       size: 15, // width/height of the icon in blocks, default: 8
//       scale: 3, // width/height of each block in pixels, default: 4
//       spotcolor: '#000' // each pixel has a 13% chance of being of a third color,
//       // default: random. Set to -1 to disable it. These "spots" create structures
//       // that look like eyes, mouths and noses.
//   });
// }

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
    state: nodes[i].state
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

  // graph event callbacks
  const onClickNode = function(nodeId) {
    const node = nodes.find((node) => {
      return node.pid === nodeId;
    });
    'Clicked node' + JSON.stringify(node.state)
  };

  const onMouseOverNode = function(nodeId) {
       // window.alert(`Mouse over node ${nodeId}`);
  };

  const onMouseOutNode = function(nodeId) {
       // window.alert(`Mouse out node ${nodeId}`);
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
  componentDidMount() {
    this.history = []
    try {
      this.run(300).then(

      )
    } catch (e) {
    }
  }
  async run (steps) {
    for (let i = 0; i < 300; i++) {
      network.tick()
      await delay(1000)
      this.history.push(network)
      console.log(network)
    }
  }
  render() {
    return (
        <div id = "Network-graph">
          <Graph
           id='graph-id' // id is mandatory, if no id is defined rd3g will throw an error
           data={data}
           config={myConfig}
           onClickNode={onClickNode}
           onClickLink={onClickLink}
           onMouseOverNode={onMouseOverNode}
           onMouseOutNode={onMouseOutNode}
           onMouseOverLink={onMouseOverLink}
           onMouseOutLink={onMouseOutLink}/>
        </div>

    );
  }
}

export default Network;
