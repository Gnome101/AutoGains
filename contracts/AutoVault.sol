// SPDX-License-Identifier: BSL-1.1
pragma solidity ^0.8.24;

import "./Libraries/Equation.sol";
import "solmate/src/utils/SSTORE2.sol";
import "./Interfaces/ERC4626Fees.sol";

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "./Chainlink/ConfirmedOwnerWithProposal.sol";
import {Trade, TradeType, Counter, CounterType, IGainsNetwork} from "./Gains Contracts/IGainsNetwork.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import "./Libraries/TransientPrimities.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract AutoVault is
    ERC4626Fees,
    ChainlinkClient,
    ConfirmedOwnerWithProposal,
    Pausable
{
    using Chainlink for Chainlink.Request;
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20Metadata;

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

    mapping(bytes32 => uint256) public requestToStrategy;
    mapping(uint256 => uint32) public strategyToIndex;
    mapping(uint256 => bool) public strategyToActive;
    mapping(uint256 => uint256) public indexToPercentPosition;
    mapping(bytes32 => VaultAction) public requestToAction;

    address[] public strategies;
    IGainsNetwork public GainsNetwork;
    uint256 private fee;
    address public specialRefer = 0xB46838207D4CDc3b0F6d8862b8F0d29fee938051;
    address private vaultManager;
    address private vaultFactory;

    uint256 private constant ENTRY_FEE = 80; //0.5% fee
    uint256 private constant EXIT_FEE = 80; //

    tuint256 public totalValueCollateral;
    taddress public currentUser;

    error InvalidAction();
    error NoAction();
    error InsufficientBalance();
    error NeedCallback();
    error Slippage();
    error CoolDownViolated();
    error StrategyNotActive();
    error BlockDifferenceTooLarge(uint256 blockDifference);

    Chainlink.Request public balanceRequest; // This request returns the totalBalance of alltrades on GNS

    uint256 public constant MAX_BLOCK_DIFFERENCE = 20;

    //The cooldown period exists to prevent reselling the tokens
    uint256 private constant COOLDOWN_PERIOD = 60;
    mapping(address => uint256) private _lastMintTimestamp;
    uint256 public constant SWAP_FEE = 2_000; // 0.2% swap fee

    // constructor(
    //     IERC20 _asset,
    //     uint256 startingBalance,
    //     address factoryOwner,
    //     address _vaultManager,
    //     string memory _name,
    //     string memory _symbol,
    //     address[] memory _equations,
    //     address _chainLinkToken,
    //     address _oracleAddress,
    //     address _gainsAddy
    // ) ERC4626(_asset) ERC20(_name, _symbol) ConfirmedOwner(_vaultManager) {
    //     _setChainlinkToken(_chainLinkToken);
    //     _setChainlinkOracle(_oracleAddress);
    //     strategies = _equations;
    //     GainsNetwork = IGainsNetwork(_gainsAddy);
    //     _asset.approve(_gainsAddy, type(uint256).max);
    //     vaultManager = _vaultManager;
    //     internalDeposit(startingBalance, _vaultManager);
    //     vaultFactory = msg.sender;
    //     specialRefer = factoryOwner;
    //     fee = 0;
    // }
    struct StartInfo {
        address factoryOwner;
        address vaultManager;
        address chainLinkToken;
        address oracleAddress;
        address gainsAddress;
    }

    function initialize(
        IERC20Metadata __asset,
        Chainlink.Request memory _req,
        uint256 startingBalance,
        StartInfo memory startingInfo,
        uint256 startingFee,
        string memory _name,
        string memory _symbol,
        address[] memory _equations
    ) public initializer {
        console.log(" 1 Stargin balance", startingBalance);

        _asset = __asset;
        __ERC4626_init(_asset);
        __ERC20_init(_name, _symbol);
        __ChainlinkClient_init(startingInfo.vaultManager, address(0));
        _setChainlinkToken(startingInfo.chainLinkToken);
        _setChainlinkOracle(startingInfo.oracleAddress);
        strategies = _equations;
        GainsNetwork = IGainsNetwork(startingInfo.gainsAddress);
        vaultManager = startingInfo.vaultManager;
        vaultFactory = msg.sender;
        specialRefer = startingInfo.factoryOwner;
        console.log(" 2 Stargin balance", startingBalance);
        internalDeposit(startingBalance, startingInfo.vaultManager);
        oracleFee = startingFee;
        balanceRequest = _req;
        _asset.approve(startingInfo.gainsAddress, type(uint256).max);
    }

    function startAction(
        address receiver,
        uint256 amount,
        Choice choice,
        uint256 slippage
    ) external returns (bytes32 requestId) {
        requestId = _sendChainlinkRequest(balanceRequest, fee);
        requestToAction[requestId] = VaultAction(
            msg.sender,
            receiver,
            amount,
            choice,
            slippage
        );
    }

    event ApprovalExtended(address indexed msgSender);

    function extendApproval() public {
        _asset.approve(address(GainsNetwork), type(uint256).max);
        emit ApprovalExtended(msg.sender);
    }

    function preformAction(
        bytes32 requestId,
        uint256[] memory data
    ) external recordChainlinkFulfillment(requestId) {
        VaultAction memory vaultAction = requestToAction[requestId];
        currentUser.set(vaultAction.msgSender);
        console.log("Setting var below", data[0]);
        if (_asset.decimals() < 10) {
            uint256 decimalDifference = 10 - _asset.decimals();
            data[0] = data[0] / (10 ** decimalDifference);
        } else {
            uint256 decimalDifference = _asset.decimals() - 10;
            data[0] = data[0] * (10 ** decimalDifference);
        }
        totalValueCollateral.set(data[0] > 0 ? data[0] + 1 : 1);

        if ((data[1] / (10 ** 10)) + MAX_BLOCK_DIFFERENCE < block.number) {
            revert BlockDifferenceTooLarge(block.number - data[1] / (10 ** 10));
        }
        uint256 result;
        console.log("Choice", uint256(vaultAction.choice));
        if (vaultAction.choice == Choice.DEPOSIT) {
            console.log("Choice is to deposit");
            result = this.deposit(vaultAction.amount, vaultAction.receiver);
        } else if (vaultAction.choice == Choice.MINT) {
            result = this.mint(vaultAction.amount, vaultAction.receiver);
        } else if (vaultAction.choice == Choice.WITHDRAW) {
            result = this.withdraw(
                vaultAction.amount,
                vaultAction.receiver,
                _msgSender()
            );
        } else if (vaultAction.choice == Choice.REDEEM) {
            result = this.redeem(
                vaultAction.amount,
                vaultAction.receiver,
                _msgSender()
            );
        } else {
            revert InvalidAction();
        }
        console.log(vaultAction.slippage, result);
        if (vaultAction.slippage > result) revert Slippage();

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
    uint256 public oracleFee;
    mapping(bytes32 => RewardInfo) public rewardBot;

    function executeStrategy(
        uint256 strategy
    ) external whenNotPaused returns (bytes32 requestId) {
        (uint256 feeMultiplier, Chainlink.Request memory req, ) = abi.decode(
            SSTORE2.read(strategies[strategy]),
            (uint256, Chainlink.Request, bytes)
        );

        requestId = _sendChainlinkRequest(req, fee);

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
    ) public whenNotPaused recordChainlinkFulfillment(requestId) {
        // console.log(data.leWngth);
        if ((data[1] / (10 ** 10)) + MAX_BLOCK_DIFFERENCE < block.number) {
            revert BlockDifferenceTooLarge(block.number - data[1] / (10 ** 10));
        }
        uint256 strategy = requestToStrategy[requestId];
        uint256 action = processStrategy(strategy, data);
        // c.push(action);
        // c.push(data[0]);
        // c.push(data[1]);
        // c.push(data.length);
        // if (action == 0) revert NoAction();

        uint32 index = strategyToIndex[strategy];
        if (index == 0) {
            Counter memory counter = GainsNetwork.getCounters(
                address(this),
                CounterType(0)
            );
            index = counter.currentIndex;
        }
        RewardInfo memory rewardInfo = rewardBot[requestId];

        executeAction(
            index,
            uint64(data[0]),
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
        if (actionType != 0 && !strategyToActive[strategy]) {
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
            strategyToActive[strategy] = true;
            strategyToIndex[strategy] = index;
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
            strategyToActive[strategy] = false;
        } else if (actionType == 5) {
            GainsNetwork.closeTradeMarket(index);
            strategyToActive[strategy] = false;
        } else if (actionType == 6) {
            GainsNetwork.updateLeverage(index, uint24(action >> 228));
        } else if (actionType == 7) {
            GainsNetwork.decreasePositionSize(
                index,
                uint32(action >> 220),
                uint24(action >> 196)
            );
        } else if (actionType == 8) {
            GainsNetwork.increasePositionSize(
                index,
                uint32(action >> 204),
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

    function beforeWithdraw(
        address user,
        uint256 assetsWithdrawn
    ) internal override {
        //This is to prevent arbitrage
        console.log(
            _lastMintTimestamp[user],
            block.timestamp + COOLDOWN_PERIOD
        );
        if (_lastMintTimestamp[user] + COOLDOWN_PERIOD > block.timestamp) {
            revert CoolDownViolated();
        }

        Trade[] memory trades = GainsNetwork.getTrades(address(this));
        uint256 _totalAssets = this.totalAssets();
        uint256 totalValueOfTrades = _totalAssets -
            IERC20(asset()).balanceOf(address(this));

        for (uint i = 0; i < trades.length; i++) {
            uint120 collateralToWithdraw = uint120(
                Math.mulDiv(
                    assetsWithdrawn,
                    trades[i].collateralAmount,
                    _totalAssets
                )
            );
            GainsNetwork.decreasePositionSize(
                trades[i].index,
                collateralToWithdraw,
                0
            );
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
        return oracleFee;
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
}
