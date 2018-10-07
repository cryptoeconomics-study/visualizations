import React, { Component } from 'react';



class Parameters extends Component {
  constructor(props) {
    super(props)
    // this.state = {node: props.node}
  }
  render() {
    const {setSpeed, setLatency, setPacketLoss} = this.props
    return (
        <div id = "Parameters">
          <input type="text" name="speed" onChange={setSpeed}/>
          <input type="text" name="latency" onChange={setLatency}/>
          <input type="text" name="packetLoss" onChange={setPacketLoss}/>
        </div>
    );
  }
}

export default Parameters;
