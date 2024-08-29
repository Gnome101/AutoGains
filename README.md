# AutoGains

AutoGains is a sophisticated automated trading system built on the Ethereum blockchain.
The protocol was built on top of the ERC-4624 standard, with some changes to accomodate Gains Network.
Any user can create a vault, give it a custom strategy, and APIs. Then anyone else can invest into these vaults.
Our oracles then call on each vault to preform the trades when the APIs indicate that the trade is ready.

## 

## Project Overview

| Type | File   | Logic Contracts | Interfaces | Lines | nLines | nSLOC | Comment Lines | Complex. Score | Capabilities |
| ---- | ------ | --------------- | ---------- | ----- | ------ | ----- | ------------- | -------------- | ------------ | 
| 📝 | contracts/AutoVault.sol | 1 | **** | 858 | 791 | 477 | 220 | 321 | **** |
|  | contracts/Structures.sol | **** | **** | 46 | 46 | 25 | 22 | **** | **** |
| 📝 | contracts/VaultFactory.sol | 1 | **** | 428 | 401 | 235 | 122 | 152 | **** |
| 🎨 | contracts/Interfaces/ERC4626Fees.sol | 1 | **** | 226 | 183 | 131 | 24 | 88 | **** |
| 📚 | contracts/Libraries/TransientPrimities.sol | 1 | **** | 94 | 82 | 61 | 8 | 85 | **<abbr title='Uses Assembly'>🖥</abbr>** |
| 📝📚🎨 | **Totals** | **4** | **** | **1652**  | **1503** | **929** | **396** | **646** | **<abbr title='Uses Assembly'>🖥</abbr>** |

## Scope

The project scope includes the following contracts:
- AutoVault.sol
- Structures.sol
- VaultFactory.sol
- ERC4626Fees.sol
- TransientPrimities.sol

Out of scope:
- Equation.sol
- Gains Contracts
- Chainlink
- Helper.sol

## Trust Assumptions

- The oracle address is trusted
- The factory owner is trusted
- The oracleFee and vaultActionFee will remain up to date at all times
- The protocol will use known ERC20 implementations that are known and work with the protocol.

## How It Works
1. The VaultFactory contract deploys new AutoVault instances.
2. Users can deposit funds into AutoVaults.
3. AutoVaults execute trading strategies using Chainlink oracles for price data & indicator data.
4. Trades are executed on the Gains Network platform.
5. When there are active trades, user must use the startAction and preformAction methods.
7. Users can withdraw funds during specified withdrawal periods.7. 

## Key Features

- Automated trading strategies
- Integration with Chainlink oracles
- ERC4626-compliant vault structure
- Customizable fees for deposits, withdrawals, and trades
- Withdrawal periods for capital management

## Setup and Testing

1. Install dependencies: yarn
2. Run tests: yarn hardhat test
3. Generate Coverage Report: yarn hardhat coverage
   
## Notes

- If gas fees need to be increased, the vault maker must handle this adjustment.
- The project uses assembly in some parts for gas optimization.
- Withdraws are only possible when the vault has no trades
- A callback function is needed to value all trades because we cannot obtain their value on chain (we need the GNS median price)

## Security Considerations

- The project relies on trusted oracles and factory owners.
- Withdrawal periods are implemented to manage capital flow.
- Complex trading strategies should be thoroughly tested and audited.

For more detailed information, please refer to the individual contract files and accompanying documentation.
