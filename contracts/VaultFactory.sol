// SPDX-License-Identifier:  BSL-1.1
pragma solidity ^0.8.24;

import "hardhat/console.sol";
import "./AutoVault.sol";
import "./Libraries/Equation.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract VaultFactory is ChainlinkClient, ConfirmedOwner {
    using SafeERC20 for IERC20Metadata;
    using Chainlink for Chainlink.Request;
    using Math for uint256;
    using Clones for address;
    using Strings for address;
    // mapping(address => address[]) userToVaults; read events
    uint256 private constant minimumDeposit = 100;
    address public oracleAddress;
    address public chainLinkToken;
    address public gainsAddress;
    address public immutable autoVaultImplementation;

    mapping(string => bool) public publicAPIEndPoints;
    mapping(bytes32 => AutoVault) public requestToCaller;
    mapping(address => bool) public approvedVaults;

    error ArraysMustBeSameLength();
    mapping(IERC20Metadata => uint256[2]) public tokenToOracleFee;

    constructor(
        address oracleAddy,
        address _chainLinkToken,
        address _gainsAddress,
        address _autoVaultImplementation
    ) ConfirmedOwner(msg.sender) {
        oracleAddress = oracleAddy;
        chainLinkToken = _chainLinkToken;
        gainsAddress = _gainsAddress;
        autoVaultImplementation = _autoVaultImplementation;
        approvedCaller[msg.sender] = true;

        _setChainlinkToken(_chainLinkToken);
        _setChainlinkOracle(oracleAddy);
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
        if (5 < listOfStrategies.length) revert();
        require(initialAmount > minimumDeposit, "Deposit too low");
        if (tokenToOracleFee[collateral][0] == 0) revert CollateralNotAdded();

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
        approvedVaults[clonedVault] = true;
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

    string public constant trade_job = "168535c73f7b46cd8fd9a7f21bdbedc1";
    string public bodyA;

    function buildChainlinkTradeRequest(
        address vaultAddress,
        uint256 tokenDecimals
    ) internal returns (Chainlink.Request memory req) {
        req = _buildOperatorRequest(
            bytes32(bytes(trade_job)),
            this.preformAction.selector
        );
        req._add("method", trade_method);
        req._add("url", trade_url);
        req._add("headers", trade_headers);
        string memory body = '{"userAddress": "';
        body = string.concat(body, vaultAddress.toHexString());
        body = string.concat(body, '"}');
        bodyA = body;
        req._add("body", body);
        req._add("contact", "A"); // PLEASE ENTER YOUR CONTACT INFO. this allows us to notify you in the event of any emergencies related to your request (ie, bugs, downtime, etc.). example values: 'derek_linkwellnodes.io' (Discord handle) OR 'derek@linkwellnodes.io' OR '+1-617-545-4721'
        // req._add("path", trade_path);
        req._addInt("multiplier", int256(10 ** 18));
        return req;
    }

    error StrategiesAndAPIsSameLength(
        uint256 apiLength,
        uint256 strategyLength
    );

    function getAddressKeys(
        APIInfo[] calldata apiInfo,
        uint256[][] calldata listOfStrategies
    ) internal returns (address[] memory finalArr) {
        if (apiInfo.length != listOfStrategies.length) {
            revert StrategiesAndAPIsSameLength(
                apiInfo.length,
                listOfStrategies.length
            );
        }
        // require(apiInfo.length == listOfStrategies.length);
        // console.log(listOfStrategies.length);
        // console.log("# of strategies:", listOfStrategies.length);
        finalArr = new address[](listOfStrategies.length);

        for (uint i = 0; i < listOfStrategies.length; i++) {
            Chainlink.Request memory req = _buildOperatorRequest(
                bytes32(bytes(apiInfo[i].jobIDs)),
                this.fulfill.selector
            );
            req._add("method", apiInfo[i].method);
            req._add("url", apiInfo[i].url);
            uint256 feeMultiplier = 1_000_000;
            if (publicAPIEndPoints[apiInfo[i].url]) {
                feeMultiplier = 1_500_000;
            }
            req._add("headers", apiInfo[i].headers);
            if (bytes(apiInfo[i].body).length > 0) {
                req._add("body", apiInfo[i].body);
            }

            req._add("contact", "A"); // PLEASE ENTER YOUR CONTACT INFO. this allows us to notify you in the event of any emergencies related to your request (ie, bugs, downtime, etc.). example values: 'derek_linkwellnodes.io' (Discord handle) OR 'derek@linkwellnodes.io' OR '+1-617-545-4721'
            req._add("path", apiInfo[i].path);
            req._addInt("multiplier", 10 ** 18);

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
        uint256[2][] amounts
    );

    function setStartingFees(
        IERC20Metadata[] calldata tokens,
        uint256[2][] calldata amounts
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

    error NonApprovedVault(address vault);
    error NonApprovedCaller(address sender);
    mapping(address => bool) public approvedCaller;

    function toggleCaller(address user) public onlyOwner {
        approvedCaller[user] = !approvedCaller[user];
    }

    function sendInfoRequest(
        address caller,
        Chainlink.Request memory req,
        uint256 fee
    ) external returns (bytes32 requestId) {
        if (!approvedCaller[caller]) revert NonApprovedCaller(caller);
        if (!approvedVaults[msg.sender]) revert NonApprovedVault(msg.sender);
        requestId = _sendChainlinkRequest(req, fee);
        requestToCaller[requestId] = AutoVault(msg.sender);
    }

    function fulfill(
        bytes32 requestId,
        uint256[] calldata data
    ) public recordChainlinkFulfillment(requestId) {
        requestToCaller[requestId].fulfill(requestId, data);
    }

    function preformAction(
        bytes32 requestId,
        uint256[] memory data
    ) public recordChainlinkFulfillment(requestId) {
        requestToCaller[requestId].preformAction(requestId, data);
    }
}
