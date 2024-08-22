// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./IGainsNetwork.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

contract FakeGainsNetwork is IGainsNetwork {
    IERC20 USDC = IERC20(0x4cC7EbEeD5EA3adf3978F19833d2E1f3e8980cD6);

    mapping(address => Trade[]) public userToTrades;

    event UpdateOpenOrderCalled(
        uint32 index,
        uint64 triggerPrice,
        uint64 tp,
        uint64 sl,
        uint16 maxSlippageP
    );
    event GetCountersCalled(address trader, CounterType counterType);
    event OpenTradeCalled(Trade trade, uint16 maxSlippageP, address refferer);
    event UpdateSlCalled(uint32 index, uint64 newSl);
    event UpdateTpCalled(uint32 index, uint64 newTp);
    event CancelOpenOrderCalled(uint32 index);
    event CloseTradeMarketCalled(uint32 index);
    event CloseTradeMarketTimeoutCalled(Id orderId);
    event DecreasePositionSizeCalled(
        uint32 index,
        uint120 collateralDelta,
        uint24 leverageDelta
    );
    event IncreasePositionSizeCalled(
        uint32 index,
        uint120 collateralDelta,
        uint24 leverageDelta,
        uint64 expectedPrice,
        uint16 maxSlippageP
    );
    event UpdateLeverageCalled(uint32 index, uint24 newLeverage);
    event GetTradeInfosCalled(address trader);
    event GetTradesCalled(address trader);

    function updateOpenOrder(
        uint32 _index,
        uint64 _triggerPrice,
        uint64 _tp,
        uint64 _sl,
        uint16 _maxSlippageP
    ) external override {
        emit UpdateOpenOrderCalled(
            _index,
            _triggerPrice,
            _tp,
            _sl,
            _maxSlippageP
        );
    }

    function getCounters(
        address _trader,
        CounterType _type
    ) external view override returns (Counter memory) {
        return Counter(0, 0, 0);
    }

    function getPnlPercent(
        uint64 _openPrice,
        uint64 _currentPrice,
        bool _long,
        uint24 _leverage
    ) external pure returns (int256) {
        require(_openPrice > 0, "Open price must be greater than zero");
        require(_currentPrice > 0, "Current price must be greater than zero");
        require(_leverage > 0, "Leverage must be greater than zero");

        int256 priceDifference;
        if (_long) {
            priceDifference =
                int256(int64(_currentPrice)) -
                int256(int64(_openPrice));
        } else {
            priceDifference =
                int256(int64(_openPrice)) -
                int256(int64(_currentPrice));
        }

        // Calculate the percentage change
        int256 percentageChange = (priceDifference * 1e18) /
            int256(int64(_openPrice));

        // Apply leverage
        int256 leveragedPercentageChange = (percentageChange *
            int256(int24(_leverage))) / 1e18;

        return leveragedPercentageChange;
    }

    function openTrade(
        Trade memory _trade,
        uint16 _maxSlippageP,
        address _refferer
    ) external override {
        userToTrades[msg.sender].push(_trade);

        if (_trade.collateralIndex == 3) {
            USDC.transferFrom(
                msg.sender,
                address(this),
                _trade.collateralAmount
            );
        }
        emit OpenTradeCalled(_trade, _maxSlippageP, _refferer);
    }

    function updateSl(uint32 _index, uint64 _newSl) external override {
        console.log("HOW IS THIS CALLING THAT");

        emit UpdateSlCalled(_index, _newSl);
    }

    function updateTp(uint32 _index, uint64 _newTp) external override {
        console.log("Hi");
        emit UpdateTpCalled(_index, _newTp);
    }

    function cancelOpenOrder(uint32 _index) external override {
        Trade[] storage trades = userToTrades[msg.sender];

        for (uint i = 0; i < trades.length; i++) {
            uint32 tradeIndex = trades[i].index;
            if (tradeIndex == _index) {
                if (trades[i].collateralIndex == 3) {
                    USDC.transfer(msg.sender, trades[i].collateralAmount);
                }
                trades[i] = trades[trades.length - 1];
                trades.pop();
                break;
            }
        }

        emit CancelOpenOrderCalled(_index);
    }

    function closeTradeMarket(
        uint32 _index,
        uint64 expectedPrice
    ) external override {
        Trade[] storage trades = userToTrades[msg.sender];
        for (uint i = 0; i < trades.length; i++) {
            uint32 tradeIndex = trades[i].index;
            if (tradeIndex == _index) {
                if (trades[i].collateralIndex == 3) {
                    USDC.transfer(msg.sender, trades[i].collateralAmount);
                }
                trades[i] = trades[trades.length - 1];
                trades.pop();
                break;
            }
        }
        emit CloseTradeMarketCalled(_index);
    }

    function closeTradeMarketTimeout(Id memory _orderId) external override {
        emit CloseTradeMarketTimeoutCalled(_orderId);
    }

    function decreasePositionSize(
        uint32 _index,
        uint120 _collateralDelta,
        uint24 _leverageDelta,
        uint64 _expectedPrice
    ) external override {
        Trade[] storage trades = userToTrades[msg.sender];

        for (uint i = 0; i < trades.length; i++) {
            uint32 tradeIndex = trades[i].index;
            if (tradeIndex == _index) {
                trades[i].collateralAmount -= _collateralDelta;
                trades[i].leverage -= _leverageDelta;
                if (trades[i].collateralIndex == 3) {
                    USDC.transfer(msg.sender, _collateralDelta);
                }
            }
        }
        emit DecreasePositionSizeCalled(
            _index,
            _collateralDelta,
            _leverageDelta
        );
    }

    function increasePositionSize(
        uint32 _index,
        uint120 _collateralDelta,
        uint24 _leverageDelta,
        uint64 _expectedPrice,
        uint16 _maxSlippageP
    ) external override {
        emit IncreasePositionSizeCalled(
            _index,
            _collateralDelta,
            _leverageDelta,
            _expectedPrice,
            _maxSlippageP
        );
    }

    function updateLeverage(
        uint32 _index,
        uint24 _newLeverage
    ) external override {
        emit UpdateLeverageCalled(_index, _newLeverage);
    }

    function getTradeInfos(
        address _trader
    ) external view override returns (TradeInfo[] memory) {
        return new TradeInfo[](0);
    }

    function getTrades(
        address _trader
    ) external view override returns (Trade[] memory) {
        return userToTrades[_trader];
    }

    function getTrade(
        address _trader,
        uint32 _index
    ) public view override returns (Trade memory) {
        Trade[] memory trades = userToTrades[_trader];
        for (uint i = 0; i < trades.length; i++) {
            if (trades[i].index == _index) return trades[i];
        }
    }

    function getTradeBorrowingFee(
        BorrowingFeeInput calldata _input
    ) external view returns (uint256 feeAmountCollateral) {}
}

// curl -i --location --request POST 'https://xpzyihmcunwwykjpfdgy.supabase.co/functions/v1/rsi-price-query' \
// --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwenlpaG1jdW53d3lranBmZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0MjU3ODIsImV4cCI6MjAzODAwMTc4Mn0.mgu_pc2fGZgAQPSlMTY_FPLcsIvepIZb3geDXA7au-0' \
// --header 'Content-Type: application/json' \
// --data '{"symbol": 0, "period": 14}'
