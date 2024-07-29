// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";
import "./Equation.sol";

contract Test {
    using Equation for Equation.Node[];

    Equation.Node[] public equationNodes;

    /// @notice Initialize the equation with a given list of expressions
    /// @param _expressions The list of expressions in prefix order
    function initializeEquation(uint256[] calldata _expressions) external {
        equationNodes.init(_expressions);
    }

    /// @notice Calculate the output for the given x value
    /// @param xValue The input value for the variable x
    /// @return The calculated result based on the equation
    function calculate(uint256 xValue) external view returns (uint256) {
        return equationNodes.calculate(xValue);
    }

    /// @notice Checks if the equation is initialized
    /// @return True if initialized, false otherwise
    function isInitialized() external view returns (bool) {
        return equationNodes.length > 0;
    }
}
