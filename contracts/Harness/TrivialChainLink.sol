// SPDX-License-Identifier:  BSL-1.1
contract TrivialChainLink {
    function transferAndCall(
        address a,
        uint256 b,
        bytes memory c
    ) external returns (bool success) {
        // do nothing
        return true;
    }
}
