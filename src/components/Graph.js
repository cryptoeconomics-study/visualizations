import React, { Component } from 'react';
import * as d3 from 'd3';

var width = 960;
var height = 1000;
//Make responsive
var force = d3.forceSimulation()
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

// *****************************************************
// ** d3 functions to manipulate attributes
// *****************************************************

var enterNode = (selection) => {

  selection.classed('node', true)
    .append('circle')
    .attr("r", 37)
  selection.append("svg:image")
    .attr("xlink:href",  function(d) { console.log(d, "gerrbil")
      return d.gerbil;})
    .attr("x", d => -25)
    .attr("y", d => -25)
    .attr("height", 50)
    .attr("width", 50)
  // selection.append('text')
  //   .attr("x", (d) => d.size + 5)
  //   .attr("dy", ".35em")
  //   .text((d) => d.key);
};

var updateNode = (selection) => {
  selection.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
  .attr('fill', (d) => d.color)
};

var enterLink = (selection) => {
  selection.classed('link', true)
    .attr("stroke-width", (d) => d.size)
    .attr("stroke", 'black')
};

var updateLink = (selection) => {
  selection.attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);
};

var updateGraph = (selection) => {
  selection.selectAll('.node')
    .call(updateNode);
  selection.selectAll('.link')
    .call(updateLink)
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
    }

    shouldComponentUpdate(nextProps) {
      this.d3Graph = d3.select(this.viz);
      var d3Nodes = this.d3Graph.selectAll('.node')
        .data(nextProps.nodes, (node) => node.pid);
      d3Nodes.enter().append('g').call(enterNode);
      d3Nodes.exit().remove();
      d3Nodes.call(updateNode);

      var d3Links = this.d3Graph.selectAll('.link')
        .data(nextProps.links)

      d3Links.enter().insert('line', '.node').call(enterLink);
      d3Links.exit().remove();
      d3Links.call(updateLink);

      // we should actually clone the nodes and links
      // since we're not supposed to directly mutate
      // props passed in from parent, and d3's force function
      // mutates the nodes and links array directly
      // we're bypassing that here for sake of brevity in example
      force.nodes(nextProps.nodes)
        .force("link", d3.forceLink(nextProps.links)
          .id(d => d.pid)
          .distance(d=>100)
        );
      // force.start();

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
