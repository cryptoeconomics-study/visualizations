import React, { Component } from 'react';
import * as d3 from 'd3';

var width = 960;
var height = 700;
//Make responsive
var force = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-10000))
        .force("center", d3.forceCenter(width / 2, height / 2));

var zoom = d3.zoom();

// *****************************************************
// ** d3 functions to manipulate attributes
// *****************************************************

// **** Node Functions  ****

var enterNode = (selection) => {
  selection.classed('node', true)
    .append('circle')
    .attr("r", 20)
  selection.append("svg:image")
    .attr("xlink:href", d => d.gerbil)
    .attr("x", d => -12.5)
    .attr("y", d => -12.5)
    .attr("height", 25)
    .attr("width", 25)
};

var updateNode = (selection) => {
  selection.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
    .attr('fill', (d) => {
      // return d3.color(d.color)
      //   .brighter(0.5)
      return d.color
    })
    .attr('stroke', (d) => d.color)
    .attr('stroke-width', (d) => 5)
};

// **** Link Functions  ****

var enterLink = (selection) => {
  selection.classed('link', true)
    .attr("stroke-width", 2)
    .attr("stroke", 'grey')
};

var updateLink = (selection) => {
  selection.attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);
};

// **** Message Functions  ****

var getNodeById = (id) => {
  return force.nodes().find(
    (node) => node.pid === id
  )
}

var enterMessage = (selection) => {
  selection.classed('message', true)
    .attr("r", 6)
    .attr("fill", d => '#' + d.message.sig.slice(2,8))
    .attr("fill-opacity", 0.5)
    .attr('stroke-width', (d) => 3)
    .attr('stroke', (d) => '#' + d.message.sig.slice(2,8))
    .attr("cx", d=> getNodeById(d.sender).x)
    .attr("cy", d=> getNodeById(d.sender).y)
    .transition()
    .duration(d=> (1000 * (d.recvTime - d.sentTime)))
    .ease(d3.easeLinear)
    .attr("cx", d=> getNodeById(d.recipient.pid).x)
    .attr("cy", d=> getNodeById(d.recipient.pid).y)
}

var updateMessage = (selection) => {
}

// **** Graph Functions  ****

var updateGraph = (selection) => {
  selection.selectAll('.node')
    .call(updateNode);
  selection.selectAll('.link')
    .call(updateLink)
  selection.selectAll('.message')
    .call(updateMessage)
};

var zoomed = (selection, width, height) => {
  selection.attr('transform', 
            'translate(' + (-width/2 + 100) + ', ' + (height/2 - 500) + ')scale(' + 1.5 + ')');
  console.log("Zoomed", width, height)
};

var resize = (selection) => {
  console.log("Resized")
  width = window.innerWidth;
  height = window.innerHeight;
  zoomed(selection, width, height)
};

// *****************************************************
// ** Graph component
// *****************************************************

class Graph extends Component {
    componentDidMount() {
      this.d3Graph = d3.select(this.viz);
      force.on('tick', () => {
        // after force calculation starts, call updateGraph
        // which uses d3 to manipulate the attributes,
        // and React doesn't have to go through lifecycle on each tick
        this.d3Graph.call(updateGraph);
      });
      d3.select(window).on("resize", () => {
        this.d3Graph.call(resize);
      });
    }

    shouldComponentUpdate(nextProps) {
      this.d3Graph = d3.select(this.viz);
      const d3Nodes = this.d3Graph.selectAll('.node')
        .data(nextProps.nodes, (node) => node.pid);
      d3Nodes.enter().append('g').call(enterNode);
      d3Nodes.exit().remove();
      d3Nodes.call(updateNode);

      const d3Links = this.d3Graph.selectAll('.link')
        .data(nextProps.links)

      d3Links.enter().insert('line', '.node').call(enterLink);
      d3Links.exit().remove();
      d3Links.call(updateLink);

      const d3Messages = this.d3Graph.selectAll('.message')
        .data(nextProps.messages, message => {
          return message.message.sig + ':' +
          message.recipient.pid + ':' +
          message.sender
        });
      d3Messages.enter().insert('circle', '.node').call(enterMessage);
      d3Messages.exit().remove();
      d3Messages.call(updateMessage);

      // we should actually clone the nodes and links
      // since we're not supposed to directly mutate
      // props passed in from parent, and d3's force function
      // mutates the nodes and links array directly
      // we're bypassing that here for sake of brevity in example
      force.nodes(nextProps.nodes)
        .force("link", d3.forceLink(nextProps.links)
          .id(d => d.pid)
          .distance(d=>50)
          .strength(.3)
        );
      return false;
    }

    render() {
      return (
        <svg width={width} height={height}>
          <g ref={el => this.viz = el} />
        </svg>
      );
    }
}

export default Graph;
