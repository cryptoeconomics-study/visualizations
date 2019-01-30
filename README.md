# <img src="https://i.imgur.com/XzsEQmk.png" alt="ethereum logo" width="25px" top="25px"> Cryptoeconomics.study
  
  
---


## Network Visualizations
This repository contains the network visualizatons which accompany the Cryptoeconomics.study course. The visualizations will be integrated into the coding lessons on Chainshot and will include interactive visualizations of all of the protocols we build in the course, from a central payment operator up to a Proof of Stake blockchain.

This project is currently in its early development stages and requires major refactoring before building new visualizations. You can watch a [demo](https://youtu.be/PMabMK_XZ1A) of what our end vision is for the coding project and view in-depth details of our roadmap [here](https://docs.google.com/document/d/1R85zczC1-nklLXEFx-dZfQdlZexRAk8S9G9Hc3Zjkx4/edit?usp=sharing).

Feel free to try out the [first network visualization of Sections 2.1 - 2.2](https://k-ho.github.io/code/).

Questions? Reach out to Kevin at kevinjho1996 [at] gmail.com

### Contributing
Suggestions and contributions are extremely welcome. There is also room for contributors to optimize the code as well as create visualizations for protocols that we don't cover in the course. Check out the open issues and project board and help out! :) 

## Coding Project Outline

### Chapter 1 - Central Payment Operator 
- [ ] Visually distinct "Paypal Node"
- [ ] Hub and Spoke network
- [ ] View Paypal's state
- [ ] Allow Paypal node to Censor and Mint money

### Chapter 2 - Networks and Synchrony Assumptions
#### Section 2.1 - Naive P2P Network 
- [x] Network Visualization
- [x] message propagation 

![](https://media.giphy.com/media/EExX2XytOTdIOMaKut/giphy.gif)
- [ ] Latency controls
- [ ] Speed Controls (Rewind, fast forward, etc.)

#### Section 2.2 - Double Spends
- [x] Visually distinct double spend message
- [x] Display rejected transactions (invalid nonce txs)
- [ ] Add Gamification (e.g. "send an unsuccessful double spend")

#### Section 2.3 - 99% Fault Tolerant Consensus
- [ ] Sidebar w/ a list of propagating messages + when transactions will timeout and whether they have been rejected or accepted by all nodes. 
- [ ] Hovering over messages will display how many signatures a given transaction has received and from which nodes

#### Section 2.4 - Proof of Authority
- [ ] Controls to add and remove nodes from a state of “authority”
- [ ] Option to toggle whether or not an authority node is malicious, and then be able to both censor transactions and attempt double spends 
- [ ] Controls to adjust the % of authority nodes that must sign off on every transaction
- [ ] Hovering over a message will show which of the authority nodes signed off on it.

### Chapter 3 - Proof of Work
- [ ] Option to toggle nodes into miners and back again
- [ ] Clearly display the longest chain and which nodes agree on this chain.
- [ ] Easily expand a block and explore its contents in a separate view.
- [ ] Visually see miners iterating through nonces and checking hashes
- [ ] Controls to adjust amount of mining power each miner has
- [ ] User can click a button to attempt a double spend attack
- [ ] Users can also toggle a miner into a selfish miner.
- [ ] Simulation of cost of mining to demonstrate when miners are profitable (and show that they lose money under the attack of selfish mining)


### Chapter 4 - Proof of Stake (Casper FFG)
- [ ] Visualize when finality is reached
- [ ] Implement and attempt nothing at stake attacks (get slashed)
- [ ] Users can alter the # of honest nodes
- [ ] Implement and attempt long range revision attacks
- [ ] Controls to adjust the stake of each node


### Future Visualizations
- Sharding
- Plasma
- Add visualizations of your personal favorite Blockchain protocols or Cryptoeconomic mechanisms!

