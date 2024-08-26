// SPDX-License-Identifier:  BSL-1.1
pragma solidity ^0.8.24;
//Fees https://docs.openzeppelin.com/contracts/4.x/erc4626
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../AutoVault.sol";
import "../Libraries/TransientPrimities.sol";

contract AutoVaultHarness is AutoVault {
    constructor(
        IERC20Upgradeable __asset,
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
        StartInfo memory startInfo = StartInfo({
            factoryOwner: owner(),
            vaultManager: msg.sender,
            chainLinkToken: _chainLinkToken,
            oracleAddress: _oracleAddress,
            gainsAddress: _gainsAddy
        });

        initialize(
            __asset,
            _buildOperatorRequest(
                bytes32(bytes("")),
                AutoVault.preformAction.selector
            ),
            startingBalance,
            startInfo,
            [uint256(10), 20],
            _name,
            _symbol,
            _equations
        );
    }

    function call_internalDeposit(uint256 assets, address receiver) external {
        super.internalDeposit(assets, receiver);
    }

    function call_executeAction(
        uint32 index,
        uint64 openPrice,
        uint256 feeMultiplier,
        uint256 action,
        uint256 strategy
    ) external {
        super.executeAction(index, openPrice, feeMultiplier, action, strategy);
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

    function call_entryFeeRecipient() external view returns (address, address) {
        return super._entryFeeRecipient();
    }

    function call_exitFeeRecipient() external view returns (address, address) {
        return super._exitFeeRecipient();
    }

    function getNumba() public view returns (uint256) {
        return TransientPrimitivesLib.get(totalValueCollateral);
    }

    function getAddy() public view returns (address) {
        return TransientPrimitivesLib.get(currentUser);
    }

    function getTrades() public view returns (Trade[] memory) {
        return GainsNetwork.getTrades(address(this));
    }

    function assetBalanceOfVault() public view returns (uint256) {
        return ERC20(asset()).balanceOf(address(this));
    }

    function call_adjustForDecimals(
        uint256 x,
        uint256 curD,
        uint256 desiredD
    ) public pure returns (uint256) {
        return super._adjustForDecimals(x, curD, desiredD);
    }
}
