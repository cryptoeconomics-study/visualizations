import React, { Component } from 'react';



class Controls extends Component {
  constructor(props) {
    super(props)
    // this.state = {node: props.node}
  }
  render() {
    const {pause, stepforward, stepbackward, rewind, fastforward, reset} = this.props
    return (
        <div id = "Controls">
          <button onClick={rewind}>Rewind</button>
          <button onClick={stepbackward}>Step Backward</button>
          <button onClick={pause}>Pause</button>
          <button onClick={stepforward}>Step Forward</button>
          <button onClick={fastforward}>Fastforward</button>
          <button style={{background:"red"}} onClick={reset}>Reset</button>
        </div>
    );
  }
}

export default Controls;
