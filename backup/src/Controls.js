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
          <button onClick={rewind}>Slow Down</button>
          <button onClick={pause}>Pause</button>
          <button onClick={fastforward}>Speed Up</button>
        </div>
    );
  }
}

export default Controls;
