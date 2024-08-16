// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
enum TradeType {
    TRADE,
    LIMIT,
    STOP
}
struct Trade {
    address user;
    uint32 index;
    uint16 pairIndex;
    uint24 leverage;
    bool long;
    bool isOpen;
    uint8 collateralIndex;
    TradeType tradeType;
    uint120 collateralAmount;
    uint64 openPrice;
    uint64 tp;
    uint64 sl;
    uint192 __placeholder;
}
struct Id {
    address user;
    uint32 index;
}
struct TradeInfo {
    uint32 createdBlock;
    uint32 tpLastUpdatedBlock;
    uint32 slLastUpdatedBlock;
    uint16 maxSlippageP;
    uint48 lastOiUpdateTs;
    uint48 collateralPriceUsd;
    uint48 __placeholder;
}
struct Counter {
    uint32 currentIndex;
    uint32 openCount;
    uint192 __placeholder;
}
enum CounterType {
    TRADE,
    PENDING_ORDER
}
struct BorrowingFeeInput {
    uint8 collateralIndex;
    address trader;
    uint16 pairIndex;
    uint32 index;
    bool long;
    uint256 collateral;
    uint256 leverage;
}

interface IGainsNetwork {
    function getTradeBorrowingFee(
        BorrowingFeeInput calldata _input
    ) external view returns (uint256 feeAmountCollateral);

    function getPnlPercent(
        uint64 _openPrice,
        uint64 _currentPrice,
        bool _long,
        uint24 _leverage
    ) external pure returns (int256);

    function updateOpenOrder(
        uint32 _index,
        uint64 _triggerPrice,
        uint64 _tp,
        uint64 _sl,
        uint16 _maxSlippageP
    ) external;

    function getCounters(
        address _trader,
        CounterType _type
    ) external view returns (Counter memory);

    function openTrade(
        Trade memory,
        uint16 maxSlippageP,
        address refferer
    ) external;

    function updateSl(uint32 _index, uint64 _newSl) external;

    function updateTp(uint32 _index, uint64 _newTp) external;

    function cancelOpenOrder(uint32 _index) external;

    function closeTradeMarket(uint32 _index, uint64 _expectedPrice) external;

    function closeTradeMarketTimeout(Id memory _orderId) external;

    function getTrade(
        address _trader,
        uint32 _index
    ) external view returns (Trade memory);

    function decreasePositionSize(
        uint32 _index,
        uint120 _collateralDelta,
        uint24 _leverageDelta,
        uint64 _expectedPrice
    ) external;

    function increasePositionSize(
        uint32 _index,
        uint120 _collateralDelta,
        uint24 _leverageDelta,
        uint64 _expectedPrice,
        uint16 _maxSlippageP
    ) external;

    function updateLeverage(uint32 _index, uint24 _newLeverage) external;

    function getTradeInfos(
        address _trader
    ) external view returns (TradeInfo[] memory);

    function getTrades(address _trader) external view returns (Trade[] memory);
}
