// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
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
struct BorrowingFeeInput {
    uint8 collateralIndex;
    address trader;
    uint16 pairIndex;
    uint32 index;
    bool long;
    uint256 collateral;
    uint256 leverage;
}
struct Pair {
    string from;
    string to;
    Feed feed;
    uint256 spreadP;
    uint256 groupIndex;
    uint256 feeIndex;
}
struct Group {
    string name;
    bytes32 job;
    uint256 minLeverage;
    uint256 maxLeverage;
}
struct Fee {
    string name;
    uint256 openFeeP;
    uint256 closeFeeP;
    uint256 oracleFeeP;
    uint256 triggerOrderFeeP;
    uint256 minPositionSizeUsd;
}
struct Feed {
    address feed1;
    address feed2;
    FeedCalculation feedCalculation;
    uint256 maxDeviationP;
}
enum FeedCalculation {
    DEFAULT,
    INVERT,
    COMBINE
}
struct TraderInfo {
    uint32 lastDayUpdated;
    uint224 trailingPoints;
}
struct FeeTier {
    uint32 feeMultiplier;
    uint32 pointsThreshold;
}
struct BorrowingData {
    uint32 feePerBlock;
    uint64 accFeeLong;
    uint64 accFeeShort;
    uint48 accLastUpdatedBlock;
    uint48 feeExponent;
}
struct BorrowingPairGroup {
    uint16 groupIndex;
    uint48 block;
    uint64 initialAccFeeLong;
    uint64 initialAccFeeShort;
    uint64 prevGroupAccFeeLong;
    uint64 prevGroupAccFeeShort;
    uint64 pairAccFeeLong;
    uint64 pairAccFeeShort;
    uint64 __placeholder;
}
struct OpenInterest {
    uint72 long;
    uint72 short;
    uint72 max;
    uint40 __placeholder;
}
struct BorrowingInitialAccFees {
    uint64 accPairFee;
    uint64 accGroupFee;
    uint48 block;
    uint80 __placeholder;
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

interface ICoolGains {
    function getTrades(address _trader) external view returns (Trade[] memory);

    function getTradeInfos(
        address _trader
    ) external view returns (TradeInfo[] memory);

    function getTradeBorrowingFee(
        BorrowingFeeInput memory _input
    ) external view returns (uint256 feeAmountCollateral);

    function pairsBackend(
        uint256 _index
    )
        external
        view
        returns (Pair memory pair, Group memory group, Fee memory fee);

    function fees(uint256 _index) external view returns (Fee memory);

    function getAllBorrowingPairs(
        uint8 _collateralIndex
    )
        external
        view
        returns (
            BorrowingData[] memory borrowData,
            OpenInterest[] memory oi,
            BorrowingPairGroup[][] memory bPG
        );

    function getBorrowingGroups(
        uint8 _collateralIndex,
        uint16[] memory _indices
    ) external view returns (BorrowingData[] memory, OpenInterest[] memory);

    function pairs(uint256 _index) external view returns (Pair memory);

    function pairMinFeeUsd(uint256 _pairIndex) external view returns (uint256);

    function getBorrowingInitialAccFees(
        uint8 _collateralIndex,
        address _trader,
        uint32 _index
    ) external view returns (BorrowingInitialAccFees memory);

    // GNSBorrowingFees
    // 0x9186752a0Cf07Ae093AAfE1A1b7E4bdD530D49e6
    // getBorrowingpair
    function getBorrowingPair(
        uint8 _collateralIndex,
        uint16 _pairIndex
    ) external view returns (BorrowingData memory);

    // getBorrowingPairOi
    function getBorrowingPairOi(
        uint8 _collateralIndex,
        uint16 _pairIndex
    ) external view returns (OpenInterest memory);

    // getBorrowingPariGroups
    function getBorrowingPairGroups(
        uint8 _collateralIndex,
        uint16 _pairIndex
    ) external view returns (BorrowingPairGroup[] memory);

    // getBorrowingPairPendingAccFees
    function getBorrowingPairPendingAccFees(
        uint8 _collateralIndex,
        uint16 _pairIndex,
        uint256 _currentBlock
    )
        external
        view
        returns (uint64 accFeeLong, uint64 accFeeShort, uint64 pairAccFeeDelta);

    // getPairMaxOi
    function getPairMaxOi(
        uint8 _collateralIndex,
        uint16 _pairIndex
    ) external view returns (uint256);

    // getPairMaxOiCollateral
    function getPairMaxOiCollateral(
        uint8 _collateralIndex,
        uint16 _pairIndex
    ) external view returns (uint256);

    function calculateFeeAmount(
        address _trader,
        uint256 _normalFeeAmountCollateral
    ) external view returns (uint256);

    function getFeeTier(
        uint256 _feeTierIndex
    ) external view returns (FeeTier memory);

    function getFeeTiersCount() external view returns (uint256);

    function getFeeTiersTraderInfo(
        address _trader
    ) external view returns (TraderInfo memory);
}
