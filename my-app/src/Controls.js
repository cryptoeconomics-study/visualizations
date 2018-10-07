import React, { Component } from 'react';



class Controls extends Component {
  constructor(props) {
    super(props)
    // this.state = {node: props.node}
  }
  render() {
    const {pause, fastforward, rewind} = this.props
    return (
        <div id = "Controls">
          <button onClick={pause}>Pause</button>
        </div>
    );
  }
}

export default Controls;
