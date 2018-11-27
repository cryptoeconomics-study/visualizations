import React, { Component } from 'react';
import Ledger from './Ledger.jsx'

const Ledgers = ({nodes, icons, showState}) => {
  return (
    <div id="Ledgers">
      {Object.keys(nodes).map((pid, index) =>
        <Ledger
          key={pid}
          node={nodes[pid]}
          icons={icons}
          showState={showState}
        />
      )}
    </div>
  );
}

export default Ledgers;
