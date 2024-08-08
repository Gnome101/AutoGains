// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
//Fees https://docs.openzeppelin.com/contracts/4.x/erc4626
import "hardhat/console.sol";

import "../AutoVault.sol";
import "../Libraries/TransientPrimities.sol";

contract AutoVaultHarness is AutoVault {
    constructor(
        IERC20 __asset,
        uint256 startingBalance,
        address factoryOwner,
        address _vaultManager,
        string memory _name,
        string memory _symbol,
        address[] memory _equations,
        address _chainLinkToken,
        address _oracleAddress,
        address _gainsAddy
    ) {
        initialize(
            __asset,
            startingBalance,
            factoryOwner,
            _vaultManager,
            _name,
            _symbol,
            _equations,
            _chainLinkToken,
            _oracleAddress,
            _gainsAddy
        );
    }

    function call_internalDeposit(uint256 assets, address receiver) external {
        super.internalDeposit(assets, receiver);
    }

    function call_executeAction(
        uint32 index,
        uint64 openPrice,
        uint256 action,
        uint256 strategy
    ) external {
        super.executeAction(index, openPrice, action, strategy);
    }

    function call_extractTrade(
        uint256 action,
        uint32 index,
        uint64 currentOpen
    ) external view returns (Trade memory, uint32) {
        return super.extractTrade(action, index, currentOpen);
    }

    function call_entryFeeBasisPoints() external view returns (uint256) {
        return super._entryFeeBasisPoints(); // replace with e.g. 100 for 1%
    }

    function call_exitFeeBasisPoints() external view returns (uint256) {
        return super._exitFeeBasisPoints(); // replace with e.g. 100 for 1%
    }

    function call_entryFeeRecipient() external view returns (address) {
        return super._entryFeeRecipient();
    }

    function call_exitFeeRecipient() external view returns (address) {
        return super._exitFeeRecipient();
    }

    function getNumba() public view returns (uint256) {
        return TransientPrimitivesLib.get(totalValueCollateral);
    }

    function getAddy() public view returns (address) {
        return TransientPrimitivesLib.get(currentUser);
    }
}
