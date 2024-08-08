methods {
    function AutoVault.executeAction(uint32 index,
        uint64 openPrice,
        uint256 action,
        uint256 strategy) internal =>NONDET;

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