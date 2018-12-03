import React from 'react';
import { Modal, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import YouTube from 'react-youtube';

const Instructions = ({show, handleClose}) => {
  const colorPopover = (
    <Popover id="modal-popover" title="">
      For the technical people: We took the first 6 hexadecimal characters of the Keccak-256 hash of the state and turned it into a hex color!
    </Popover>
  );

  const spendPopover = (
    <Popover id="modal-popover" title="Spend">
      Clicking "Spend" will make the selected node generate and propagate a transaction sending $10 to a random node.
    </Popover>
  );

  const doubleSpendPopover = (
    <Popover id="modal-popover" title="Double Spend">
      Clicking "Double Spend" will make the selected node generate and selectively propagate two transactions each sending $10 to a different peer.
      <br></br>
     {/* Transaction 1 sending $10 to Peer 1 will be broadcasted directly to Peer 1, and Transaction 2 sending $10 to Peer 2 will be broadcasted directly to Peer 2.*/}
    </Popover>
  );

  const transactionsPopover = (
    <Popover id="modal-popover" title="Resume Transactions">
      Switching on "Resume Transactions" will make all nodes randomly generate and send transactions.
      <br></br>
    </Popover>
  );

  const opts = {
    height: '300',
    width: '550',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 0
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
     <Modal.Header closeButton>
       <Modal.Title>Instructions</Modal.Title>
     </Modal.Header>
     <Modal.Body>
       <h4>What is this?</h4>
       <p>
        This is an interactive network simulation designed as a part of Chapter 2 of {' '}
           <a href="https://cryptoeconomics.study/">Cryptoeconomics.study</a>. To best understand the double spend problem, here is Ethereum Researcher Karl Floersch's explanation in section 2.2 of the course:

           <YouTube
             videoId="k6JVGR7Jx0A"
             opts={opts}
           />
       </p>
       <h4>How do you send a transaction?</h4>
       <p>
        Click on a node to either {' '}
          <OverlayTrigger overlay={spendPopover}>
            <a href="">Spend</a>
          </OverlayTrigger>
        {' '} or {' '}
          <OverlayTrigger overlay={doubleSpendPopover}>
            <a href="">Double Spend</a>
          </OverlayTrigger>
        {' '}. You can also toggle the {' '}
          <OverlayTrigger overlay={transactionsPopover}>
            <a href="">Resume Transactions</a>
          </OverlayTrigger>
          {' '}switch.
       </p>

       <h4>What do the colors mean?</h4>
       <p>
        The color of each node {' '}
            <OverlayTrigger overlay={colorPopover}>
              <a href = "">represents</a>
            </OverlayTrigger>{' '} the state of that node's ledger.
       </p>
       <hr />
     </Modal.Body>
     <Modal.Footer>
       <Button onClick={handleClose}>Close</Button>
     </Modal.Footer>
   </Modal>
  );
}

export default Instructions;
