// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Equation.sol";
import "solmate/src/utils/SSTORE2.sol";

contract Test {
    address public equationStorage;

    event EquationInitialized(address indexed storageAddress);

    function initializeEquation(uint256[] calldata _expressions) external {
        require(equationStorage == address(0), "Equation already initialized");
        bytes memory encodedTree = Equation.init(_expressions);
        address newStorage = SSTORE2.write(encodedTree);
        require(newStorage != address(0), "Equation initialization failed");
        equationStorage = newStorage;
        emit EquationInitialized(newStorage);
    }

    function calculate(uint256[] calldata xValue) external returns (uint256) {
        require(equationStorage != address(0), "Equation not initialized");
        bytes memory encodedTree = SSTORE2.read(equationStorage);
        return Equation.calculate(encodedTree, xValue);
    }

    function isInitialized() public view returns (bool) {
        return equationStorage != address(0);
    }
}
