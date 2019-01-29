import React, { Component } from 'react';
import {InteractiveForceGraph, ForceGraphNode, ForceGraphLink, ForceGraphMessage}from './graph/index'

class GraphFactory extends Component {
  render() {
    const {nodes, network, icons, messages} = this.props
    let links = []

    for (const node of nodes) {
      Object.assign(node, {
        id: node.pid,
        name: node.pid.slice(0, 5),
        gerbil: icons[node.pid]
      })
      // connect them
      for (const peer of network.peers[node.pid]) {
        links.push({
          source: node.pid,
          target: peer.pid
        })
      }
    }
    return (
    <InteractiveForceGraph simulationOptions={{
      height: 300,
      width: 300,
      animate: true,
      strength: {
        charge: -5000,
        gravity: 0
        // collide: 100,
        // x: ({ radius }) => 15 / radius,
        // y: ({ radius }) => 3 / radius,
      },
      // alpha: 1,
      // alphaDecay: 1,
      // alphaMin: 1,
      // alphaTarget: 1,
      // velocityDecay: 1,
      // radiusMargin: 1,
    }}>
      {nodes.map(node => (
        <ForceGraphNode
          key={node.id}
          fill={node.color}
          node={{ ...node, radius: 20}}
        />
      ))}
      {links.map(link => (
        <ForceGraphLink
          key={`${link.source}=>${link.target}`}
          link={{ ...link, value: 10 }}
        />
      ))/*.map(attachEvents)*/}
    </InteractiveForceGraph>
    );
  }
}

export default GraphFactory;
