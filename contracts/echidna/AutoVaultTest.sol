// SPDX-License-Identifier: BSL-1.1
pragma solidity ^0.8.24;

import "../AutoVault.sol";

contract AutoVaultInvariants is AutoVault {
    function echidna_shares_equal_total_supply() public view returns (bool) {
        return totalSupply() == 0;
    }

    // Add more invariant checks here
}
