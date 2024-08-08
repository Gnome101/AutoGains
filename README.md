# AutoGains

AutoGains is a protocol built on top of Gains Network that enables for users to create their own vaults, which are supercharged by algorithmically trading bots.
The ERC-4626 standard was used to build the protocol on top of, so that anyone can invest in any vault.
The project was started as a result of GCGP grant issued by Gains Network for 20k ARB. 

The contracts are written in Solidity.
The tests and deployment scripts are written in TypeScript using the Hardhat framework.

Features of the Smart Contracts:
  - Utilizes SSTORE2 for the saving of strategies on-chain
  - Allows for the creation of any strategy by storing the logic as Abstract Trees with Reverse Polish Notation
  - Uses a minimal proxy standard ERC-1167 to cheapen the deployment of new vaults
  - Leverages Chainlink to make calls to the GNS price oracles and the indicators to determine if a trade is ready

Contracts Scope:
For an audit, the following contracts are to be analyzed:
 - AutoVault.sol
 - VaultFactory.sol
 - Equation.sol
 - ERC4626.sol
   

