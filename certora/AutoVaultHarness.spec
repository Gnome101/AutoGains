methods {
    function _.executeAction(uint32 index,
        uint64 openPrice,
        uint256 action,
        uint256 strategy) internal =>NONDET;

    function _.mulDiv(uint144 a, uint256 b, uint256 c) internal => CVLMulDiv(a, b, c) expect uint256;
    
    function startAction(address receiver, uint256 amount, AutoVault.Choice choice, uint256 slippage) external;
    function _.transferAndCall(address, uint256, bytes) external => DISPATCHER(true);
}

rule allowance_increase_auth {

    env e;
    method f;
    calldataarg args;
    address owner;
    address spender;

    require getNumba(e) == 0;
    require getAddy(e) == 0;

    mathint allowance_before = allowance(e, owner, spender);
    f(e, args);
    mathint allowance_after = allowance(e, owner, spender);
    
    assert allowance_after > allowance_before => e.msg.sender == owner;
}

rule integrity_of_lock {
    env e;
    method f;
    calldataarg args;
    address user;

    uint256 numTradesBefore = getTrades(e).length;
    uint256 collateralValueBefore = getNumba(e);
    require collateralValueBefore == 0;
    address currentUserBefore = getAddy(e);
    require currentUserBefore == 0;
    mathint balBefore = assetBalanceOfVault(e);

    f@withrevert(e, args);
    bool reverted = lastReverted;

    uint256 numTradesAfter = getTrades(e).length;
    uint256 collateralValueAfter = getNumba(e);
    address currentUserAfter = getAddy(e);
    mathint balAfter = assetBalanceOfVault(e);

    // Case 1: No active trades
     if (numTradesBefore == 0) {
        // Allow any state changes
        assert true;
    }
    // Case 2: Active trades before the call
    else {
        // If the balance changed and it didn't revert, it must be startAction or preformAction
        assert (balBefore != balAfter && !reverted) => 
            (f.selector == sig:startAction(address,uint256,AutoVault.Choice,uint256).selector ||
             f.selector == sig:preformAction(bytes32,uint256).selector);
        
        // If collateralValue changed, it must be preformAction
        assert (collateralValueBefore != collateralValueAfter) => 
            f.selector == sig:preformAction(bytes32,uint256).selector;
    }

    // Ensure currentUser is only set during startAction or callback
    // assert currentUserBefore == 0 && currentUserAfter != 0 =>
    //     f.selector == sig:startAction(address,uint256,AutoVault.Choice,uint256).selector ||
    //     f.selector == sig:preformAction(bytes32,uint256).selector;

    // // Ensure collateralValue is only set during callback
    // assert collateralValueBefore == 0 && collateralValueAfter != 0 =>
    //     f.selector == sig:preformAction(bytes32,uint256).selector;
}

function CVLMulDiv(uint144 a, uint256 b, uint256 c) returns uint256 {
    mathint result = (a * b) / c; 
    require result <= max_uint144;
    return assert_uint256(result); 
}