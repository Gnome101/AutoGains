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

contract AutoVault is ERC4626Fees, ChainlinkClient, ConfirmedOwnerWithProposal {
    using Chainlink for Chainlink.Request;

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
    IGainsNetwork private GainsNetwork;
    uint256 private fee;
    address public specialRefer;
    address private vaultManager;
    address private vaultFactory;

    uint256 private constant ENTRY_FEE = 0;
    uint256 private constant EXIT_FEE = 0;

    tuint256 public totalValueCollateral;
    taddress public currentUser;

    error InvalidAction();
    error InsufficientBalance();
    error NeedCallback();
    error Slippage();

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
    function initialize(
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
    ) public initializer {
        _asset = __asset;
        __ERC4626_init(_asset);
        __ERC20_init(_name, _symbol);
        __ChainlinkClient_init(_vaultManager, address(0));
        _setChainlinkToken(_chainLinkToken);
        _setChainlinkOracle(_oracleAddress);
        strategies = _equations;
        GainsNetwork = IGainsNetwork(_gainsAddy);
        _asset.approve(_gainsAddy, type(uint256).max);
        vaultManager = _vaultManager;
        internalDeposit(startingBalance, _vaultManager);
        vaultFactory = msg.sender;
        specialRefer = factoryOwner;
        fee = 0;
    }

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

    function startAction(
        address receiver,
        uint256 amount,
        Choice choice,
        uint256 slippage
    ) external returns (bytes32 requestId) {
        Chainlink.Request memory req = _buildChainlinkRequest(
            bytes32("a8356f48569c434eaa4ac5fcb4db5cc0"),
            address(this),
            this.preformAction.selector
        );
        requestId = _sendChainlinkRequest(req, fee);
        requestToAction[requestId] = VaultAction(
            msg.sender,
            receiver,
            amount,
            choice,
            slippage
        );
    }

    function preformAction(
        bytes32 requestId,
        uint256 _collateralValue
    ) external recordChainlinkFulfillment(requestId) {
        VaultAction memory vaultAction = requestToAction[requestId];
        currentUser.set(vaultAction.msgSender);
        totalValueCollateral.set(
            _collateralValue > 0 ? _collateralValue + 1 : 1
        );

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

        if (vaultAction.slippage > result) revert Slippage();

        totalValueCollateral.set(0);
        currentUser.set(address(0));
    }

    function executeStrategy(
        uint256 strategy
    ) external returns (bytes32 requestId) {
        Chainlink.Request memory req = _buildChainlinkRequest(
            bytes32("a8356f48569c434eaa4ac5fcb4db5cc0"),
            address(this),
            this.fulfill.selector
        );
        requestId = _sendChainlinkRequest(req, fee);
        requestToStrategy[requestId] = strategy;
    }

    function fulfill(
        bytes32 requestId,
        uint256[] calldata data
    ) public recordChainlinkFulfillment(requestId) {
        uint256 strategy = requestToStrategy[requestId];
        uint256 action = processStrategy(strategy, data);
        if (action == 0) revert InvalidAction();

        uint32 index = strategyToIndex[strategy];
        if (index == 0) {
            Counter memory counter = GainsNetwork.getCounters(
                address(this),
                CounterType(0)
            );
            index = counter.currentIndex;
        }

        executeAction(index, uint64(data[0]), action, strategy);
    }

    function processStrategy(
        uint256 strategy,
        uint256[] calldata inputs
    ) public view returns (uint256 action) {
        (, bytes memory encodedTree) = abi.decode(
            SSTORE2.read(strategies[strategy]),
            (Chainlink.Request, bytes)
        );
        return Equation.calculate(encodedTree, inputs);
    }

    function executeAction(
        uint32 index,
        uint64 openPrice,
        uint256 action,
        uint256 strategy
    ) internal {
        uint256 actionType = uint8(action >> 252);
        if (actionType != 0) require(strategyToActive[strategy], "Not Active");

        if (actionType == 0) {
            (Trade memory trade, uint32 posPercent) = extractTrade(
                action,
                index,
                openPrice
            );
            indexToPercentPosition[index] = posPercent;
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
        uint32 collateralPercentage = uint32(action >> 152);
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

    function beforeWithdraw(uint256 assetsWithdrawn) internal override {
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

    function _entryFeeBasisPoints() internal pure override returns (uint256) {
        return ENTRY_FEE;
    }

    function _exitFeeBasisPoints() internal pure override returns (uint256) {
        return EXIT_FEE;
    }

    function _entryFeeRecipient() internal view override returns (address) {
        return vaultFactory;
    }

    function _exitFeeRecipient() internal view override returns (address) {
        return vaultFactory;
    }

    function _msgSender() internal view override returns (address) {
        return totalValueCollateral.get() != 0 ? currentUser.get() : msg.sender;
    }

    function internalDeposit(uint256 assets, address receiver) internal {
        uint256 shares = previewDeposit(assets);
        _mint(receiver, shares);
        emit Deposit(receiver, receiver, assets, shares);
    }
}
