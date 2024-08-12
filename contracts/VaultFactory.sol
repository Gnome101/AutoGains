// SPDX-License-Identifier:  BSL-1.1
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
    address public oracleAddress;
    address public chainLinkToken;
    address public gainsAddress;
    address public immutable autoVaultImplementation;

    mapping(string => bool) public publicAPIEndPoints;
    error ArraysMustBeSameLength();
    mapping(IERC20Metadata => uint256) public tokenToOracleFee;

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
    event PublicApiUpdate(string indexed url);

    function togglePublicAPI(string memory url) external onlyOwner {
        publicAPIEndPoints[url] = !publicAPIEndPoints[url];
        emit PublicApiUpdate(url);
    }

    event VaultCreated(
        address indexed vaultCreator,
        address indexed vaultAddress,
        IERC20Metadata indexed collateral,
        APIInfo[] apiinfo,
        uint256[][] strategy
    );
    error CollateralNotAdded();

    function createVault(
        IERC20Metadata collateral,
        uint256 initialAmount,
        APIInfo[] calldata apiInfo,
        uint256[][] calldata listOfStrategies
    ) external returns (address payable clonedVault) {
        require(initialAmount > minimumDeposit, "Deposit too low");
        if (tokenToOracleFee[collateral] == 0) revert CollateralNotAdded();

        collateral.safeTransferFrom(msg.sender, address(this), initialAmount);

        // Clone the AutoVault implementation
        clonedVault = payable(Clones.clone(autoVaultImplementation));
        AutoVault.StartInfo memory startInfo = AutoVault.StartInfo({
            factoryOwner: owner(),
            vaultManager: msg.sender,
            chainLinkToken: chainLinkToken,
            oracleAddress: oracleAddress,
            gainsAddress: gainsAddress
        });
        // Initialize the cloned vault
        AutoVault(clonedVault).initialize(
            collateral,
            buildChainlinkTradeRequest(clonedVault, collateral.decimals()),
            initialAmount,
            startInfo,
            tokenToOracleFee[collateral],
            string.concat("Auto", collateral.name()),
            string.concat("a", collateral.symbol()),
            getAddressKeys(apiInfo, listOfStrategies)
        );

        collateral.safeTransfer(clonedVault, initialAmount);

        // emit VaultCreated(address(newVault), msg.sender);
        emit VaultCreated(
            msg.sender,
            clonedVault,
            collateral,
            apiInfo,
            listOfStrategies
        );
    }

    string public constant trade_method = "POST";
    string public constant trade_url =
        "https://xpzyihmcunwwykjpfdgy.supabase.co/functions/v1/get-trading-variables";
    string public constant trade_headers =
        '["accept", "application/json", "Authorization","Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwenlpaG1jdW53d3lranBmZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0MjU3ODIsImV4cCI6MjAzODAwMTc4Mn0.mgu_pc2fGZgAQPSlMTY_FPLcsIvepIZb3geDXA7au-0"]';
    string public constant trade_body =
        '{"userAddress": "0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"}';
    string public constant trade_path = "totalCollateral;blockNumber";
    string public constant trade_job = "e20c7567b2bb4e3690c615d03457b5d3";

    function buildChainlinkTradeRequest(
        address vaultAddress,
        uint256 tokenDecimals
    ) internal view returns (Chainlink.Request memory req) {
        req = _buildOperatorRequest(
            bytes32(bytes(trade_job)),
            AutoVault.preformAction.selector
        );
        req._add("method", trade_method);
        req._add("url", trade_url);
        req._add("headers", trade_headers);
        req._add("body", trade_body);
        req._add("contact", "A"); // PLEASE ENTER YOUR CONTACT INFO. this allows us to notify you in the event of any emergencies related to your request (ie, bugs, downtime, etc.). example values: 'derek_linkwellnodes.io' (Discord handle) OR 'derek@linkwellnodes.io' OR '+1-617-545-4721'
        req._add("path", trade_path);
        req._addInt("multiplier", int256(10 ** tokenDecimals));
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
            uint256 feeMultiplier = 1_000_000;
            if (publicAPIEndPoints[apiInfo[i].url]) {
                feeMultiplier = 1_500_000;
            }
            req._add("headers", apiInfo[i].headers);
            req._add("body", apiInfo[i].body);
            req._add("contact", "A"); // PLEASE ENTER YOUR CONTACT INFO. this allows us to notify you in the event of any emergencies related to your request (ie, bugs, downtime, etc.). example values: 'derek_linkwellnodes.io' (Discord handle) OR 'derek@linkwellnodes.io' OR '+1-617-545-4721'
            req._add("path", apiInfo[i].path);
            req._addInt("multiplier", 10 ** 10);

            bytes memory encodedTree = Equation.init(listOfStrategies[i]);

            bytes memory encodedStrategy = abi.encode(
                feeMultiplier,
                req,
                encodedTree
            );

            address newStorage = SSTORE2.write(encodedStrategy);
            finalArr[i] = newStorage;
        }
    }

    event SetStartingFee(
        IERC20Metadata[] indexed collateral,
        uint256[] amounts
    );

    function setStartingFees(
        IERC20Metadata[] calldata tokens,
        uint256[] calldata amounts
    ) external onlyOwner {
        if (tokens.length != amounts.length) {
            revert ArraysMustBeSameLength();
        }
        for (uint i = 0; i < tokens.length; i++) {
            tokenToOracleFee[tokens[i]] = amounts[i];
        }
        emit SetStartingFee(tokens, amounts);
    }

    event OracleAddressSet(address indexed oracle);

    function setOracleAddress(address _oracleAddress) external onlyOwner {
        oracleAddress = _oracleAddress;
        emit OracleAddressSet(_oracleAddress);
    }

    event ChainLinkTokenSet(address indexed ChainLinkToken);

    function setChainLinkToken(address _chainLinkToken) external onlyOwner {
        chainLinkToken = _chainLinkToken;
        emit ChainLinkTokenSet(_chainLinkToken);
    }

    event GainsAddressSet(address indexed GainsAddress);

    function setGainsAddress(address _gainsAddress) external onlyOwner {
        gainsAddress = _gainsAddress;
        emit GainsAddressSet(_gainsAddress);
    }

    uint256 private ownerPercentShare = 7_000_000; //10e5 percision
    uint256 private constant percentShareScaling = 10_000_000;
    event FundsClaimed(
        address indexed owner,
        IERC20Metadata indexed asset,
        uint256 amount
    );

    function claimFunds(
        IERC20Metadata asset,
        uint256 funds
    ) external onlyOwner {
        asset.safeTransfer(msg.sender, funds);
        emit FundsClaimed(msg.sender, asset, funds);
    }
}
