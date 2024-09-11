// SPDX-License-Identifier: BSL-1.1
pragma solidity ^0.8.24;

import "./Libraries/Equation.sol";
import "solmate/src/utils/SSTORE2.sol";
import "./Interfaces/ERC4626Fees.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import {Trade, TradeType, Counter, CounterType, IGainsNetwork} from "./Gains Contracts/IGainsNetwork.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import "./Libraries/TransientPrimities.sol";
// import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./VaultFactory.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {Choice, VaultAction, StartInfo, RewardInfo} from "./Structures.sol";

contract AutoVault is ERC4626Fees, ChainlinkClient, Pausable {
    using Chainlink for Chainlink.Request;
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20Metadata;
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using Math for uint120;
    using Math for uint256;

    using Strings for uint256;
    //State Variables ----------------------------------------------------------------------

    /// @dev Interface for interacting with the GainsNetwork trading platform
    IGainsNetwork public GainsNetwork;

    /// @dev Address of the vault manager (owner) who can pause and manage the vault
    address public vaultManager;

    /// @dev Address of the VaultFactory contract that created this vault
    address private vaultFactory;

    /// @dev Referral address for all trades executed by this vault
    address public specialRefer = 0xB46838207D4CDc3b0F6d8862b8F0d29fee938051;

    /// @dev Mapping to store the last mint timestamp for each user
    mapping(address => uint256) private _lastMintTimestamp;

    // /// @dev Oracle fee for Chainlink requests
    // uint256 public oracleFee;

    // /// @dev Fee for vault actions (e.g., deposits, withdrawals)
    // uint256 public vaultActionFee;

    /// @dev Timestamp for the next available withdraw period
    uint256 public nextWithdrawPeriod;

    /// @dev Flag to indicate if the vault is currently in a withdraw period
    bool public isWithdrawPeriod;

    /// @dev Mapping of request IDs to their corresponding strategies
    mapping(bytes32 => uint256) public requestToStrategy;

    /// @dev Mapping of strategy IDs to their corresponding index
    mapping(uint256 => uint32) public strategyToIndex;

    /// @dev Mapping of index to strategy IDs
    mapping(uint32 => uint256) public indexToStrategy;

    /// @dev Mapping of index to percent of position
    mapping(uint256 => uint256) public indexToPercentPosition;

    /// @dev Mapping of request IDs to VaultActions
    mapping(bytes32 => VaultAction) public requestToAction;

    /// @dev Array of strategy addresses
    address[] public strategies;

    /// @dev Transient variable to store the total value of collateral
    tuint256 public totalValueCollateral;

    /// @dev Transient variable to store the current user's address
    taddress public currentUser;

    /// @dev Mapping used to track the fees associated with a requestID
    mapping(bytes32 => RewardInfo) public rewardBot;

    ///@dev Fee given to the chainlink oracle, usually 0 as its prepaid
    uint256 private fee;

    // Constants ----------------------------------------------------------------------

    /// @notice Entry fee percentage in basis points
    /// @dev 80 basis points = 0.8% entry fee
    uint256 public constant ENTRY_FEE = 80;

    /// @notice Exit fee percentage in basis points
    /// @dev 80 basis points = 0.8% exit fee
    uint256 public constant EXIT_FEE = 80;

    /// @notice Swap fee percentage in basis points
    /// @dev 2000 basis points = 0.2% swap fee
    uint256 public constant SWAP_FEE = 2_000;

    /// @notice Maximum allowed time difference (in seconds) for oracle responses
    /// @dev Used to ensure oracle data is recent
    uint256 public constant MAX_TIME_DIFFERENCE = 20;

    /// @notice Duration of the withdraw period in seconds
    /// @dev 2 hours (7200 seconds)
    uint256 public constant withdrawPeriodLength = 60 * 60 * 2;

    /// @notice Minimum time between setting withdraw periods
    /// @dev 7 days (604800 seconds)
    uint256 public constant MIN_PERIOD_TIME = 60 * 60 * 24 * 7;

    /// @notice Maximum number of concurrent trades that a vault can hold
    /// @dev This limit is in place so that the gas to preform the fufillment doesn't go too high
    uint256 public constant MAX_NUMBER_TRADES = 5;

    /// @notice This is the amount of zeroes that each request has associated with it
    /// @dev The `requestDecimals` variable in vaultFactory is related to this one
    uint256 private constant DECIMAL_COUNT = 18;

    /// @notice This is the actual amount of decimals attached to requests
    uint256 private constant REQ_DECIMAL = 10 ** DECIMAL_COUNT;

    //@dev This is the amount of decimals that the fees use
    uint256 private constant BIP = 1_000_000;

    // Events ----------------------------------------------------------------------
    event WithdrawPeriodSet(uint256 date);
    event WithdrawPeriodStarted();
    event WithdrawPeriodTriggered();
    event WithdrawPeriodEnded();
    event ApprovalExtended(address indexed msgSender);
    event OracleFeeSet(address indexed sender, uint256 indexed amount);

    // Errors ----------------------------------------------------------------------
    error IncorrectTradeData(uint256 expectedLength, uint256 actualLength);
    error PastWithdrawPeriod(uint256 timeAfter);
    error NotYetWithdrawPeriod(uint256 timeRemaining);
    error NoWithdrawPeriodSet();
    error WithdrawPeriodAlreadySet();
    error NotTokenHolder(address user);
    error WithdrawPeriodAlreadyActive();
    error WithdrawPeriodAlreadyEnded();
    error VaultManagerOnly();
    error InvalidAction();
    error NoAction();
    error InsufficientBalance();
    error NeedCallback();
    error Slippage();
    error StrategyNotActive();
    error StrategyAlreadyActive();
    error TimeStampDifferenceTooLarge(uint256 timeStampDifference);
    error FactoryManagerOnly();
    error NoTradesDuringWithdrawPeriod();
    error ExceedMaxTradeCount(uint256 amountOfTrades, uint256 maxTradesAmount);

    // Modifiers
    modifier onlyFactory() {
        if (msg.sender != vaultFactory) revert FactoryManagerOnly();
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != vaultManager) revert VaultManagerOnly();
        _;
    }

    modifier revertDuringWithdrawPeriod() {
        if (
            block.timestamp >= nextWithdrawPeriod &&
            block.timestamp <= nextWithdrawPeriod + withdrawPeriodLength
        ) {
            revert NoTradesDuringWithdrawPeriod();
        }
        if (isWithdrawPeriod) {
            revert NoTradesDuringWithdrawPeriod();
        }
        _;
    }

    /**
     * @dev Gives all of the strategies being used
     * @return Array of addresses each being a contract that contains fee multiplier + api + encoded abstract tree
     */
    function returnStrategies() public view returns (address[] memory) {
        return strategies;
    }

    /**
     * @dev Initializes the AutoVault. This function is used instead of a constructor for upgradeable contracts.
     * @param __asset The underlying asset token that the vault will use for trading
     * @param startingBalance The initial balance of the vault
     * @param startingInfo Struct containing addresses for various components (factory, manager, tokens, etc.)
     * @param _name The name of the vault token
     * @param _symbol The symbol of the vault token
     * @param _equations Array of addresses containing encoded strategy information
     */
    function initialize(
        IERC20Upgradeable __asset,
        uint256 startingBalance,
        StartInfo memory startingInfo,
        string memory _name,
        string memory _symbol,
        address[] memory _equations
    ) public initializer {
        __ERC4626_init(__asset);
        __ERC20_init(_name, _symbol);

        strategies = _equations;
        GainsNetwork = IGainsNetwork(startingInfo.gainsAddress);
        vaultManager = startingInfo.vaultManager;

        vaultFactory = msg.sender;
        internalDeposit(startingBalance, startingInfo.vaultManager);
        // oracleFee = startingFee[0];
        // vaultActionFee = startingFee[1];
        // tradeFee = startingFee[2];
        __asset.approve(startingInfo.gainsAddress, type(uint256).max);
    }

    /**
     * @dev Initiates a vault action (deposit, mint, or enter withdraw period).
     * @param receiver The address that will receive the tokens or shares.
     * @param amount The amount of tokens or shares for the action.
     * @param choice The type of action to perform (DEPOSIT, MINT, or WITHDRAW_PERIOD).
     * @param slippage The maximum allowed slippage for the action.
     * @return requestId The ID of the Chainlink request.
     */
    function startAction(
        address receiver,
        uint256 amount,
        Choice choice,
        uint256 slippage
    ) external returns (bytes32 requestId) {
        if (choice == Choice.WITHDRAW_PERIOD) _checkIfWithdrawPeriod();

        requestId = VaultFactory(vaultFactory).sendVaultBalanceReq(fee);
        requestToAction[requestId] = VaultAction(
            msg.sender,
            receiver,
            amount,
            choice,
            slippage
        );
    }

    /**
     * @dev Returns the asset used by the vault.
     * @return The IERC20Upgradeable interface of the asset.
     */
    function getAsset() internal view returns (IERC20Upgradeable) {
        return IERC20Upgradeable(asset());
    }

    /**
     * @dev Extends the approval for the GainsNetwork contract.
     */
    function extendApproval() public {
        getAsset().forceApprove(address(GainsNetwork), type(uint256).max);
        emit ApprovalExtended(msg.sender);
    }

    /**
     * @dev Executes the vault action initiated by startAction. This function is called by the Chainlink oracle.
     * @param requestId The ID of the Chainlink request.
     * @param data The data returned by the Chainlink oracle.
     */

    function preformAction(
        bytes32 requestId,
        uint256[] memory data
    ) public onlyFactory {
        VaultAction memory vaultAction = requestToAction[requestId];
        currentUser.set(vaultAction.msgSender);
        data[0] = _adjustForDecimals(data[0], DECIMAL_COUNT, decimals());

        totalValueCollateral.set(data[0] > 0 ? data[0] + 1 : 1);

        if ((data[1] / (REQ_DECIMAL)) + MAX_TIME_DIFFERENCE < block.timestamp) {
            revert TimeStampDifferenceTooLarge(
                block.timestamp - data[1] / (REQ_DECIMAL)
            );
        }

        uint256 result;
        if (vaultAction.choice == Choice.DEPOSIT) {
            result = this.deposit(vaultAction.amount, vaultAction.receiver);
            if (vaultAction.slippage > result) revert Slippage();
        } else if (vaultAction.choice == Choice.MINT) {
            result = this.mint(vaultAction.amount, vaultAction.receiver);
            if (vaultAction.slippage < result) revert Slippage();
        } else if (vaultAction.choice == Choice.WITHDRAW_PERIOD) {
            closeAllPositions(data);
        } else {
            revert InvalidAction();
        }

        totalValueCollateral.set(0);
        currentUser.set(address(0));
    }

    //This is what has to be called before a strategy

    /**
     * @dev Executes a trading strategy.
     * @param strategy The index of the strategy to execute.
     * @return requestId The ID of the Chainlink request.
     */
    function executeStrategy(
        uint256 strategy
    )
        external
        whenNotPaused
        revertDuringWithdrawPeriod
        returns (bytes32 requestId)
    {
        (uint256 feeMultiplier, Chainlink.Request memory req, ) = abi.decode(
            SSTORE2.read(strategies[strategy]),
            (uint256, Chainlink.Request, bytes)
        );

        requestId = VaultFactory(vaultFactory).sendInfoRequest(
            msg.sender,
            req,
            fee
        );

        requestToStrategy[requestId] = strategy;
        rewardBot[requestId] = RewardInfo({
            masterFee: Math.mulDiv(
                VaultFactory(vaultFactory).getOracleFee(asset()) * 2,
                feeMultiplier,
                BIP,
                Math.Rounding.Ceil
            ), // Public API Fee comes out to same as oracleFee
            feeMultiplier: feeMultiplier,
            caller: msg.sender
        });
    }

    /**
     * @dev Fulfills the Chainlink request and executes the trading action.
     * @param requestId The ID of the Chainlink request.
     * @param data The data returned by the Chainlink oracle.
     */
    function fulfill(
        bytes32 requestId,
        uint256[] calldata data
    ) public whenNotPaused onlyFactory revertDuringWithdrawPeriod {
        // console.log(data.leWngth);
        if ((data[1] / (REQ_DECIMAL)) + MAX_TIME_DIFFERENCE < block.timestamp) {
            revert TimeStampDifferenceTooLarge(
                block.timestamp - data[1] / (REQ_DECIMAL)
            );
        }

        uint256 strategy = requestToStrategy[requestId];
        uint256 action = processStrategy(strategy, data[2:]);
        if (action == 0) revert NoAction();

        uint32 index = strategyToIndex[strategy];
        if (index == 0) {
            Counter memory counter = GainsNetwork.getCounters(
                address(this),
                CounterType(0)
            );
            index = counter.currentIndex + 1;
        }
        RewardInfo memory rewardInfo = rewardBot[requestId];

        executeAction(
            index - 1,
            uint64(data[0] / (10 ** 8)),
            rewardInfo.feeMultiplier,
            action,
            strategy
        );

        //Send 2/3 of the oracle fee to the rewardBot
        getAsset().safeTransfer(
            rewardInfo.caller,
            VaultFactory(vaultFactory).getOracleFee(asset()) / 3
        );

        //Send the remaining balance to the vaultFactory
        getAsset().safeTransfer(
            vaultFactory,
            rewardInfo.masterFee -
                VaultFactory(vaultFactory).getOracleFee(asset()) /
                3
        );
    }

    /**
     * @dev Processes the strategy and returns the action to be executed.
     * @param strategy The index of the strategy to process.
     * @param inputs The input data for the strategy.
     * @return action The action to be executed.
     */
    function processStrategy(
        uint256 strategy,
        uint256[] calldata inputs
    ) public view returns (uint256 action) {
        (, , bytes memory encodedTree) = abi.decode(
            SSTORE2.read(strategies[strategy]),
            (uint256, Chainlink.Request, bytes)
        );
        return Equation.calculate(encodedTree, inputs);
    }

    /**
     * @dev Applies the swap fee to a given amount.
     * @param totalCollateralAmount The total amount of collateral.
     * @param feeMultiplier The fee multiplier to apply.
     * @return swapFee The calculated swap fee.
     */
    function applySwapFee(
        uint256 totalCollateralAmount,
        uint256 feeMultiplier
    ) internal returns (uint120 swapFee) {
        swapFee = uint120(
            Math.mulDiv(
                totalCollateralAmount,
                SWAP_FEE,
                BIP,
                Math.Rounding.Ceil
            )
        );
        swapFee = uint120(
            Math.mulDiv(swapFee, feeMultiplier, BIP, Math.Rounding.Ceil)
        );

        getAsset().safeTransfer(vaultFactory, swapFee);
    }

    /**
     * @dev Executes the trading action based on the processed strategy.
     * @param index The index of the trade.
     * @param openPrice The current open price.
     * @param feeMultiplier The fee multiplier for the action.
     * @param action The action to be executed.
     * @param strategy The index of the strategy being executed.
     */
    function executeAction(
        uint32 index,
        uint64 openPrice,
        uint256 feeMultiplier,
        uint256 action,
        uint256 strategy
    ) internal {
        uint256 actionType = uint8(action >> 252);

        //This reverts when a user is attempting to open another trade on the same strategy
        if (actionType == 0 && strategyToIndex[strategy] != 0) {
            revert StrategyAlreadyActive();
        }
        if (actionType != 0 && strategyToIndex[strategy] == 0) {
            revert StrategyNotActive();
        }
        if (
            actionType == 0 &&
            GainsNetwork.getTrades(address(this)).length == MAX_NUMBER_TRADES
        ) {
            revert ExceedMaxTradeCount(
                GainsNetwork.getTrades(address(this)).length + 1,
                MAX_NUMBER_TRADES
            );
        }

        if (actionType == 0) {
            (Trade memory trade, uint32 posPercent) = extractTrade(
                action,
                index,
                openPrice
            );
            // indexToPercentPosition[index] = posPercent;
            trade.collateralAmount -= applySwapFee(
                trade.collateralAmount,
                feeMultiplier
            );

            GainsNetwork.openTrade(trade, uint16(action >> 236), specialRefer);
            indexToStrategy[index] = strategy + 1;
            strategyToIndex[strategy] = index + 1;
        } else if (actionType == 1) {
            GainsNetwork.updateSl(
                index,
                uint64(Math.mulDiv(openPrice, uint32(action >> 220), BIP))
            );
        } else if (actionType == 2) {
            GainsNetwork.updateTp(
                index,
                uint64(Math.mulDiv(openPrice, uint32(action >> 220), BIP))
            );
        } else if (actionType == 3) {
            GainsNetwork.updateOpenOrder(
                index,
                uint64(Math.mulDiv(openPrice, uint32(action >> 204), BIP)),
                uint64(Math.mulDiv(openPrice, uint32(action >> 172), BIP)),
                uint64(Math.mulDiv(openPrice, uint32(action >> 140), BIP)),
                uint16(action >> 236)
            );
        } else if (actionType == 4) {
            GainsNetwork.cancelOpenOrder(index);
            indexToStrategy[index] = 0;
        } else if (actionType == 5) {
            GainsNetwork.closeTradeMarket(index, openPrice);
            indexToStrategy[index] = 0;
            strategyToIndex[strategy] = 0;
        } else if (actionType == 6) {
            GainsNetwork.updateLeverage(index, uint24(action >> 228));
        } else if (actionType == 7) {
            Trade memory trade = GainsNetwork.getTrade(address(this), index);
            GainsNetwork.decreasePositionSize(
                index,
                uint120(
                    Math.mulDiv(
                        trade.collateralAmount,
                        uint32(action >> 220),
                        BIP
                    )
                ),
                uint24(action >> 196),
                uint64(Math.mulDiv(openPrice, uint32(action >> 164), BIP))
            );
        } else if (actionType == 8) {
            Trade memory trade = GainsNetwork.getTrade(address(this), index);

            uint120 collateralDelta = uint120(
                Math.mulDiv(trade.collateralAmount, uint32(action >> 204), BIP)
            );
            collateralDelta -= applySwapFee(collateralDelta, feeMultiplier);

            GainsNetwork.increasePositionSize(
                index,
                collateralDelta,
                uint24(action >> 180),
                uint64(Math.mulDiv(openPrice, uint32(action >> 148), BIP)),
                uint16(action >> 236)
            );
        }
    }

    /**
     * @dev Extracts trade information from an encoded action number.
     * @param action The encoded action number containing trade details.
     * @param index The index of the trade.
     * @param currentOpen The current open price.
     * @return trade The extracted Trade struct.
     * @return collateralPercentage The percentage of collateral to use for the trade.
     */
    function extractTrade(
        uint256 action,
        uint32 index,
        uint64 currentOpen
    ) internal view returns (Trade memory, uint32 collateralPercentage) {
        collateralPercentage = uint32(action >> 152);

        uint120 collateralAmount = uint120(
            Math.mulDiv(
                IERC20(asset()).balanceOf(address(this)),
                collateralPercentage,
                BIP
            )
        );

        if (collateralAmount > IERC20(asset()).balanceOf(address(this)))
            revert InsufficientBalance();

        return (
            Trade({
                user: address(this),
                index: index,
                pairIndex: uint16(action >> 220),
                leverage: uint24(action >> 196),
                long: (action & (1 << 195)) != 0,
                isOpen: (action & (1 << 194)) != 0,
                collateralIndex: uint8(action >> 186),
                tradeType: TradeType(uint8((action >> 184) & 0x3)),
                collateralAmount: collateralAmount,
                openPrice: uint64(
                    Math.mulDiv(currentOpen, uint32(action >> 120), BIP)
                ),
                tp: uint64(Math.mulDiv(currentOpen, uint32(action >> 88), BIP)),
                sl: uint64(Math.mulDiv(currentOpen, uint32(action >> 56), BIP)),
                __placeholder: 0
            }),
            collateralPercentage
        );
    }

    function totalAssets() public view override returns (uint256) {
        uint256 collateralAmount = 0;
        if (GainsNetwork.getTrades(address(this)).length != 0) {
            if (totalValueCollateral.get() == 0) revert NeedCallback();
            collateralAmount = totalValueCollateral.get() - 1;
        }

        return super.totalAssets() + collateralAmount;
    }

    function _adjustForDecimals(
        uint256 x,
        uint256 currentDecimals,
        uint256 desiredDecimals
    ) internal pure returns (uint256) {
        if (desiredDecimals < currentDecimals) {
            uint256 decimalDifference = currentDecimals - desiredDecimals;
            x = x / (10 ** decimalDifference);
        } else {
            uint256 decimalDifference = desiredDecimals - currentDecimals;
            x = x * (10 ** decimalDifference);
        }
        return x;
    }

    /**
     * @dev Returns the entry fee in basis points.
     * @return The entry fee percentage (80 = 0.8%).
     */
    function _entryFeeBasisPoints() internal pure override returns (uint256) {
        return ENTRY_FEE;
    }

    /**
     * @dev Returns the exit fee in basis points.
     * @return The exit fee percentage (80 = 0.8%).
     */
    function _exitFeeBasisPoints() internal pure override returns (uint256) {
        return EXIT_FEE;
    }

    /**
     * @dev Calculates the minimum fee for a vault action.
     * @return The minimum fee amount.
     */
    function _getMinFee() internal view override returns (uint256) {
        Trade[] memory trades = GainsNetwork.getTrades(address(this));
        if (trades.length == 0)
            return VaultFactory(vaultFactory).getVaultActionFee(asset()); // If there are no trades, make it not a max fee
        return VaultFactory(vaultFactory).getOracleFee(asset()); //If there are trades, make it the max fee
    }

    /**
     * @dev Determines if the fee recipient (vault manager) pays a reduced fee.
     * @return True if the recipient pays a reduced fee, false otherwise.
     */
    function _doesRecipientPayFee() internal view override returns (bool) {
        return totalValueCollateral.get() != 0;
    }

    /**
     * @dev Returns the recipients of the entry fee.
     * @return The addresses of the vault factory and vault manager.
     */
    function _entryFeeRecipient()
        internal
        view
        override
        returns (address, address)
    {
        return (vaultFactory, vaultManager);
    }

    /**
     * @dev Returns the recipients of the exit fee.
     * @return The addresses of the vault factory and vault manager.
     */
    function _exitFeeRecipient()
        internal
        view
        override
        returns (address, address)
    {
        return (vaultFactory, vaultManager);
    }

    /**
     * @notice Returns the sender of the current message
     * @dev This function overrides the _msgSender function from both Context and ContextUpgradeable
     * @return The address of the message sender
     * @dev If totalValueCollateral is not zero, it returns the currentUser, otherwise it returns msg.sender
     **/
    function _msgSender()
        internal
        view
        override(Context, ContextUpgradeable)
        returns (address)
    {
        return totalValueCollateral.get() != 0 ? currentUser.get() : msg.sender;
    }

    /**
     * @notice Returns the data of the current message
     * @dev This function overrides the _msgData function from both Context and ContextUpgradeable
     * @return The calldata of the message
     **/
    function _msgData()
        internal
        pure
        override(Context, ContextUpgradeable)
        returns (bytes calldata)
    {
        return msg.data;
    }

    /**
     * @notice Performs an internal deposit of assets
     * @dev This function mints shares to the vault maker based on the deposited assets
     * @param assets The amount of assets to deposit
     * @param receiver The address that will receive the minted shares
     **/
    function internalDeposit(uint256 assets, address receiver) internal {
        uint256 shares = previewDeposit(assets);
        _mint(receiver, shares);
        _lastMintTimestamp[receiver] = block.timestamp;
        emit Deposit(receiver, receiver, assets, shares);
    }

    /**
     * @dev  Pauses the contract.
     *
     * Requirements:
     *
     * - The contract must NOT be paused.
     * - Only the vault maker can call this.
     */
    function pause() external whenNotPaused onlyOwner {
        super._pause();
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     * - Only the vault maker can call this.
     */
    function unpause() external whenPaused onlyOwner {
        super._unpause();
    }

    /**
     * @dev Returns the owner of the vault.
     * @return The address of the vault manager.
     */
    function owner() public view returns (address) {
        return vaultManager;
    }

    /**
     * @dev Checks if the current time is within the withdraw period.
     * @notice This function is called internally before executing withdraw-related actions.
     */
    function _checkIfWithdrawPeriod() internal view {
        if (isWithdrawPeriod) return;
        if (nextWithdrawPeriod == 0) {
            revert NoWithdrawPeriodSet();
        }
        if (block.timestamp < nextWithdrawPeriod) {
            revert NotYetWithdrawPeriod(nextWithdrawPeriod - block.timestamp);
        }
        if (block.timestamp > withdrawPeriodLength + nextWithdrawPeriod) {
            revert PastWithdrawPeriod(
                block.timestamp - nextWithdrawPeriod - withdrawPeriodLength
            );
        }
    }

    /**
     * @dev Sets the next withdraw period. Can be called by any token holder.
     * @notice This function can only be called if there's no active withdraw period set.
     */
    function setWithdrawPeriod() external {
        if (this.balanceOf(msg.sender) == 0) {
            revert NotTokenHolder(msg.sender);
        }
        //If there is already a set withdraw period in the future, then revert

        if (block.timestamp <= nextWithdrawPeriod + withdrawPeriodLength) {
            revert WithdrawPeriodAlreadySet();
        }
        //If the withdraw period is in the past or 0, then we can set a new one
        nextWithdrawPeriod = block.timestamp + MIN_PERIOD_TIME;
        emit WithdrawPeriodSet(nextWithdrawPeriod);
    }

    /**
     * @dev Internal function to close all open positions during the withdraw period.
     * @param latestPrices An array of the latest prices for all open positions.
     */
    function closeAllPositions(uint256[] memory latestPrices) internal {
        emit WithdrawPeriodStarted();
        Trade[] memory trades = GainsNetwork.getTrades(address(this));
        if (trades.length == 0) return;
        uint256 tradeLength = trades.length;
        if (tradeLength != latestPrices.length - 2) {
            revert IncorrectTradeData(tradeLength, latestPrices.length);
        }

        for (uint i = 2; i < latestPrices.length; i++) {
            GainsNetwork.closeTradeMarket(
                trades[i - 2].index,
                uint64(_adjustForDecimals(latestPrices[i], DECIMAL_COUNT, 10))
            );

            indexToStrategy[trades[i - 2].index] = 0;
        }
        getAsset().safeTransfer(
            vaultFactory,
            VaultFactory(vaultFactory).getVaultActionFee(asset())
        );
    }

    /**
     * @dev Allows the vault manager to forcefully start a withdraw period.
     * @notice This function can only be called by the vault manager.
     */
    function forceWithdrawPeriod() external onlyOwner {
        if (isWithdrawPeriod) revert WithdrawPeriodAlreadyActive();
        isWithdrawPeriod = true;
        emit WithdrawPeriodTriggered();
    }

    /**
     * @dev Allows the vault manager to end the current withdraw period.
     * @notice This function can only be called by the vault manager.
     */
    function endWithdrawPeriod() external onlyOwner {
        if (!isWithdrawPeriod) revert WithdrawPeriodAlreadyEnded();
        isWithdrawPeriod = false;
        emit WithdrawPeriodEnded();
    }
}

//Fees
//The protocol will exist of 3 different fees
//Withdraw,Deposit, and Swap
//A 0.8% fee will be applied for withdraws and deposits with 1/2 going to the vault creator
//A 0.5% fee will be applied for swaps
//A fixed fee will be applied for strategy execution
//A fixed fee will be paid for the calling of info
//A public API fee
