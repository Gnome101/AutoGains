// SPDX-License-Identifier: BSL-1.1
pragma solidity ^0.8.24;

// Enums
/**
 * @dev Enum representing the possible actions for vault operations.
 * Used in startAction and performAction to determine the operation type.
 */
enum Choice {
    DEPOSIT,
    MINT,
    WITHDRAW_PERIOD
}

// Structs
/**
 * @dev Struct to store information about a vault action initiated by a user.
 * This information is saved during startAction and used in performAction.
 */
struct VaultAction {
    address msgSender; // Address of the user initiating the action
    address receiver; // Address to receive tokens or shares
    uint256 amount; // Amount of tokens or shares for the action
    Choice choice; // Type of action to perform
    uint256 slippage; // Allowed slippage for the action
}

/**
 * @dev Structure to hold initial information for vault setup.
 */
struct StartInfo {
    address factoryOwner;
    address vaultManager;
    address chainLinkToken;
    address oracleAddress;
    address gainsAddress;
}

/**
 * @dev Struct to store reward information for strategy execution.
 */
struct RewardInfo {
    uint256 masterFee;
    uint256 feeMultiplier;
    address caller;
}
