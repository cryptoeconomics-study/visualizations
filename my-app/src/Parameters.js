import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';


class Parameters extends Component {
  constructor(props) {
    super(props)
    // this.state = {node: props.node}
  }
  render() {
    const {setSpeed, setLatency, setPacketLoss} = this.props
    return (
        <div id = "Parameters">
          <Slider onChange={setSpeed} defaultValue={50} maximumTrackStyle={{ backgroundColor: 'red', height: 10 }}
          minimumTrackStyle={{ backgroundColor: 'blue', height: 10 }} />
        </div>
    );
  }
}

export default Parameters;


// <input type="text" name="speed" onChange={setSpeed}/>
//           <input type="text" name="latency" onChange={setLatency}/>
//           <input type="text" name="packetLoss" onChange={setPacketLoss}/>