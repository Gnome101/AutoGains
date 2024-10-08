
[<img width="200" alt="get in touch with Consensys Diligence" src="https://user-images.githubusercontent.com/2865694/56826101-91dcf380-685b-11e9-937c-af49c2510aa0.png">](https://consensys.io/diligence)<br/>
<sup>
[[  🌐  ](https://consensys.io/diligence)  [  📩  ](mailto:diligence@consensys.net)  [  🔥  ](https://consensys.io/diligence/tools/)]
</sup><br/><br/>



# Solidity Metrics for 'CLI'

## Table of contents

- [Scope](#t-scope)
    - [Source Units in Scope](#t-source-Units-in-Scope)
        - [Deployable Logic Contracts](#t-deployable-contracts)
    - [Out of Scope](#t-out-of-scope)
        - [Excluded Source Units](#t-out-of-scope-excluded-source-units)
        - [Duplicate Source Units](#t-out-of-scope-duplicate-source-units)
        - [Doppelganger Contracts](#t-out-of-scope-doppelganger-contracts)
- [Report Overview](#t-report)
    - [Risk Summary](#t-risk)
    - [Source Lines](#t-source-lines)
    - [Inline Documentation](#t-inline-documentation)
    - [Components](#t-components)
    - [Exposed Functions](#t-exposed-functions)
    - [StateVariables](#t-statevariables)
    - [Capabilities](#t-capabilities)
    - [Dependencies](#t-package-imports)
    - [Totals](#t-totals)

## <span id=t-scope>Scope</span>

This section lists files that are in scope for the metrics report. 

- **Project:** `'CLI'`
- **Included Files:** 
    - ``
- **Excluded Paths:** 
    - ``
- **File Limit:** `undefined`
    - **Exclude File list Limit:** `undefined`

- **Workspace Repository:** `unknown` (`undefined`@`undefined`)

### <span id=t-source-Units-in-Scope>Source Units in Scope</span>

Source Units Analyzed: **`3`**<br>
Source Units in Scope: **`3`** (**100%**)

| Type | File   | Logic Contracts | Interfaces | Lines | nLines | nSLOC | Comment Lines | Complex. Score | Capabilities |
| ---- | ------ | --------------- | ---------- | ----- | ------ | ----- | ------------- | -------------- | ------------ | 
| 📝 | contracts/AutoVault.sol | 1 | **** | 790 | 717 | 512 | 116 | 327 | **** |
| 🎨 | contracts/Interfaces/ERC4626Fees.sol | 1 | **** | 226 | 183 | 131 | 24 | 88 | **** |
| 📝 | contracts/VaultFactory.sol | 1 | **** | 295 | 268 | 220 | 13 | 147 | **** |
| 📝🎨 | **Totals** | **3** | **** | **1311**  | **1168** | **863** | **153** | **562** | **** |

<sub>
Legend: <a onclick="toggleVisibility('table-legend', this)">[➕]</a>
<div id="table-legend" style="display:none">

<ul>
<li> <b>Lines</b>: total lines of the source unit </li>
<li> <b>nLines</b>: normalized lines of the source unit (e.g. normalizes functions spanning multiple lines) </li>
<li> <b>nSLOC</b>: normalized source lines of code (only source-code lines; no comments, no blank lines) </li>
<li> <b>Comment Lines</b>: lines containing single or block comments </li>
<li> <b>Complexity Score</b>: a custom complexity score derived from code statements that are known to introduce code complexity (branches, loops, calls, external interfaces, ...) </li>
</ul>

</div>
</sub>


##### <span id=t-deployable-contracts>Deployable Logic Contracts</span>
Total: 2
* 📝 `AutoVault`
* 📝 `VaultFactory`



#### <span id=t-out-of-scope>Out of Scope</span>

##### <span id=t-out-of-scope-excluded-source-units>Excluded Source Units</span>

Source Units Excluded: **`0`**

<a onclick="toggleVisibility('excluded-files', this)">[➕]</a>
<div id="excluded-files" style="display:none">
| File   |
| ------ |
| None |

</div>


##### <span id=t-out-of-scope-duplicate-source-units>Duplicate Source Units</span>

Duplicate Source Units Excluded: **`0`** 

<a onclick="toggleVisibility('duplicate-files', this)">[➕]</a>
<div id="duplicate-files" style="display:none">
| File   |
| ------ |
| None |

</div>

##### <span id=t-out-of-scope-doppelganger-contracts>Doppelganger Contracts</span>

Doppelganger Contracts: **`0`** 

<a onclick="toggleVisibility('doppelganger-contracts', this)">[➕]</a>
<div id="doppelganger-contracts" style="display:none">
| File   | Contract | Doppelganger | 
| ------ | -------- | ------------ |


</div>


## <span id=t-report>Report</span>

### Overview

The analysis finished with **`0`** errors and **`0`** duplicate files.





#### <span id=t-risk>Risk</span>

<div class="wrapper" style="max-width: 512px; margin: auto">
			<canvas id="chart-risk-summary"></canvas>
</div>

#### <span id=t-source-lines>Source Lines (sloc vs. nsloc)</span>

<div class="wrapper" style="max-width: 512px; margin: auto">
    <canvas id="chart-nsloc-total"></canvas>
</div>

#### <span id=t-inline-documentation>Inline Documentation</span>

- **Comment-to-Source Ratio:** On average there are`6.58` code lines per comment (lower=better).
- **ToDo's:** `0` 

#### <span id=t-components>Components</span>

| 📝Contracts   | 📚Libraries | 🔍Interfaces | 🎨Abstract |
| ------------- | ----------- | ------------ | ---------- |
| 2 | 0  | 0  | 1 |

#### <span id=t-exposed-functions>Exposed Functions</span>

This section lists functions that are explicitly declared public or payable. Please note that getter methods for public stateVars are not included.  

| 🌐Public   | 💰Payable |
| ---------- | --------- |
| 32 | 0  | 

| External   | Internal | Private | Pure | View |
| ---------- | -------- | ------- | ---- | ---- |
| 15 | 67  | 2 | 4 | 26 |

#### <span id=t-statevariables>StateVariables</span>

| Total      | 🌐Public  |
| ---------- | --------- |
| 48  | 41 |

#### <span id=t-capabilities>Capabilities</span>

| Solidity Versions observed | 🧪 Experimental Features | 💰 Can Receive Funds | 🖥 Uses Assembly | 💣 Has Destroyable Contracts | 
| -------------------------- | ------------------------ | -------------------- | ---------------- | ---------------------------- |
| `^0.8.24`<br/>`^0.8.0` |  | **** | **** | **** | 

| 📤 Transfers ETH | ⚡ Low-Level Calls | 👥 DelegateCall | 🧮 Uses Hash Functions | 🔖 ECRecover | 🌀 New/Create/Create2 |
| ---------------- | ----------------- | --------------- | ---------------------- | ------------ | --------------------- |
| **** | **** | **** | **** | **** | **** | 

| ♻️ TryCatch | Σ Unchecked |
| ---------- | ----------- |
| **** | **** |

#### <span id=t-package-imports>Dependencies / External Imports</span>

| Dependency / Import Path | Count  | 
| ------------------------ | ------ |
| @chainlink/contracts/src/v0.8/ChainlinkClient.sol | 2 |
| @chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol | 1 |
| @openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol | 1 |
| @openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol | 1 |
| @openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol | 1 |
| @openzeppelin/contracts/access/Ownable.sol | 1 |
| @openzeppelin/contracts/proxy/Clones.sol | 1 |
| @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol | 1 |
| @openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol | 1 |
| @openzeppelin/contracts/utils/Pausable.sol | 1 |
| @openzeppelin/contracts/utils/Strings.sol | 2 |
| @openzeppelin/contracts/utils/math/Math.sol | 2 |
| hardhat/console.sol | 1 |
| solmate/src/utils/SSTORE2.sol | 1 |

#### <span id=t-totals>Totals</span>

##### Summary

<div class="wrapper" style="max-width: 90%; margin: auto">
    <canvas id="chart-num-bar"></canvas>
</div>

##### AST Node Statistics

###### Function Calls

<div class="wrapper" style="max-width: 90%; margin: auto">
    <canvas id="chart-num-bar-ast-funccalls"></canvas>
</div>

###### Assembly Calls

<div class="wrapper" style="max-width: 90%; margin: auto">
    <canvas id="chart-num-bar-ast-asmcalls"></canvas>
</div>

###### AST Total

<div class="wrapper" style="max-width: 90%; margin: auto">
    <canvas id="chart-num-bar-ast"></canvas>
</div>

##### Inheritance Graph

<a onclick="toggleVisibility('surya-inherit', this)">[➕]</a>
<div id="surya-inherit" style="display:none">
<div class="wrapper" style="max-width: 512px; margin: auto">
    <div id="surya-inheritance" style="text-align: center;"></div> 
</div>
</div>

##### CallGraph

<a onclick="toggleVisibility('surya-call', this)">[➕]</a>
<div id="surya-call" style="display:none">
<div class="wrapper" style="max-width: 512px; margin: auto">
    <div id="surya-callgraph" style="text-align: center;"></div>
</div>
</div>

###### Contract Summary

<a onclick="toggleVisibility('surya-mdreport', this)">[➕]</a>
<div id="surya-mdreport" style="display:none">
 Sūrya's Description Report

 Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| contracts/AutoVault.sol | [object Promise] |
| contracts/Interfaces/ERC4626Fees.sol | [object Promise] |
| contracts/VaultFactory.sol | [object Promise] |


 Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **AutoVault** | Implementation | ERC4626Fees, ChainlinkClient, Pausable |||
| └ | returnStrategies | Public ❗️ |   |NO❗️ |
| └ | initialize | Public ❗️ | 🛑  | initializer |
| └ | startAction | External ❗️ | 🛑  |NO❗️ |
| └ | getAsset | Internal 🔒 |   | |
| └ | extendApproval | Public ❗️ | 🛑  |NO❗️ |
| └ | getPublicData | Public ❗️ |   |NO❗️ |
| └ | preformAction | Public ❗️ | 🛑  | onlyFactory |
| └ | executeStrategy | External ❗️ | 🛑  | whenNotPaused revertDuringWithdrawPeriod |
| └ | setOracleFee | Public ❗️ | 🛑  | onlyOwner |
| └ | fulfill | Public ❗️ | 🛑  | whenNotPaused onlyFactory revertDuringWithdrawPeriod |
| └ | processStrategy | Public ❗️ |   |NO❗️ |
| └ | applySwapFee | Internal 🔒 | 🛑  | |
| └ | executeAction | Internal 🔒 | 🛑  | |
| └ | extractTrade | Internal 🔒 |   | |
| └ | totalAssets | Public ❗️ |   |NO❗️ |
| └ | _adjustForDecimals | Internal 🔒 |   | |
| └ | beforeWithdraw | Internal 🔒 | 🛑  | |
| └ | afterDeposit | Internal 🔒 | 🛑  | |
| └ | _entryFeeBasisPoints | Internal 🔒 |   | |
| └ | _exitFeeBasisPoints | Internal 🔒 |   | |
| └ | _getMinFee | Internal 🔒 |   | |
| └ | _doesRecipientPayFee | Internal 🔒 |   | |
| └ | _entryFeeRecipient | Internal 🔒 |   | |
| └ | _exitFeeRecipient | Internal 🔒 |   | |
| └ | _msgSender | Internal 🔒 |   | |
| └ | _msgData | Internal 🔒 |   | |
| └ | internalDeposit | Internal 🔒 | 🛑  | |
| └ | pause | External ❗️ | 🛑  | whenNotPaused onlyOwner |
| └ | unpause | External ❗️ | 🛑  | whenPaused onlyOwner |
| └ | owner | Public ❗️ |   |NO❗️ |
| └ | _checkIfWithdrawPeriod | Internal 🔒 |   | |
| └ | setWithdrawPeriod | External ❗️ | 🛑  |NO❗️ |
| └ | closeAllPositions | Internal 🔒 | 🛑  | |
| └ | forceWithdrawPeriod | External ❗️ | 🛑  | onlyOwner |
| └ | endWithdrawPeriod | External ❗️ | 🛑  | onlyOwner |
||||||
| **ERC4626Fees** | Implementation | ERC4626Upgradeable |||
| └ | previewDeposit | Public ❗️ |   |NO❗️ |
| └ | previewMint | Public ❗️ |   |NO❗️ |
| └ | previewWithdraw | Public ❗️ |   |NO❗️ |
| └ | previewRedeem | Public ❗️ |   |NO❗️ |
| └ | splitFees | Internal 🔒 |   | |
| └ | _deposit | Internal 🔒 | 🛑  | |
| └ | _withdraw | Internal 🔒 | 🛑  | |
| └ | _entryFeeBasisPoints | Internal 🔒 |   | |
| └ | _exitFeeBasisPoints | Internal 🔒 |   | |
| └ | _entryFeeRecipient | Internal 🔒 |   | |
| └ | _exitFeeRecipient | Internal 🔒 |   | |
| └ | beforeWithdraw | Internal 🔒 | 🛑  | |
| └ | afterDeposit | Internal 🔒 | 🛑  | |
| └ | _feeOnRaw | Private 🔐 |   | |
| └ | _feeOnTotal | Private 🔐 |   | |
| └ | _doesRecipientPayFee | Internal 🔒 |   | |
| └ | _getMinFee | Internal 🔒 |   | |
||||||
| **VaultFactory** | Implementation | ChainlinkClient, ConfirmedOwner |||
| └ | <Constructor> | Public ❗️ | 🛑  | ConfirmedOwner |
| └ | togglePublicAPI | External ❗️ | 🛑  | onlyOwner |
| └ | createVault | External ❗️ | 🛑  |NO❗️ |
| └ | buildChainlinkTradeRequest | Internal 🔒 | 🛑  | |
| └ | getAddressKeys | Internal 🔒 | 🛑  | |
| └ | setStartingFees | External ❗️ | 🛑  | onlyOwner |
| └ | setOracleAddress | External ❗️ | 🛑  | onlyOwner |
| └ | setChainLinkToken | External ❗️ | 🛑  | onlyOwner |
| └ | setGainsAddress | External ❗️ | 🛑  | onlyOwner |
| └ | claimFunds | External ❗️ | 🛑  | onlyOwner |
| └ | toggleCaller | Public ❗️ | 🛑  | onlyOwner |
| └ | sendInfoRequest | External ❗️ | 🛑  |NO❗️ |
| └ | fulfill | Public ❗️ | 🛑  | recordChainlinkFulfillment |
| └ | preformAction | Public ❗️ | 🛑  | recordChainlinkFulfillment |


 Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
 

</div>
____
<sub>
Thinking about smart contract security? We can provide training, ongoing advice, and smart contract auditing. [Contact us](https://consensys.io/diligence/contact/).
</sub>


