import React, { Component } from 'react';
import TrayButton from './TrayButton.jsx'

const Tray = ({nodes, selectedNodes, icons, showState}) => {
  return (
    <div id="Tray">
      {Object.keys(nodes).map((pid, index) =>
        <TrayButton
          key={pid}
          isSelected={(nodes[pid].pid in selectedNodes)}
          icons={icons}
          node={nodes[pid]}
          showState={showState}
        />
      )}
    </div>
  );
}

export default Tray;
