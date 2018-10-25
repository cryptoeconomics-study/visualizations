import React, { Component } from 'react';
import TrayButton from './TrayButton.jsx'

class Tray extends Component {
  render() {
    const {nodes, selectedNodes, icons, showState} = this.props

    return (
        <div id="Tray">
        {
          Object.keys(nodes).map((pid, index) => (
        		<TrayButton key={pid} isSelected={(nodes[pid].pid in selectedNodes)} icons={icons} node={nodes[pid]} showState={showState}/>
          ))
		}
        </div>
    );
  }
}

export default Tray;
