import { BigNumberish } from "ethers";
import {
  AutoVault,
  ERC20,
  FakeGainsNetwork,
  Helper,
  IGainsNetwork,
  VaultFactory,
} from "../typechain-types";
import { Decimal } from "decimal.js";
const decimals = new Decimal(10).pow(18);

export async function getStrategies(Helper: Helper): Promise<BigNumberish[][]> {
  const longAction = await Helper.createOpenTradeAction(
    10000, // maxSlippage
    0, // pairIndex (BTC)
    5000, // leverage (5x)
    true, // long
    true, // isOpen
    3, // collateralType (USDC)
    0, // orderType (Market)
    200000, // collateralPercent (2%)
    1000000, // openPricePercent
    1200000, // takeProfitPercent
    800000 // stopLossPercent
  );

  const updateSLAction = await Helper.createUpdateSLAction(850000);

  const updateTpAction = await Helper.createUpdateTPAction(1500000);

  // const updateOpenOrderAction = await Helper.createUpdateOpenOrderAction() only for open orders
  const closeAction = await Helper.createCloseTradeMarketAction();

  const updateLeverageAction = await Helper.createUpdateLeverageAction(12000);

  const decreasePositionAction = await Helper.createDecreasePositionSizeAction(
    400000,
    0,
    1000000
  );
  const increasePositionSize = await Helper.createIncreasePositionSizeAction(
    10000,
    100000,
    1000,
    1000000
  );
  const strategy1 = getStrategy(longAction, updateSLAction, updateTpAction);
  const strategy2 = getStrategy(longAction, updateLeverageAction, closeAction);
  const strategy3 = getStrategy(
    longAction,
    decreasePositionAction,
    increasePositionSize
  );
  const limitOrder = await Helper.createOpenTradeAction(
    10000, // maxSlippage
    0, // pairIndex (BTC)
    5000, // leverage (5x)
    true, // long
    true, // isOpen
    3, // collateralType (USDC)
    1, // orderType (Market)
    220000, // collateralPercent (2%)
    900000, // openPricePercent
    1200000, // takeProfitPercent
    800000 // stopLossPercent
  );
  const updateLimitOrder = await Helper.createUpdateOpenOrderAction(
    2000,
    950000,
    1200000,
    850000
  );

  const cancelOpenOrder = await Helper.createCancelOpenOrderAction();
  const strategy4 = getStrategy(limitOrder, updateLimitOrder, cancelOpenOrder);

  return [strategy1, strategy2, strategy3, strategy4];
}

function getStrategy(
  action1: BigNumberish,
  action2: BigNumberish,
  action3: BigNumberish
): BigNumberish[] {
  const strategy = [
    18, //if
    14, // less
    1, //rsi
    2,
    0, //30
    new Decimal(35).mul(decimals).toFixed(),
    0,
    action1,
    18,
    15,
    1,
    2,
    0,
    new Decimal(75).mul(decimals).toFixed(),
    0,
    action2,
    18,
    10,
    1,
    2,
    0,
    new Decimal(50).mul(decimals).toFixed(),
    0,
    action3,
    0,
    0,
  ];
  return strategy;
}
