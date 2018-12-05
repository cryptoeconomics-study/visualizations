#<img src="https://i.imgur.com/XzsEQmk.png" alt="ethereum logo" width="20px" top="15px"> Cryptoeconomics.study
  
  
---


## 👾 Coding Project
This repository contains the coding project which accompanies the Cryptoeconomics.study course. This includes implementing a payment processor blockchain, proof of work, proof of stake, and Plasma.

The project is currently in its early development stages and requires major refactoring before building new lessons. You can watch a [demo](https://youtu.be/PMabMK_XZ1A) of what our end vision is for the coding project and view in-depth details of our roadmap [here](https://docs.google.com/document/d/1R85zczC1-nklLXEFx-dZfQdlZexRAk8S9G9Hc3Zjkx4/edit?usp=sharing).

Feel free to try out our first network visualization [sandbox](https://k-ho.github.io/code/).

### Contributing
Suggestions and contributions are extremely welcome. For instance, there might be room in the curriculum to implement a simple state channel as well. There is also room for contributors to optimize the code as well as create visualizations. Check out the open issues and project board and help out! :) 

## Coding Project Outline

### Node Implementation
- [x] Account Model
- [x] UTXO Model

### Adding Networking
- [x] Network Simulator with nodes sending each other “hello world”
  - Network simulator implementation: https://github.com/cryptoeconomics-study/code/blob/master/c2_NetworkDoubleSpends/networksim.js
- [x] Nodes sending transactions
  - Send transactions until invalid tx found - https://github.com/cryptoeconomics-study/code/blob/master/c2_NetworkDoubleSpends/invalidWithHonestNodes.js
  - Intentionally double spend - https://github.com/cryptoeconomics-study/code/blob/master/c2_NetworkDoubleSpends/doubleSpend.js
- [x] Network message propagation visualization ![](https://media.giphy.com/media/EExX2XytOTdIOMaKut/giphy.gif)


### Adding Proof of Work block proposal
- [ ] Nodes sending blocks
  - Instead of each node generating and sending a transaction, generate a transaction and put it in a block which point to previous blocks
  - Create blocks only one the longest known chain of blocks which the node has
  - Clients still apply all transactions, whether or not they are on the longest chain.
- [ ] Proof of work on the blocks
  - Add anti-spam protection with proof of work on each block
  - See implementation here: https://github.com/karlfloersch/lessons/blob/master/lessons/02_proofOfWork.js#L16-L26
- [ ] Fork choice
  - Only apply transactions which are contained in the longest chain
  - Lazily apply these transactions (create function `getState()` which applies all the transactions in the chain and returns the resulting state object.
- [ ] Minder // client separation
  - Add Miner class which collects txs & makes blocks
  - Add Client class which generates & sends transactions

### Adding Proof of Stake Finality (FFG)
- [ ] Add validator class
- [ ] Add deposit transaction which locks coins
- [ ] Add withdraw transaction which unlocks coins (after some delay)
- [ ] Add `vote()` which votes on the current epoch, if more than ⅔ vote then the block is finalized
- [ ] Update the fork choice rule to not revert finalized blocks, and accept a ‘starting block’ blockhash.

### Instead Implement as Plasma with a Central Operator
- [ ] Create `rootChain.sol` which accepts block hashes
- [ ] Create `merkleProof.sol` which validates merkle proofs
- [ ] Using https://github.com/ethereum/py-evm write tests which:
  - Deploy the merkle prover & root chain
  - Deposit test ETH to the root chain, creating a new Plasma Cash coin
  - Submit merkle proofs to the root chain contract which transfer the coin
  - Exit the coin with a different account than the one that deposited
- [ ] Add exit challenges

