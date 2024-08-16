// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;
//Claude basically wrote the upgrade
import "solmate/src/utils/SSTORE2.sol";

library Equation {
    uint8 constant OPCODE_CONST = 0; // 0, 30
    uint8 constant OPCODE_VAR = 1; // 1,2 it gives you the 3rd in the array (price,blockNumber,rsi)
    uint8 constant OPCODE_SQRT = 2;
    uint8 constant OPCODE_NOT = 3;
    uint8 constant OPCODE_ADD = 4;
    uint8 constant OPCODE_SUB = 5;
    uint8 constant OPCODE_MUL = 6;
    uint8 constant OPCODE_DIV = 7;
    uint8 constant OPCODE_EXP = 8;
    uint8 constant OPCODE_PCT = 9;
    uint8 constant OPCODE_EQ = 10; //equals
    uint8 constant OPCODE_NE = 11; //not equals
    uint8 constant OPCODE_LT = 12;
    uint8 constant OPCODE_GT = 13;
    uint8 constant OPCODE_LE = 14; //less than or equal to
    uint8 constant OPCODE_GE = 15; //greater than or equal to
    uint8 constant OPCODE_AND = 16; //takes two bools returns one bool
    uint8 constant OPCODE_OR = 17; //takes two bools return one bool
    uint8 constant OPCODE_IF = 18; // Takes one bool returns 2 potential outputs
    uint8 constant OPCODE_INVALID = 19;

    //if x2 < 50 then 100 else 0
    //(conditional) ?(return this) :(else this)
    //You can string together if statements, but else is the required end
    // 18, 14, 1,2, 0,50,0,100,18,
    function init(
        uint256[] calldata _expressions
    ) external pure returns (bytes memory) {
        require(
            _expressions.length > 0 && _expressions.length < 256,
            "Invalid expression length"
        );
        return encodeTree(_expressions);
    }

    function encodeTree(
        uint256[] calldata _expressions
    ) public pure returns (bytes memory) {
        bytes memory encoded = new bytes(_expressions.length * 33); // Max possible size
        uint256 encodedLength = 0;

        for (uint256 i = 0; i < _expressions.length; ) {
            uint8 opcode = uint8(_expressions[i]);
            require(opcode < OPCODE_INVALID, "Invalid opcode");
            encoded[encodedLength++] = bytes1(opcode);

            if (opcode == OPCODE_CONST || opcode == OPCODE_VAR) {
                require(
                    i + 1 < _expressions.length,
                    "Missing value for CONST or VAR"
                );
                uint256 value = _expressions[++i];
                for (uint8 j = 0; j < 32; j++) {
                    encoded[encodedLength++] = bytes1(
                        uint8(value >> (8 * (31 - j)))
                    );
                }
            }
            i++;
        }

        bytes memory result = new bytes(encodedLength);
        for (uint256 i = 0; i < encodedLength; i++) {
            result[i] = encoded[i];
        }
        return result;
    }

    function calculate(
        bytes memory encodedTree,
        uint256[] calldata xValue
    ) internal pure returns (uint256) {
        (uint256 result, ) = evaluateNode(encodedTree, 0, xValue);
        return result;
    }

    function evaluateNode(
        bytes memory encodedTree,
        uint256 startIndex,
        uint256[] calldata xValue
    ) private pure returns (uint256, uint256) {
        uint8 opcode = uint8(encodedTree[startIndex]);
        uint256 nextIndex = startIndex + 1;

        if (opcode == OPCODE_CONST) {
            return (decodeUint256(encodedTree, nextIndex), nextIndex + 32);
        }
        if (opcode == OPCODE_VAR) {
            uint256 varIndex = decodeUint256(encodedTree, nextIndex);
            require(varIndex < xValue.length, "Invalid variable index");
            return (xValue[varIndex], nextIndex + 32);
        }
        uint256 a;
        uint256 b;
        (a, nextIndex) = evaluateNode(encodedTree, nextIndex, xValue);
        if (opcode == OPCODE_SQRT) return (sqrt(a), nextIndex);
        if (opcode == OPCODE_NOT) return (a == 0 ? 1 : 0, nextIndex);

        (b, nextIndex) = evaluateNode(encodedTree, nextIndex, xValue);
        if (opcode == OPCODE_ADD) return (a + b, nextIndex);
        if (opcode == OPCODE_SUB) return (a - b, nextIndex);
        if (opcode == OPCODE_MUL) return (a * b, nextIndex);
        if (opcode == OPCODE_DIV) return (a / b, nextIndex);
        if (opcode == OPCODE_EXP) return (power(a, b), nextIndex);
        if (opcode == OPCODE_PCT) return ((a * b) / 1e18, nextIndex);
        if (opcode == OPCODE_EQ) return (a == b ? 1 : 0, nextIndex);
        if (opcode == OPCODE_NE) return (a != b ? 1 : 0, nextIndex);
        if (opcode == OPCODE_LT) return (a < b ? 1 : 0, nextIndex);
        if (opcode == OPCODE_GT) return (a > b ? 1 : 0, nextIndex);
        if (opcode == OPCODE_LE) return (a <= b ? 1 : 0, nextIndex);
        if (opcode == OPCODE_GE) return (a >= b ? 1 : 0, nextIndex);
        if (opcode == OPCODE_AND)
            return ((a != 0 && b != 0) ? 1 : 0, nextIndex);
        if (opcode == OPCODE_OR) return ((a != 0 || b != 0) ? 1 : 0, nextIndex);

        if (opcode == OPCODE_IF) {
            uint256 c;
            (c, nextIndex) = evaluateNode(encodedTree, nextIndex, xValue);
            return (a != 0 ? b : c, nextIndex);
        }

        revert("Invalid opcode");
    }

    function decodeUint256(
        bytes memory data,
        uint256 startIndex
    ) private pure returns (uint256) {
        require(startIndex + 32 <= data.length, "Out of bounds");
        uint256 value;
        assembly {
            value := mload(add(add(data, 0x20), startIndex))
        }
        return value;
    }

    function sqrt(uint256 x) private pure returns (uint256 y) {
        if (x == 0) return 0;
        else if (x <= 3) return 1;
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function power(
        uint256 base,
        uint256 exponent
    ) private pure returns (uint256) {
        if (exponent == 0) return 1;
        uint256 result = 1;
        while (exponent > 0) {
            if (exponent % 2 == 1) result *= base;
            base *= base;
            exponent /= 2;
        }
        return result;
    }
}
