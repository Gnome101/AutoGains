import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
//@ts-ignore
import { ethers, deployments, userConfig, network } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  AutoVault,
  AutoVaultHarness,
  ERC20,
  FakeGainsNetwork,
  Helper,
  IGainsNetwork,
  VaultFactory,
} from "../typechain-types";
import { Deployment } from "hardhat-deploy/dist/types";
import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object
import { impersonateOracleFulfill } from "../utils/AutoGains";
import { erc20 } from "../typechain-types/@openzeppelin/contracts/token";
import { Decimal } from "decimal.js";
import dotenv from "dotenv";
import { TradeStruct } from "../typechain-types/contracts/Gains Contracts/IGainsNetwork";
import { trace } from "console";
import { toDecimal } from "./vault-test";
dotenv.config();

describe("Action Tests ", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let autoVaultHarness: AutoVaultHarness;
  let Helper: Helper;
  let USDC: ERC20;
  let vaultAmount: Decimal;
  let FakeGainsNetwork: FakeGainsNetwork;
  const SWAP_FEE = new Decimal(2_000);
  const SWAP_FEE_SCALE = new Decimal(1_000_000);

  beforeEach(async () => {
    const chainID = network.config.chainId;
    if (chainID == undefined) throw "Cannot find chainID";

    accounts = (await ethers.getSigners()) as unknown as SignerWithAddress[]; // could also do with getNamedAccounts
    user = accounts[0];

    if (chainID == 31337) {
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"],
      });
      user = await ethers.getSigner(
        "0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"
      ); //Test account with money
    }

    await deployments.fixture(["Test"]);
    const helperContract = (await deployments.get("Helper")) as Deployment;

    Helper = (await ethers.getContractAt(
      "Helper",
      helperContract.address.toString(),
      user
    )) as unknown as Helper;

    const vaultContract = (await deployments.get(
      "AutoVaultHarness"
    )) as Deployment;

    autoVaultHarness = (await ethers.getContractAt(
      "AutoVaultHarness",
      vaultContract.address.toString(),
      user
    )) as unknown as AutoVaultHarness;

    const fakeGainsContract = (await deployments.get(
      "FakeGainsNetwork"
    )) as Deployment;

    FakeGainsNetwork = (await ethers.getContractAt(
      "FakeGainsNetwork",
      fakeGainsContract.address.toString(),
      user
    )) as unknown as FakeGainsNetwork;

    USDC = (await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
      contracts[chainID].USDC,
      user
    )) as unknown as ERC20;
    vaultAmount = await getAmount(USDC, "100");
    await USDC.transfer(autoVaultHarness.target, vaultAmount.toFixed());
  });
  it("can extract a long trade ", async () => {
    const setIndex = 0;
    const pairIndex = 0;
    const long = true;
    const isOpen = true;
    const leverage = 5000;
    const collateralType = 3;
    const orderType = 0;
    const collateralPercent = new Decimal(200000);
    const openPricePercent = new Decimal(10000000);
    const takeProfitPercent = new Decimal(12000000);
    const stopLossPercent = new Decimal(8000000);

    const longAciton = await Helper.createOpenTradeAction(
      1000,
      pairIndex,
      leverage,
      long,
      isOpen,
      collateralType,
      orderType,
      collateralPercent.toFixed(), // Should be 2%
      openPricePercent.toFixed(),
      takeProfitPercent.toFixed(),
      stopLossPercent.toFixed()
    );

    const x = new Decimal(10).pow(10);
    const currentPrice = new Decimal(60).mul(x);
    console.log("FWA");

    const trade = (
      await autoVaultHarness.call_extractTrade(
        longAciton,
        0,
        currentPrice.toFixed()
      )
    )[0] as TradeStruct;

    console.log(trade.user);
    console.log("FWA");

    const totalAssets = await USDC.balanceOf(autoVaultHarness.target);
    console.log("FWA");
    assert.equal(autoVaultHarness.target, trade.user);
    assert.equal(0, trade.index);
    assert.equal(pairIndex, trade.pairIndex);
    assert.equal(leverage, trade.leverage);
    assert.equal(long, trade.long);
    assert.equal(isOpen, trade.isOpen);
    assert.equal(collateralType, trade.collateralIndex);
    assert.equal(orderType, trade.tradeType);
    console.log("Here", collateralPercent, totalAssets, trade.collateralAmount);
    assert.equal(
      collateralPercent
        .mul(totalAssets.toString())
        .dividedBy("1000000")
        .toFixed(),
      trade.collateralAmount
    );
    assert.equal(
      openPricePercent
        .mul(currentPrice.toString())
        .dividedBy("1000000")
        .toFixed(),
      trade.openPrice
    );
    assert.equal(
      takeProfitPercent
        .mul(currentPrice.toString())
        .dividedBy("1000000")
        .toFixed(),
      trade.tp
    );
    assert.equal(
      stopLossPercent
        .mul(currentPrice.toString())
        .dividedBy("1000000")
        .toFixed(),
      trade.sl
    );
  });
  it("can execute a long trade ", async () => {
    const maxSlippage = 1000;
    const pairIndex = 0;
    const long = true;
    const isOpen = true;
    const leverage = 5000;
    const collateralType = 3;
    const orderType = 0;
    const collateralPercent = new Decimal(200000);
    const openPricePercent = new Decimal(10000000);
    const takeProfitPercent = new Decimal(12000000);
    const stopLossPercent = new Decimal(8000000);

    const longAciton = await Helper.createOpenTradeAction(
      maxSlippage,
      pairIndex,
      leverage,
      long,
      isOpen,
      collateralType,
      orderType,
      collateralPercent.toFixed(), // Should be 2%
      openPricePercent.toFixed(),
      takeProfitPercent.toFixed(),
      stopLossPercent.toFixed()
    );

    const x = new Decimal(10).pow(10);
    const currentPrice = new Decimal(60).mul(x);
    const call = autoVaultHarness.call_executeAction(
      0,
      currentPrice.toFixed(),
      SWAP_FEE_SCALE.toFixed(),
      longAciton,
      0
    );
    const totalAssets = toDecimal(
      await USDC.balanceOf(autoVaultHarness.target)
    );

    const swapFee = totalAssets
      .mul(SWAP_FEE)
      .dividedBy(SWAP_FEE_SCALE) as Decimal;

    const expectedTrade = [
      autoVaultHarness.target.toString(),
      "0",
      pairIndex.toString(),
      leverage,
      long,
      isOpen,
      collateralType,
      orderType,
      collateralPercent
        .mul(totalAssets.sub(swapFee))
        .dividedBy("1000000")
        .toFixed(),
      openPricePercent
        .mul(currentPrice.toString())
        .dividedBy("1000000")
        .toFixed(),
      takeProfitPercent
        .mul(currentPrice.toString())
        .dividedBy("1000000")
        .toFixed(),
      stopLossPercent
        .mul(currentPrice.toString())
        .dividedBy("1000000")
        .toFixed(),
      0,
    ];

    await expect(call)
      .to.emit(FakeGainsNetwork, "OpenTradeCalled")
      .withArgs(
        expectedTrade,
        maxSlippage,
        await autoVaultHarness.specialRefer()
      );
  });
  describe("Active Positions ", function () {
    let collateralAmount: Decimal;
    this.beforeEach(async () => {
      const maxSlippage = 1000;
      const pairIndex = 0;
      const long = true;
      const isOpen = true;
      const leverage = 5000;
      const collateralType = 3;
      const orderType = 0;
      const collateralPercent = new Decimal(200000);
      const openPricePercent = new Decimal(10000000);
      const takeProfitPercent = new Decimal(12000000);
      const stopLossPercent = new Decimal(8000000);

      const longAciton = await Helper.createOpenTradeAction(
        maxSlippage,
        pairIndex,
        leverage,
        long,
        isOpen,
        collateralType,
        orderType,
        collateralPercent.toFixed(), // Should be 2%
        openPricePercent.toFixed(),
        takeProfitPercent.toFixed(),
        stopLossPercent.toFixed()
      );

      const x = new Decimal(10).pow(10);
      const currentPrice = new Decimal(60).mul(x);
      const call = autoVaultHarness.call_executeAction(
        0,
        currentPrice.toFixed(),
        SWAP_FEE_SCALE.toFixed(),
        longAciton,
        0
      );
      const totalAssets = toDecimal(
        await USDC.balanceOf(autoVaultHarness.target)
      );

      const swapFee = totalAssets
        .mul(SWAP_FEE)
        .dividedBy(SWAP_FEE_SCALE) as Decimal;
      collateralAmount = collateralPercent
        .mul(totalAssets.sub(swapFee))
        .dividedBy("1000000");
      const expectedTrade = [
        autoVaultHarness.target.toString(),
        "0",
        pairIndex.toString(),
        leverage,
        long,
        isOpen,
        collateralType,
        orderType,
        collateralAmount.toFixed(),
        openPricePercent
          .mul(currentPrice.toString())
          .dividedBy("1000000")
          .toFixed(),
        takeProfitPercent
          .mul(currentPrice.toString())
          .dividedBy("1000000")
          .toFixed(),
        stopLossPercent
          .mul(currentPrice.toString())
          .dividedBy("1000000")
          .toFixed(),
        0,
      ];

      await expect(call)
        .to.emit(FakeGainsNetwork, "OpenTradeCalled")
        .withArgs(
          expectedTrade,
          maxSlippage,
          await autoVaultHarness.specialRefer()
        );
    });
    it("can execute an update stop loss action ", async () => {
      const newStopLoss = 8500000; // 85% of current price
      const updateSlAction = await Helper.createUpdateSLAction(newStopLoss);

      const x = new Decimal(10).pow(10);
      const currentPrice = new Decimal(60).mul(x);
      const call = autoVaultHarness.call_executeAction(
        0,
        currentPrice.toFixed(),
        SWAP_FEE_SCALE.toFixed(),
        updateSlAction,
        0
      );

      const expectedStopLoss = new Decimal(newStopLoss)
        .mul(currentPrice.toString())
        .dividedBy("1000000")
        .toFixed();

      await expect(call)
        .to.emit(FakeGainsNetwork, "UpdateSlCalled")
        .withArgs(0, expectedStopLoss);
    });
    it("can execute an update take profit action ", async () => {
      const newTakeProfit = 11500000; // 115% of current price
      const updateTpAction = await Helper.createUpdateTPAction(newTakeProfit);

      const x = new Decimal(10).pow(10);
      const currentPrice = new Decimal(60).mul(x);
      const call = autoVaultHarness.call_executeAction(
        0,
        currentPrice.toFixed(),
        SWAP_FEE_SCALE.toFixed(),
        updateTpAction,
        0
      );

      const expectedTakeProfit = new Decimal(newTakeProfit)
        .mul(currentPrice.toString())
        .dividedBy("1000000")
        .toFixed();

      await expect(call)
        .to.emit(FakeGainsNetwork, "UpdateTpCalled")
        .withArgs(0, expectedTakeProfit);
    });
    it("can execute an update open order action ", async () => {
      const maxSlippage = 1000;
      const triggerPricePercent = new Decimal(1020000); // 102% of current price
      const takeProfitPercent = new Decimal(1100000); // 110% of current price
      const stopLossPercent = new Decimal(900000); // 90% of current price

      const updateOpenOrderAction = await Helper.createUpdateOpenOrderAction(
        maxSlippage,
        triggerPricePercent.toFixed(),
        takeProfitPercent.toFixed(),
        stopLossPercent.toFixed()
      );

      const x = new Decimal(10).pow(10);
      const currentPrice = new Decimal(60).mul(x);
      const call = autoVaultHarness.call_executeAction(
        0,
        currentPrice.toFixed(),
        SWAP_FEE_SCALE.toFixed(),
        updateOpenOrderAction,
        0
      );

      const expectedTriggerPrice = triggerPricePercent
        .mul(currentPrice.toString())
        .dividedBy("1000000")
        .toFixed();
      const expectedTakeProfit = takeProfitPercent
        .mul(currentPrice.toString())
        .dividedBy("1000000")
        .toFixed();
      const expectedStopLoss = stopLossPercent
        .mul(currentPrice.toString())
        .dividedBy("1000000")
        .toFixed();

      await expect(call)
        .to.emit(FakeGainsNetwork, "UpdateOpenOrderCalled")
        .withArgs(
          0,
          expectedTriggerPrice,
          expectedTakeProfit,
          expectedStopLoss,
          maxSlippage
        );
    });
    it("can execute a cancel open order action", async () => {
      const cancelOpenOrderAction = await Helper.createCancelOpenOrderAction();

      const x = new Decimal(10).pow(10);
      const currentPrice = new Decimal(60).mul(x);
      const call = autoVaultHarness.call_executeAction(
        0,
        currentPrice.toFixed(),
        SWAP_FEE_SCALE.toFixed(),
        cancelOpenOrderAction,
        0
      );

      await expect(call)
        .to.emit(FakeGainsNetwork, "CancelOpenOrderCalled")
        .withArgs(0);
    });
    it("can execute a close trade market action", async () => {
      const closeTradeMarketAction =
        await Helper.createCloseTradeMarketAction();

      const x = new Decimal(10).pow(10);
      const currentPrice = new Decimal(60).mul(x);
      const call = autoVaultHarness.call_executeAction(
        0,
        currentPrice.toFixed(),
        SWAP_FEE_SCALE.toFixed(),
        closeTradeMarketAction,
        0
      );

      await expect(call)
        .to.emit(FakeGainsNetwork, "CloseTradeMarketCalled")
        .withArgs(0);
    });
    it("can execute an update leverage action", async () => {
      const newLeverage = 10000; // 10x leverage
      const updateLeverageAction =
        await Helper.createUpdateLeverageAction(newLeverage);

      const x = new Decimal(10).pow(10);
      const currentPrice = new Decimal(60).mul(x);
      const call = autoVaultHarness.call_executeAction(
        0,
        currentPrice.toFixed(),
        SWAP_FEE_SCALE.toFixed(),
        updateLeverageAction,
        0
      );

      await expect(call)
        .to.emit(FakeGainsNetwork, "UpdateLeverageCalled")
        .withArgs(0, newLeverage);
    });
    it("can execute a decrease position size action ", async () => {
      const collateralDelta = new Decimal(100000); // 10% of current collateral
      const leverageDelta = 1000; // 1x leverage decrease

      const decreasePositionSizeAction =
        await Helper.createDecreasePositionSizeAction(
          collateralDelta.toFixed(),
          leverageDelta,
          0
        );

      const x = new Decimal(10).pow(10);
      const currentPrice = new Decimal(60).mul(x);

      const call = autoVaultHarness.call_executeAction(
        0,
        currentPrice.toFixed(),
        SWAP_FEE_SCALE.toFixed(),
        decreasePositionSizeAction,
        0
      );

      await expect(call)
        .to.emit(FakeGainsNetwork, "DecreasePositionSizeCalled")
        .withArgs(
          0,
          collateralDelta.mul(collateralAmount).dividedBy(1000000).toFixed(),
          leverageDelta
        );
    });
    it("can execute an increase position size action hutt", async () => {
      const maxSlippage = 1000;
      const collateralDelta = new Decimal(200000); // 20% of current collateral
      const leverageDelta = 2000; // 2x leverage increase
      const expectedPricePercent = new Decimal(10100000); // 101% of current price

      const increasePositionSizeAction =
        await Helper.createIncreasePositionSizeAction(
          maxSlippage,
          collateralDelta.toFixed(),
          leverageDelta,
          expectedPricePercent.toFixed()
        );

      const x = new Decimal(10).pow(10);
      const currentPrice = new Decimal(60).mul(x);
      const call = autoVaultHarness.call_executeAction(
        0,
        currentPrice.toFixed(),
        SWAP_FEE_SCALE.toFixed(),
        increasePositionSizeAction,
        0
      );

      const expectedPrice = expectedPricePercent
        .mul(currentPrice.toString())
        .dividedBy("1000000")
        .toFixed();

      await expect(call)
        .to.emit(FakeGainsNetwork, "IncreasePositionSizeCalled")
        .withArgs(
          0,
          collateralDelta.mul(collateralAmount).dividedBy(1000000).toFixed(),
          leverageDelta,
          expectedPrice,
          maxSlippage
        );
    });
  });
});

async function getAmount(Token: ERC20, amount: string) {
  const x = await Token.decimals();
  const y = new Decimal(10).pow(x.toString());
  return new Decimal(amount).mul(y);
}
