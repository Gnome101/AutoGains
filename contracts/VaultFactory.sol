// SPDX-License-Identifier:  BSL-1.1
pragma solidity ^0.8.24;

// import "hardhat/console.sol";
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
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

import {StartInfo} from "./Structures.sol";

/**
 * @title VaultFactory
 * @dev A factory contract for creating and managing AutoVault instances
 */
contract VaultFactory is ChainlinkClient, ConfirmedOwner {
    using SafeERC20Upgradeable for IERC20MetadataUpgradeable;
    using Chainlink for Chainlink.Request;
    using Math for uint256;
    using Clones for address;
    using Strings for address;

    // Constants

    /// @dev This constant is used to denote the decimals needed for the chainlink reqest
    int256 private constant requestDecimals = 10 ** 18;

    /// @dev This constant is used to ensure a minimum initial deposit when creating a new vault
    uint256 private constant minimumDeposit = 10 ** 4;

    /// @dev This is the maximum amount of strategies that a position can have
    uint256 public constant maxStrategyCount = 10;

    //@dev This is the amount of decimals that the fees use
    uint256 public constant BIP = 1_000_000;

    // State variables
    /// @dev This address is used to send Chainlink requests for external data
    address public oracleAddress;

    /// @dev This token is used to pay for Chainlink oracle requests
    address public chainLinkToken;

    /// @dev This contract is used for trading operations within the vaults
    address public gainsAddress;

    /// @dev This immutable address is used as the base for creating new vault instances
    address public immutable autoVaultImplementation;

    ///@notice the state vars below are for getting the balance of the vault
    /// @dev This string is used for denoting the method of the api request
    string public trade_method = "POST";

    /// @dev This string is used for denoting the method of the api request
    string public trade_url =
        "https://xpzyihmcunwwykjpfdgy.supabase.co/functions/v1/get-trading-variables";

    /// @dev This string is used for denoting the method of the api request
    string public trade_headers = "";
    // '["accept", "application/json", "Authorization","Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwenlpaG1jdW53d3lranBmZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0MjU3ODIsImV4cCI6MjAzODAwMTc4Mn0.mgu_pc2fGZgAQPSlMTY_FPLcsIvepIZb3geDXA7au-0"]';

    /// @dev This string is used for denoting the method of the api request
    string public trade_job = "168535c73f7b46cd8fd9a7f21bdbedc1";

    // Mappings

    /// @notice Mapping to track public API endpoints
    /// @dev Keys are API URLs, values indicate whether the API is public (true) or not (false)
    mapping(string => uint256) public publicAPIEndPoints;

    /// @notice Mapping to associate Chainlink request IDs with corresponding AutoVault instances
    /// @dev Keys are Chainlink request IDs, values are the AutoVault contract addresses
    mapping(bytes32 => AutoVault) public requestToCaller;

    /// @notice Mapping to track approved vault addresses
    /// @dev Keys are vault addresses, values indicate whether the vault is approved (true) or not (false)
    mapping(address => bool) public approvedVaults;

    /// @notice Mapping to track approved caller addresses
    /// @dev Keys are caller addresses, values indicate whether the caller is approved (true) or not (false)
    mapping(address => bool) public approvedCaller;

    /// @notice Mapping to store oracle fees for different tokens
    /// @dev Keys are token addresses, values are arrays containing two fee values
    /// @dev The first value is typically the oracle fee, and the second is the vault action fee
    mapping(IERC20MetadataUpgradeable => uint256[2]) public tokenToOracleFee;

    // Events
    event PublicApiUpdate(string indexed url);

    event OracleAddressSet(address indexed oracle);
    event ChainLinkTokenSet(address indexed ChainLinkToken);
    event GainsAddressSet(address indexed GainsAddress);
    event FundsClaimed(
        address indexed owner,
        IERC20Metadata indexed asset,
        uint256 amount
    );
    event SetStartingFee(
        IERC20MetadataUpgradeable[] indexed collateral,
        uint256[2][] amounts
    );
    event FundsClaimed(
        address indexed owner,
        IERC20MetadataUpgradeable indexed asset,
        uint256 amount
    );

    event VaultCreated(
        address indexed vaultCreator,
        address indexed vaultAddress,
        IERC20MetadataUpgradeable indexed collateral,
        APIInfo[] apiinfo,
        uint256[][] strategy
    );
    // Errors
    error ArraysMustBeSameLength();
    error CollateralNotAdded();
    error NonApprovedVault(address vault);
    error NonApprovedCaller(address sender);
    error StrategiesAndAPIsSameLength(
        uint256 apiLength,
        uint256 strategyLength
    );
    error ExceedMaxStrategyCount(uint256 strategyAmount, uint256 maxAmount);

    /**
     * @dev Constructor for the VaultFactory contract
     * @param oracleAddy Address of the Chainlink oracle
     * @param _chainLinkToken Address of the LINK token
     * @param _gainsAddress Address of the Gains Network contract
     * @param _autoVaultImplementation Address of the AutoVault implementation contract
     */
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

    /**
     * @dev Toggles the public API status for a given URL
     * @param url The URL to toggle
     */
    function changePublicAPI(
        string memory url,
        uint256 feeMultiplier
    ) external onlyOwner {
        publicAPIEndPoints[url] = feeMultiplier;
        emit PublicApiUpdate(url);
    }

    /**
     * @dev Creates a new AutoVault instance
     * @param collateral The collateral token for the vault
     * @param initialAmount The initial amount to deposit
     * @param apiInfo Array of API information for strategies
     * @param listOfStrategies Array of strategy parameters
     * @return clonedVault The address of the newly created vault
     */
    function createVault(
        IERC20MetadataUpgradeable collateral,
        uint256 initialAmount,
        APIInfo[] calldata apiInfo,
        uint256[][] calldata listOfStrategies,
        string memory collName,
        string memory collSymbol
    ) external returns (address payable clonedVault) {
        if (maxStrategyCount < listOfStrategies.length)
            revert ExceedMaxStrategyCount(
                listOfStrategies.length,
                maxStrategyCount
            );
        if (tokenToOracleFee[collateral][0] == 0) revert CollateralNotAdded();

        collateral.safeTransferFrom(msg.sender, address(this), initialAmount);
        // Clone the AutoVault implementation
        clonedVault = payable(Clones.clone(autoVaultImplementation));
        StartInfo memory startInfo = StartInfo({
            factoryOwner: owner(),
            vaultManager: msg.sender,
            chainLinkToken: chainLinkToken,
            oracleAddress: oracleAddress,
            gainsAddress: gainsAddress
        });
        // Initialize the cloned vault
        AutoVault(clonedVault).initialize(
            collateral,
            initialAmount,
            startInfo,
            collName,
            collSymbol,
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

    /**
     * @dev Builds a Chainlink request for trade execution
     * @param vaultAddress The address of the vault
     * @return req The built Chainlink request
     */
    function buildChainlinkTradeRequest(
        address vaultAddress
    ) public view returns (Chainlink.Request memory req) {
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
        req._add("body", body);
        req._add("contact", "A"); // PLEASE ENTER YOUR CONTACT INFO. this allows us to notify you in the event of any emergencies related to your request (ie, bugs, downtime, etc.). example values: 'derek_linkwellnodes.io' (Discord handle) OR 'derek@linkwellnodes.io' OR '+1-617-545-4721'
        req._add("path", "totalnewCollateral;blockTimestamp");
        req._addInt("multiplier", int256(requestDecimals));
        return req;
    }

    /**
     * @dev Generates address keys for strategies
     * @param apiInfo Array of API information
     * @param listOfStrategies Array of strategy parameters
     * @return finalArr Array of generated address keys
     */
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
            uint256 feeMultiplier = BIP + publicAPIEndPoints[apiInfo[i].url];
            if (bytes(apiInfo[i].headers).length > 0) {
                req._add("headers", apiInfo[i].headers);
            }
            if (bytes(apiInfo[i].body).length > 0) {
                req._add("body", apiInfo[i].body);
            }

            req._add("contact", "A"); // PLEASE ENTER YOUR CONTACT INFO. this allows us to notify you in the event of any emergencies related to your request (ie, bugs, downtime, etc.). example values: 'derek_linkwellnodes.io' (Discord handle) OR 'derek@linkwellnodes.io' OR '+1-617-545-4721'
            req._add("path", apiInfo[i].path);
            req._addInt("multiplier", requestDecimals);

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

    /**
     * @dev Sets the starting fees for multiple tokens
     * @param tokens Array of token addresses
     * @param amounts Array of fee amounts
     */
    function setStartingFees(
        IERC20MetadataUpgradeable[] calldata tokens,
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

    /**
     * @dev Sets the oracle address
     * @param _oracleAddress The new oracle address
     */
    function setOracleAddress(address _oracleAddress) external onlyOwner {
        oracleAddress = _oracleAddress;
        emit OracleAddressSet(_oracleAddress);
    }

    /**
     * @dev Sets the Chainlink token address
     * @param _chainLinkToken The new Chainlink token address
     */
    function setChainLinkToken(address _chainLinkToken) external onlyOwner {
        chainLinkToken = _chainLinkToken;
        emit ChainLinkTokenSet(_chainLinkToken);
    }

    /**
     * @dev Sets the Gains Network address
     * @param _gainsAddress The new Gains Network address
     */
    function setGainsAddress(address _gainsAddress) external onlyOwner {
        gainsAddress = _gainsAddress;
        emit GainsAddressSet(_gainsAddress);
    }

    /**
     * @dev Claims funds from the contract
     * @param asset The token to claim
     * @param funds The amount of funds to claim
     */
    function claimFunds(
        IERC20MetadataUpgradeable asset,
        uint256 funds
    ) external onlyOwner {
        asset.safeTransfer(msg.sender, funds);
        emit FundsClaimed(msg.sender, asset, funds);
    }

    /**
     * @dev Toggles the approved caller status for a user
     * @param user The address of the user
     */
    function toggleCaller(address user) public onlyOwner {
        approvedCaller[user] = !approvedCaller[user];
    }

    /**
     * @dev Sends an info request to the Chainlink oracle
     * @param caller The address of the caller
     * @param req The Chainlink request
     * @param fee The fee for the request
     * @return requestId The ID of the Chainlink request
     */
    function sendInfoRequest(
        address caller,
        Chainlink.Request memory req,
        uint256 fee
    ) public returns (bytes32 requestId) {
        if (!approvedCaller[caller]) revert NonApprovedCaller(caller);
        if (!approvedVaults[msg.sender]) revert NonApprovedVault(msg.sender);
        requestId = _sendChainlinkRequest(req, fee);
        requestToCaller[requestId] = AutoVault(msg.sender);
    }

    /**
     * @dev Sends an info request to the Chainlink oracle
     * @param fee The fee for the request
     * @return requestId The ID of the Chainlink request
     */
    function sendVaultBalanceReq(
        uint256 fee
    ) external returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkTradeRequest(msg.sender);
        if (!approvedVaults[msg.sender]) revert NonApprovedVault(msg.sender);
        requestId = _sendChainlinkRequest(req, fee);
        requestToCaller[requestId] = AutoVault(msg.sender);
    }

    /**
     * @dev Fulfills a Chainlink request
     * @param requestId The ID of the request
     * @param data The data returned by the oracle
     */
    function fulfill(
        bytes32 requestId,
        uint256[] calldata data
    ) public recordChainlinkFulfillment(requestId) {
        requestToCaller[requestId].fulfill(requestId, data);
    }

    /**
     * @dev Performs an action based on the Chainlink response
     * @param requestId The ID of the request
     * @param data The data returned by the oracle
     */
    function preformAction(
        bytes32 requestId,
        uint256[] memory data
    ) public recordChainlinkFulfillment(requestId) {
        requestToCaller[requestId].preformAction(requestId, data);
    }

    /**
     * @dev Returns the oracle fee for a given asset
     * @param asset The address of the asset
     * @notice This is the min fee for actions when there is a trade
     * @return The oracle fee for that given asset
     */
    function getOracleFee(address asset) public view returns (uint256) {
        return tokenToOracleFee[IERC20MetadataUpgradeable(asset)][0];
    }

    /**
     * @dev Returns the vault fee for a given asset
     * @notice This is generally the min fee for all actions when there are no trades
     * @param asset The address of the asset
     * @return The vault action fee for that given asset
     */
    function getVaultActionFee(address asset) public view returns (uint256) {
        return tokenToOracleFee[IERC20MetadataUpgradeable(asset)][1];
    }

    /**
     * @dev Changes the method used to call for the balance API
     * @notice This is used in case the API for user positions changes
     * @param method The new string method for requests
     */
    function changeMethod(string memory method) external onlyOwner {
        trade_method = method;
    }

    /**
     * @dev Changes the url used to call for the balance API
     * @notice This is used in case the API for user positions changes
     * @param url The new string url for requests
     */
    function changeURl(string memory url) external onlyOwner {
        trade_url = url;
    }

    /**
     * @dev Changes the headers used to call for the balance API
     * @notice This is used in case the API for user positions changes
     * @param headers The new string headers for requests
     */
    function changeHeaders(string memory headers) external onlyOwner {
        trade_headers = headers;
    }

    /**
     * @dev Changes the jobID used to call for the balance API
     * @notice This is used in case the API for user positions changes
     * @param jobID The new string jobID for requests
     */
    function changeJob(string memory jobID) external onlyOwner {
        trade_job = jobID;
    }
}
