// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";
import "./AutoVault.sol";
import "./Libraries/Equation.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract VaultFactory is ChainlinkClient, Ownable {
    using SafeERC20 for IERC20Metadata;
    using Chainlink for Chainlink.Request;
    using Math for uint256;
    using Clones for address;

    // mapping(address => address[]) userToVaults; read events
    uint256 private constant minimumDeposit = 100;
    address private oracleAddress;
    address private chainLinkToken;
    address private gainsAddress;
    address public immutable autoVaultImplementation;

    constructor(
        address oracleAddy,
        address _chainLinkToken,
        address _gainsAddress,
        address _autoVaultImplementation
    ) Ownable(msg.sender) {
        oracleAddress = oracleAddy;
        chainLinkToken = _chainLinkToken;
        gainsAddress = _gainsAddress;
        autoVaultImplementation = _autoVaultImplementation;
    }

    struct APIInfo {
        string method;
        string url;
        string headers;
        string body;
        string path;
        string jobIDs;
    }

    // function createVault(
    //     IERC20Metadata collateral,
    //     uint256 initialAmount,
    //     APIInfo[] calldata apiInfo,
    //     uint256[][] calldata listOfStrategies
    // ) external returns (AutoVault newVault) {
    //     require(initialAmount > minimumDeposit);
    //     collateral.safeTransferFrom(msg.sender, address(this), initialAmount);

    //     address[] memory keys = getAddressKeys(apiInfo, listOfStrategies);

    //     newVault = new AutoVault(
    //         collateral,
    //         initialAmount,
    //         owner(),
    //         msg.sender,
    //         string.concat("Auto", collateral.name()),
    //         string.concat("a", collateral.symbol()),
    //         keys,
    //         chainLinkToken,
    //         oracleAddress,
    //         gainsAddress
    //     );

    //     collateral.safeTransfer(address(newVault), initialAmount);
    //     // console.log("Vault deployed at ", address(newVault));
    //     // userToVaults[msg.sender] = address(newVault);
    // }
    function createVault(
        IERC20Metadata collateral,
        uint256 initialAmount,
        APIInfo[] calldata apiInfo,
        uint256[][] calldata listOfStrategies
    ) external returns (AutoVault newVault) {
        require(initialAmount > minimumDeposit, "Deposit too low");
        collateral.safeTransferFrom(msg.sender, address(this), initialAmount);

        address[] memory keys = getAddressKeys(apiInfo, listOfStrategies);

        // Clone the AutoVault implementation
        address payable clonedVault = payable(
            Clones.clone(autoVaultImplementation)
        );

        // Initialize the cloned vault
        AutoVault(clonedVault).initialize(
            collateral,
            initialAmount,
            owner(),
            msg.sender,
            string.concat("Auto", collateral.name()),
            string.concat("a", collateral.symbol()),
            keys,
            chainLinkToken,
            oracleAddress,
            gainsAddress
        );

        newVault = AutoVault(clonedVault);
        collateral.safeTransfer(address(newVault), initialAmount);

        // emit VaultCreated(address(newVault), msg.sender);
    }

    function getAddressKeys(
        APIInfo[] calldata apiInfo,
        uint256[][] calldata listOfStrategies
    ) internal returns (address[] memory finalArr) {
        require(apiInfo.length == listOfStrategies.length);
        // console.log(listOfStrategies.length);
        // console.log("# of strategies:", listOfStrategies.length);
        finalArr = new address[](listOfStrategies.length);
        for (uint i = 0; i < listOfStrategies.length; i++) {
            Chainlink.Request memory req = _buildOperatorRequest(
                bytes32(bytes(apiInfo[i].jobIDs)),
                AutoVault.fulfill.selector
            );
            req._add("method", apiInfo[i].method);
            req._add("url", apiInfo[i].url);
            req._add("headers", apiInfo[i].headers);
            req._add("body", apiInfo[i].body);
            req._add("contact", "A"); // PLEASE ENTER YOUR CONTACT INFO. this allows us to notify you in the event of any emergencies related to your request (ie, bugs, downtime, etc.). example values: 'derek_linkwellnodes.io' (Discord handle) OR 'derek@linkwellnodes.io' OR '+1-617-545-4721'
            req._add("path", apiInfo[i].path);
            req._addInt("multiplier", 10 ** 10);

            bytes memory encodedTree = Equation.init(listOfStrategies[i]);

            bytes memory encodedStrategy = abi.encode(req, encodedTree);

            address newStorage = SSTORE2.write(encodedStrategy);
            finalArr[i] = newStorage;
        }
    }

    function setOracleAddress(address _oracleAddress) external onlyOwner {
        oracleAddress = _oracleAddress;
    }

    function setChainLinkToken(address _chainLinkToken) external onlyOwner {
        chainLinkToken = _chainLinkToken;
    }

    function setGainsAddress(address _gainsAddress) external onlyOwner {
        gainsAddress = _gainsAddress;
    }

    uint256 private ownerPercentShare = 7_000_000; //10e5 percision
    uint256 private constant percentShareScaling = 10_000_000;

    // function claimFunds(
    //     AutoVault vault,
    //     uint256 sharesToWithdraw
    // ) external returns (uint256 assetsEarned) {
    //     uint256 ownerShare = sharesToWithdraw.mulDiv(
    //         ownerPercentShare,
    //         percentShareScaling,
    //         Math.Rounding.Ceil
    //     );
    //     uint256 managerShare = sharesToWithdraw - ownerPercentShare;
    //     assetsEarned = vault.redeem(ownerShare, owner(), address(this));
    //     vault.transfer(vault.owner(), managerShare);
    // }
}
