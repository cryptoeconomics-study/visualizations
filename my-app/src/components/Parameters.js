import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

class Parameters extends Component {
  constructor(props) {
    super(props)
    // this.state = {node: props.node}
  }
  render() {
    const {setSpeed, setLatency, setPacketLoss} = this.props
    return (
        <div id = "Parameters">
        <Slider defaultValue={50} onAfterChange={setSpeed} style={{padding:"20px"}} max={100}/>
        </div>
    );
  }
}

export default Parameters;

