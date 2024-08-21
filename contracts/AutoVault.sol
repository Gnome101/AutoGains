// SPDX-License-Identifier: BSL-1.1
pragma solidity ^0.8.24;

import "./Libraries/Equation.sol";
import "solmate/src/utils/SSTORE2.sol";
import "./Interfaces/ERC4626Fees.sol";

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import {Trade, TradeType, Counter, CounterType, IGainsNetwork} from "./Gains Contracts/IGainsNetwork.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import "./Libraries/TransientPrimities.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./VaultFactory.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract AutoVault is ERC4626Fees, ChainlinkClient, Pausable {
    using Chainlink for Chainlink.Request;
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20Metadata;
    using Math for uint120;
    using Strings for uint256;
    enum Choice {
        DEPOSIT,
        MINT,
        WITHDRAW,
        REDEEM
    }

    struct VaultAction {
        address msgSender;
        address receiver;
        uint256 amount;
        Choice choice;
        uint256 slippage;
    }
    modifier onlyFactory() {
        if (msg.sender != vaultFactory) revert FactoryManagerOnly();
        _;
    }
    error vaultManagerOnly();

    modifier onlyOwner() {
        if (msg.sender != vaultManager) revert vaultManagerOnly();
        _;
    }

    mapping(bytes32 => uint256) public requestToStrategy;
    mapping(uint256 => uint32) public strategyToIndex;
    mapping(uint32 => uint256) public indexToStrategy;
    mapping(uint256 => uint256) public indexToPercentPosition;
    mapping(bytes32 => VaultAction) public requestToAction;

    address[] public strategies;
    IGainsNetwork public GainsNetwork;
    uint256 private fee;
    address public specialRefer = 0xB46838207D4CDc3b0F6d8862b8F0d29fee938051;
    address public vaultManager;
    address private vaultFactory;

    uint256 public constant ENTRY_FEE = 80; //0.5% fee
    uint256 public constant EXIT_FEE = 80; //

    tuint256 public totalValueCollateral;
    taddress public currentUser;
    tuint256Array public tArray;

    error InvalidAction();
    error NoAction();
    error InsufficientBalance();
    error NeedCallback();
    error Slippage();
    error CoolDownViolated();
    error StrategyNotActive();
    error StrategyAlreadyActive();

    error TimeStampDifferenceTooLarge(uint256 timeStampDifference);
    error FactoryManagerOnly();

    Chainlink.Request public balanceRequest; // This request returns the totalBalance of alltrades on GNS

    uint256 public constant MAX_TIME_DIFFERENCE = 20;

    //The cooldown period exists to prevent reselling the tokens
    uint256 private constant COOLDOWN_PERIOD = 60;
    mapping(address => uint256) private _lastMintTimestamp;
    uint256 public constant SWAP_FEE = 2_000; // 0.2% swap fee

    uint256 public oracleFee; // Around 87 cents
    uint256 public vaultActionFee; // Around 4 cents
    uint256 public tradeFee; //Around 23 cents
    //A vault can have only active trades at a time
    mapping(bytes32 => RewardInfo) public rewardBot;

    struct StartInfo {
        address factoryOwner;
        address vaultManager;
        address chainLinkToken;
        address oracleAddress;
        address gainsAddress;
    }

    function returnStrategies() public view returns (address[] memory) {
        return strategies;
    }

    function initialize(
        IERC20Metadata __asset,
        Chainlink.Request memory _req,
        uint256 startingBalance,
        StartInfo memory startingInfo,
        uint256[2] memory startingFee,
        string memory _name,
        string memory _symbol,
        address[] memory _equations
    ) public initializer {
        _asset = __asset;
        __ERC4626_init(_asset);
        __ERC20_init(_name, _symbol);

        strategies = _equations;
        GainsNetwork = IGainsNetwork(startingInfo.gainsAddress);
        vaultManager = startingInfo.vaultManager;

        vaultFactory = msg.sender;
        specialRefer = startingInfo.factoryOwner;
        internalDeposit(startingBalance, startingInfo.vaultManager);
        oracleFee = startingFee[0];
        vaultActionFee = startingFee[1];
        // tradeFee = startingFee[2];
        balanceRequest = _req;
        _asset.approve(startingInfo.gainsAddress, type(uint256).max);
    }

    string public constant trade_path = "totalnewCollateral;blockTimestamp";
    string public saveDataBefore;

    function getPublicDataBef() public view returns (string memory) {
        return saveDataBefore;
    }

    function startAction(
        address receiver,
        uint256 amount,
        Choice choice,
        uint256 slippage
    ) external returns (bytes32 requestId) {
        string memory path = trade_path;
        Trade[] memory trades = GainsNetwork.getTrades(address(this));

        for (uint i = 0; i < trades.length; i++) {
            path = string.concat(path, ";latestPrices,");
            path = string.concat(path, i.toString());
        }
        for (uint i = 0; i < trades.length; i++) {
            path = string.concat(path, ";newCollateralArray,");
            path = string.concat(path, i.toString());
        }
        saveDataBefore = path;
        Chainlink.Request memory req = balanceRequest;
        req._add("path", path);
        requestId = VaultFactory(vaultFactory).sendInfoRequest(
            msg.sender,
            req,
            fee
        );
        requestToAction[requestId] = VaultAction(
            msg.sender,
            receiver,
            amount,
            choice,
            slippage
        );
        // We have to pause the contract here,
        // because a trade could be opened in between
        //start and preform action
    }

    event ApprovalExtended(address indexed msgSender);

    function extendApproval() public {
        _asset.approve(address(GainsNetwork), type(uint256).max);
        emit ApprovalExtended(msg.sender);
    }

    uint256[] public saveData;

    function getPublicData() public view returns (uint256[] memory) {
        return saveData;
    }

    function preformAction(
        bytes32 requestId,
        uint256[] memory data
    ) public onlyFactory {
        //just saving the data works
        //probably an error with the processing
        saveData = data;
        VaultAction memory vaultAction = requestToAction[requestId];
        currentUser.set(vaultAction.msgSender);
        data[0] = _adjustForDecimals(data[0], 18, _asset.decimals());

        totalValueCollateral.set(data[0] > 0 ? data[0] + 1 : 1);
        for (uint i = 2; i < data.length; i++) {
            tArray.push(data[i]);
        }
        // saveData.push(block.number);
        if ((data[1] / (10 ** 18)) + MAX_TIME_DIFFERENCE < block.timestamp) {
            revert TimeStampDifferenceTooLarge(
                block.timestamp - data[1] / (10 ** 18)
            );
        }
        uint256 result;
        if (vaultAction.choice == Choice.DEPOSIT) {
            result = this.deposit(vaultAction.amount, vaultAction.receiver);
            console.log("slip", vaultAction.slippage, result);
            if (vaultAction.slippage > result) revert Slippage();
        } else if (vaultAction.choice == Choice.MINT) {
            result = this.mint(vaultAction.amount, vaultAction.receiver);
            console.log("slip", vaultAction.slippage, result);

            if (vaultAction.slippage < result) revert Slippage();
        } else if (vaultAction.choice == Choice.WITHDRAW) {
            result = this.withdraw(
                vaultAction.amount,
                vaultAction.receiver,
                _msgSender()
            );
            console.log("slip", vaultAction.slippage, result);

            if (vaultAction.slippage > result) revert Slippage();
        } else if (vaultAction.choice == Choice.REDEEM) {
            result = this.redeem(
                vaultAction.amount,
                vaultAction.receiver,
                _msgSender()
            );
            console.log("slip", vaultAction.slippage, result);

            if (vaultAction.slippage < result) revert Slippage();
        } else {
            revert InvalidAction();
        }
        saveData.push(vaultAction.slippage);
        saveData.push(result);
        totalValueCollateral.set(0);
        currentUser.set(address(0));
    }

    //This is what has to be called before a strategy
    struct RewardInfo {
        // uint256 oracleFee;
        // uint256 factoryFee;
        // uint256 botFee;
        uint256 masterFee; //oracleFee goes to oracle, 1/3 of oracleFee to caller, rest goes to vaultFactory
        uint256 feeMultiplier;
        address caller;
    }

    function executeStrategy(
        uint256 strategy
    ) external whenNotPaused returns (bytes32 requestId) {
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
                oracleFee * 2,
                feeMultiplier,
                1_000_000,
                Math.Rounding.Ceil
            ), // Public API Fee comes out to same as oracleFee
            feeMultiplier: feeMultiplier,
            caller: msg.sender
        });
    }

    event OracleFeeSet(address indexed sender, uint256 indexed amount);

    function setOracleFee(uint256 amount) public onlyOwner {
        oracleFee = amount;
        emit OracleFeeSet(msg.sender, amount);
    }

    // uint256 callerFeeShare = 3; // Can not be 0;
    uint256[] public c;

    function getC() public view returns (uint256[] memory) {
        return c;
    }

    function fulfill(
        bytes32 requestId,
        uint256[] calldata data
    ) public whenNotPaused onlyFactory {
        // console.log(data.leWngth);
        if ((data[1] / (10 ** 18)) + MAX_TIME_DIFFERENCE < block.timestamp) {
            revert TimeStampDifferenceTooLarge(
                block.timestamp - data[1] / (10 ** 18)
            );
        }

        uint256 strategy = requestToStrategy[requestId];
        uint256 action = processStrategy(strategy, data);
        // c.push(action);
        // c.push(data[0]);
        // c.push(data[1]);
        // c.push(data[2]);
        // c.push(uint64(data[0] / (10 ** 8)));

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

        //Send half of the oracle fee to the rewardBot
        // console.log(rewardInfo.caller, oracleFee / 3);
        _asset.safeTransfer(rewardInfo.caller, oracleFee / 3);

        //Send the oracleFee to oracle (We don't do this since we are pre-paying)
        //_asset.safeTransfer(oracleAddress, oracleFee);

        //Send the remaining balance to the vaultFactory
        _asset.safeTransfer(vaultFactory, rewardInfo.masterFee - oracleFee / 3);
    }

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

    function applySwapFee(
        uint256 totalCollateralAmount,
        uint256 feeMultiplier
    ) internal returns (uint120 swapFee) {
        swapFee = uint120(
            Math.mulDiv(
                totalCollateralAmount,
                SWAP_FEE,
                1_000_000,
                Math.Rounding.Ceil
            )
        );
        swapFee = uint120(
            Math.mulDiv(swapFee, feeMultiplier, 1_000_000, Math.Rounding.Ceil)
        );

        _asset.transfer(vaultFactory, swapFee);
    }

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
            // c.push(uint16(action >> 236));
            // c.push(trade.index);
            // c.push(trade.pairIndex);
            // c.push(trade.long ? 1 : 0);
            // c.push(trade.isOpen ? 1 : 0);
            // c.push(trade.collateralAmount);
            // c.push(trade.collateralIndex);
            // c.push(uint256(trade.tradeType));
            // c.push(trade.openPrice);
            // c.push(trade.tp);
            // c.push(trade.sl);

            GainsNetwork.openTrade(trade, uint16(action >> 236), specialRefer);
            indexToStrategy[index] = strategy + 1;
            strategyToIndex[strategy] = index + 1;
        } else if (actionType == 1) {
            GainsNetwork.updateSl(
                index,
                uint64(Math.mulDiv(openPrice, uint32(action >> 220), 1_000_000))
            );
        } else if (actionType == 2) {
            GainsNetwork.updateTp(
                index,
                uint64(Math.mulDiv(openPrice, uint32(action >> 220), 1_000_000))
            );
        } else if (actionType == 3) {
            GainsNetwork.updateOpenOrder(
                index,
                uint64(
                    Math.mulDiv(openPrice, uint32(action >> 204), 1_000_000)
                ),
                uint64(
                    Math.mulDiv(openPrice, uint32(action >> 172), 1_000_000)
                ),
                uint64(
                    Math.mulDiv(openPrice, uint32(action >> 140), 1_000_000)
                ),
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
                        1_000_000
                    )
                ),
                uint24(action >> 196),
                uint64(Math.mulDiv(openPrice, uint32(action >> 164), 1_000_000))
            );
        } else if (actionType == 8) {
            Trade memory trade = GainsNetwork.getTrade(address(this), index);
            // c.push(index);
            // c.push(
            //     uint120(
            //         Math.mulDiv(
            //             trade.collateralAmount,
            //             uint32(action >> 204),
            //             1_000_000
            //         )
            //     )
            // );
            // c.push(uint24(action >> 180));
            // c.push(
            //     uint64(Math.mulDiv(openPrice, uint32(action >> 148), 1_000_000))
            // );
            // c.push(uint16(action >> 236));
            // [ 0n, 3112883n, 2000n, 584959900000000n, 10000n ]

            GainsNetwork.increasePositionSize(
                index,
                uint120(
                    Math.mulDiv(
                        trade.collateralAmount,
                        uint32(action >> 204),
                        1_000_000
                    )
                ),
                uint24(action >> 180),
                uint64(
                    Math.mulDiv(openPrice, uint32(action >> 148), 1_000_000)
                ),
                uint16(action >> 236)
            );
        }
    }

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
                1_000_000
            )
        );

        if (collateralAmount >= IERC20(asset()).balanceOf(address(this)))
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
                    Math.mulDiv(currentOpen, uint32(action >> 120), 1_000_000)
                ),
                tp: uint64(
                    Math.mulDiv(currentOpen, uint32(action >> 88), 1_000_000)
                ),
                sl: uint64(
                    Math.mulDiv(currentOpen, uint32(action >> 56), 1_000_000)
                ),
                __placeholder: 0
            }),
            collateralPercentage
        );
    }

    function totalAssets() public override returns (uint256) {
        uint256 collateralAmount = 0;
        if (GainsNetwork.getTrades(address(this)).length != 0) {
            if (totalValueCollateral.get() == 0) revert NeedCallback();
            collateralAmount = totalValueCollateral.get() - 1;
        }
        return super.totalAssets() + collateralAmount;
    }

    function _beforeTransfer(address from, address to) internal view override {
        if (_lastMintTimestamp[from] + COOLDOWN_PERIOD > block.timestamp) {
            revert CoolDownViolated();
        }
    }

    error IncorrectTradeData(uint256, uint256);

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

    uint256 public constant closeTolerance = 1_100_000;

    //A higher tolerance means that its more likely to close a position
    function beforeWithdraw(
        address user,
        uint256 assetsWithdrawn
    ) internal override {
        //This is to prevent arbitrage
        if (_lastMintTimestamp[user] + COOLDOWN_PERIOD > block.timestamp) {
            revert CoolDownViolated();
        }

        Trade[] memory trades = GainsNetwork.getTrades(address(this));
        if (trades.length == 0) return;
        uint256 tradeLength = trades.length;
        if (tradeLength * 2 != tArray.length()) {
            revert IncorrectTradeData(tradeLength, tArray.length());
        }

        uint256 _totalAssets = this.totalAssets();
        uint256 assetDecimals = this.decimals();

        for (uint i = 0; i < tradeLength; i++) {
            uint120 collateralToWithdraw = uint120(
                Math.mulDiv(
                    assetsWithdrawn,
                    trades[i].collateralAmount,
                    _totalAssets
                )
            );
            saveData.push(
                uint64(_adjustForDecimals(tArray.get(i), 18, assetDecimals))
            );
            saveData.push(collateralToWithdraw);
            saveData.push(
                uint64(
                    _adjustForDecimals(
                        tArray.get(i + tradeLength),
                        18,
                        assetDecimals
                    )
                )
            );
            saveData.push(trades[i].collateralAmount);

            if (
                uint64(
                    _adjustForDecimals(
                        tArray.get(i + tradeLength),
                        18,
                        assetDecimals
                    )
                ) <= collateralToWithdraw.mulDiv(closeTolerance, 1_000_000)
            ) {
                GainsNetwork.closeTradeMarket(
                    trades[i].index,
                    uint64(_adjustForDecimals(tArray.get(i), 18, 10))
                );
                indexToStrategy[trades[i].index] = 0;
                //When we close a position, we need to update that strategy
            } else {
                GainsNetwork.decreasePositionSize(
                    trades[i].index, //Trade Index
                    collateralToWithdraw, //COLLATERAL DELTA
                    0, //LEVERAGE DELTA
                    uint64(_adjustForDecimals(tArray.get(i), 18, 10)) // EXPECTED PRICE GOES HERE
                );
            }
        }
    }

    function afterDeposit(
        address user,
        uint256 /*amountDeposited*/
    ) internal override {}

    function _entryFeeBasisPoints() internal pure override returns (uint256) {
        return ENTRY_FEE;
    }

    function _exitFeeBasisPoints() internal pure override returns (uint256) {
        return EXIT_FEE;
    }

    function _getMinFee() internal view override returns (uint256) {
        //Trade[] memory trades = GainsNetwork.getTrades(address(this));
        return vaultActionFee; //+ tradeFee * trades.length;
    }

    function _doesRecipientPayFee() internal view override returns (bool) {
        return totalValueCollateral.get() != 0;
    }

    function _entryFeeRecipient()
        internal
        view
        override
        returns (address, address)
    {
        return (vaultFactory, vaultManager);
    }

    function _exitFeeRecipient()
        internal
        view
        override
        returns (address, address)
    {
        return (vaultFactory, vaultManager);
    }

    function _msgSender() internal view override returns (address) {
        return totalValueCollateral.get() != 0 ? currentUser.get() : msg.sender;
    }

    function internalDeposit(uint256 assets, address receiver) internal {
        uint256 shares = previewDeposit(assets);
        _mint(receiver, shares);
        _lastMintTimestamp[receiver] = block.timestamp;
        emit Deposit(receiver, receiver, assets, shares);
    }

    function pause() external whenNotPaused onlyOwner {
        super._pause();
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function unpause() external whenPaused onlyOwner {
        super._unpause();
    }

    //Fees
    //The protocol will exist of 3 different fees
    //Withdraw,Deposit, and Swap
    //A 0.8% fee will be applied for withdraws and deposits with 1/2 going to the vault creator
    //A 0.5% fee will be applied for swaps
    //A fixed fee will be applied for strategy execution
    //A fixed fee will be paid for the calling of info
    //A public API fee

    function owner() public view returns (address) {
        return vaultManager;
    }
}
