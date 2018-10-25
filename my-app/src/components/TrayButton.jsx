import React, { Component } from 'react';

class TrayButton extends Component {
  constructor(props) {
    super(props)
    this.clicked = this.clicked.bind(this)
  }

  clicked(showState, node) {
    showState(node)
  }

  render() {
    const {isSelected, icons, node, showState} = this.props

    const styles = {
      height: "45px", 
      width: "45px", 
      backgroundColor: node.color, 
      borderRadius: "50%", 
      display: "inline-block",
      opacity: isSelected ? 1.0 : 0.5,
    }

    if (node) {
      return (
          <div onClick={(e) => this.clicked(showState, node)} className="TrayButton" id={"trayButton-" + node.pid} style={styles}>
            <img alt="Gerbil" src={icons[node.pid]} width="25" />
         </div>
      );
    } else {
      return (<div></div>);
    }
  }
}

export default TrayButton;
