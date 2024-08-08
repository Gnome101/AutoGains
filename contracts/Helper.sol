// SPDX-License-Identifier: MIT

import "./Gains Contracts/IGainsNetwork.sol";
pragma solidity ^0.8.24;

contract Helper {
    function createOpenTradeAction(
        uint16 maxSlippage,
        uint16 pairIndex,
        uint24 leverage,
        bool long,
        bool isOpen,
        uint8 collateralIndex,
        TradeType tradeType,
        uint32 collateralPercentage,
        uint32 openPrice,
        uint32 tp,
        uint32 sl
    ) public pure returns (uint256) {
        uint256 action = 0;
        action |= uint256(0) << 252; // Action type 0
        action |= uint256(maxSlippage) << 236;
        action |= uint256(pairIndex) << 220;
        action |= uint256(leverage) << 196;
        action |= uint256(long ? 1 : 0) << 195;
        action |= uint256(isOpen ? 1 : 0) << 194;
        action |= uint256(collateralIndex) << 186;
        action |= uint256(tradeType) << 184;
        action |= uint256(collateralPercentage) << 152;
        action |= uint256(openPrice) << 120;
        action |= uint256(tp) << 88;
        action |= uint256(sl) << 56;
        return action;
    }

    function createUpdateSLAction(uint32 sl) public pure returns (uint256) {
        uint256 action = 0;
        action |= uint256(1) << 252; // Action type 1
        action |= uint256(sl) << 220;
        return action;
    }

    function createUpdateTPAction(uint32 tp) public pure returns (uint256) {
        uint256 action = 0;
        action |= uint256(2) << 252; // Action type 2
        action |= uint256(tp) << 220;
        return action;
    }

    function createUpdateOpenOrderAction(
        uint16 maxSlippage,
        uint32 triggerPrice,
        uint32 tp,
        uint32 sl
    ) public pure returns (uint256) {
        uint256 action = 0;
        action |= uint256(3) << 252; // Action type 3
        action |= uint256(maxSlippage) << 236;
        action |= uint256(triggerPrice) << 204;
        action |= uint256(tp) << 172;
        action |= uint256(sl) << 140;
        return action;
    }

    function createCancelOpenOrderAction() public pure returns (uint256) {
        return uint256(4) << 252; // Action type 4
    }

    function createCloseTradeMarketAction() public pure returns (uint256) {
        return uint256(5) << 252; // Action type 5
    }

    function createUpdateLeverageAction(
        uint24 leverage
    ) public pure returns (uint256) {
        uint256 action = 0;
        action |= uint256(6) << 252; // Action type 6
        action |= uint256(leverage) << 228;
        return action;
    }

    function createDecreasePositionSizeAction(
        uint32 collateralDelta,
        uint24 leverage
    ) public pure returns (uint256) {
        uint256 action = 0;
        action |= uint256(7) << 252; // Action type 7
        action |= uint256(collateralDelta) << 220;
        action |= uint256(leverage) << 196;
        return action;
    }

    function createIncreasePositionSizeAction(
        uint16 maxSlippage,
        uint32 collateralDelta,
        uint24 leverage,
        uint32 expectedPrice
    ) public pure returns (uint256) {
        uint256 action = 0;
        action |= uint256(8) << 252; // Action type 8
        action |= uint256(maxSlippage) << 236;
        action |= uint256(collateralDelta) << 204;
        action |= uint256(leverage) << 180;
        action |= uint256(expectedPrice) << 148;
        return action;
    }
}
