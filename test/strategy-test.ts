import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
//@ts-ignore
import { ethers, deployments, userConfig, network } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  AutoVault,
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

dotenv.config();

describe("Strategy Tests hyt", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let vaultFactory: VaultFactory;
  let Helper: Helper;

  let USDC: ERC20;
  let WETH: ERC20;
  let DAI: ERC20;
  let userAddress: string;
  let FakeGainsNetwork: FakeGainsNetwork;

  beforeEach(async () => {
    const chainID = network.config.chainId;
    if (chainID == undefined) throw "Cannot find chainID";

    accounts = (await ethers.getSigners()) as unknown as SignerWithAddress[]; // could also do with getNamedAccounts
    deployer = accounts[0];
    if (chainID == 31337) {
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"],
      });
      user = await ethers.getSigner(
        "0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"
      ); //Test account with money
      userAddress = await user.getAddress();
    } else {
      userAddress = await deployer.getAddress();
      user = deployer;
    }

    await deployments.fixture(["Test"]);

    // test = (await ethers.getContractAt(
    //   "Test",
    //   testContract.address.toString()
    // )) as unknown as Test;

    const fakeGainsContract = (await deployments.get(
      "FakeGainsNetwork"
    )) as Deployment;

    FakeGainsNetwork = (await ethers.getContractAt(
      "FakeGainsNetwork",
      fakeGainsContract.address.toString(),
      user
    )) as unknown as FakeGainsNetwork;

    const factoryContract = (await deployments.get(
      "VaultFactory"
    )) as Deployment;

    vaultFactory = (await ethers.getContractAt(
      "VaultFactory",
      factoryContract.address.toString(),
      user
    )) as unknown as VaultFactory;

    const helperContract = (await deployments.get("Helper")) as Deployment;

    Helper = (await ethers.getContractAt(
      "Helper",
      helperContract.address.toString(),
      user
    )) as unknown as Helper;

    USDC = (await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
      contracts[chainID].USDC,
      user
    )) as unknown as ERC20;

    await vaultFactory
      .connect(deployer)
      .setGainsAddress(FakeGainsNetwork.target);
  });

  it("strategy works as expected ", async () => {
    const initalAmount = await getAmount(USDC, "10");
    const apiKey = process.env.LUKE_API;
    const method = "";
    const url = ``;
    const path = ``;
    const headers = "";
    const body = "";
    const jobId = "";

    await USDC.approve(vaultFactory.target, initalAmount.toFixed());

    const APIInfos = [
      {
        method: method,
        url: url,
        headers: headers,
        body: body,
        path: path,
        jobIDs: jobId,
      },
    ] as VaultFactory.APIInfoStruct[];
    //According to ChatGPT, if RSI is above 70 then its too high. If its below 30 then its too low
    //So what I will do is have two strategies, if the RSI goes to 50 then it will close either position
    //if 70 < x1 then longBTC else do nothing
    const longAciton = await Helper.createOpenTradeAction(
      1000,
      0,
      5000,
      true,
      true,
      3,
      0,
      200000, // Should be 2%
      10000000,
      12000000,
      8000000
    );
    const decimals = new Decimal(10).pow(10);
    //If x2 < 70 * decimals then return long action else return 0
    const longStrategy = [
      18,
      15,
      1,
      2,
      0,
      new Decimal(70).mul(decimals).toFixed(),
      0,
      longAciton,
      0,
      0,
    ];

    let listOfStrategies = [[]] as number[][];
    const vaultAddress = await vaultFactory.createVault.staticCall(
      USDC,
      initalAmount.toFixed(),
      APIInfos,
      [longStrategy] as number[][]
    );
    await vaultFactory.createVault(USDC, initalAmount.toFixed(), APIInfos, [
      longStrategy,
    ]);
    let autoVault = (await ethers.getContractAt(
      "AutoVault",
      vaultAddress,
      user
    )) as unknown as AutoVault;
    let requestID = await autoVault.executeStrategy.staticCall(0);
    const tx3 = await autoVault.executeStrategy(0);
    await tx3.wait();
    const x = new Decimal(10).pow(10);
    const currentPrice = new Decimal(60).mul(x);
    let input = [
      currentPrice.toFixed(),
      new Decimal(70).mul(decimals).toFixed(),
    ];

    expect(
      await impersonateOracleFulfill(autoVault, requestID, input, 0)
    ).to.emit(FakeGainsNetwork, "OpenTradeCalled");

    requestID = await autoVault.executeStrategy.staticCall(0);
    const tx4 = await autoVault.executeStrategy(0);
    await tx4.wait();
    //When its below 70, then its rejected
    input = [currentPrice.toFixed(), new Decimal(60).mul(decimals).toFixed()];

    await expect(
      impersonateOracleFulfill(autoVault, requestID, input, 0)
    ).to.be.rejectedWith("NoAction()");
  });
  it("RSI-based strategy works as expected ", async () => {
    const initialAmount = await getAmount(USDC, "10");
    const apiKey = process.env.API_KEY;
    const method = "";
    const url = ``;
    const path = "";
    const headers = "";
    const body = "";
    const jobId = "";

    await USDC.approve(vaultFactory.target, initialAmount.toFixed());

    const APIInfos = [
      {
        method,
        url,
        headers,
        body,
        path,
        jobIDs: jobId,
      },
    ] as VaultFactory.APIInfoStruct[];

    const decimals = new Decimal(10).pow(10);

    // Long action when RSI < 30
    const longAction = await Helper.createOpenTradeAction(
      1000, // maxSlippage
      0, // pairIndex (BTC)
      5000, // leverage (5x)
      true, // long
      true, // isOpen
      3, // collateralType (USDC)
      0, // orderType (Market)
      200000, // collateralPercent (2%)
      10000000, // openPricePercent
      12000000, // takeProfitPercent
      8000000 // stopLossPercent
    );

    // Short action when RSI > 70
    const shortAction = await Helper.createOpenTradeAction(
      1000,
      0,
      5000,
      false, // short
      true,
      3,
      0,
      200000,
      10000000,
      8000000, // TP is lower for short
      12000000 // SL is higher for short
    );

    // Close action when 40 < RSI < 60
    const closeAction = await Helper.createCloseTradeMarketAction();

    // If RSI < 30 then long, if RSI > 70 then short, if 40 < RSI < 60 then close, else do nothing
    const strategy = [
      18, //if
      14, // less
      1, //rsi
      2,
      0, //30
      new Decimal(30).mul(decimals).toFixed(),
      0,
      longAction,
      18,
      15,
      1,
      2,
      0,
      new Decimal(70).mul(decimals).toFixed(),
      0,
      shortAction,
      18,
      16,
      15,
      1,
      2,
      0,
      new Decimal(40).mul(decimals).toFixed(),
      14,
      1,
      2,
      0,
      new Decimal(60).mul(decimals).toFixed(),
      0,
      closeAction,
      0,
      0,
    ];

    const vaultAddress = await vaultFactory.createVault.staticCall(
      USDC,
      initialAmount.toFixed(),
      APIInfos,
      [strategy] as number[][]
    );
    await vaultFactory.createVault(USDC, initialAmount.toFixed(), APIInfos, [
      strategy,
    ]);

    let autoVault = (await ethers.getContractAt(
      "AutoVault",
      vaultAddress,
      user
    )) as unknown as AutoVault;

    // Test case 1: RSI = 25 (Should open long position)
    let requestID = await autoVault.executeStrategy.staticCall(0);
    await autoVault.executeStrategy(0);
    console.log("Made it here");
    const currentPrice = new Decimal(60000).mul(decimals).toFixed();
    let input = [currentPrice, new Decimal(25).mul(decimals).toFixed()];
    expect(await impersonateOracleFulfill(autoVault, requestID, input, 0))
      .to.emit(FakeGainsNetwork, "OpenTradeCalled")
      .withArgs(isLong);

    // Test case 2: RSI = 55 (Should close long position)
    requestID = await autoVault.executeStrategy.staticCall(0);
    await autoVault.executeStrategy(0);
    input = [currentPrice, new Decimal(50).mul(decimals).toFixed()];
    expect(
      await impersonateOracleFulfill(autoVault, requestID, input, 0)
    ).to.emit(FakeGainsNetwork, "CloseTradeMarketCalled");

    // Test case 3: RSI = 75 (Should open short position)
    requestID = await autoVault.executeStrategy.staticCall(0);
    await autoVault.executeStrategy(0);
    input = [currentPrice, new Decimal(75).mul(decimals).toFixed()];
    expect(await impersonateOracleFulfill(autoVault, requestID, input, 0))
      .to.emit(FakeGainsNetwork, "OpenTradeCalled")
      .withArgs(isShort);

    // Test case 4: RSI = 50 (Should close short position)
    requestID = await autoVault.executeStrategy.staticCall(0);
    await autoVault.executeStrategy(0);
    input = [currentPrice, new Decimal(50).mul(decimals).toFixed()];
    expect(
      await impersonateOracleFulfill(autoVault, requestID, input, 0)
    ).to.emit(FakeGainsNetwork, "CloseTradeMarketCalled");

    // Test case 5: RSI = 35 (Should do nothing)
    requestID = await autoVault.executeStrategy.staticCall(0);
    await autoVault.executeStrategy(0);
    input = [currentPrice, new Decimal(35).mul(decimals).toFixed()];
    await expect(
      impersonateOracleFulfill(autoVault, requestID, input, 0)
    ).to.be.rejectedWith("NoAction()");

    // Test case 6: RSI = 50 (Should do revert and not close)
    requestID = await autoVault.executeStrategy.staticCall(0);
    await autoVault.executeStrategy(0);
    input = [currentPrice, new Decimal(55).mul(decimals).toFixed()];
    await expect(
      impersonateOracleFulfill(autoVault, requestID, input, 0)
    ).to.be.rejectedWith("StrategyNotActive");
  });
});

async function getAmount(Token: ERC20, amount: string) {
  const x = await Token.decimals();
  const y = new Decimal(10).pow(x.toString());
  return new Decimal(amount).mul(y);
}

function isLong(Trade: TradeStruct): boolean {
  if (Trade.long == true) return true;
  return false;
}

function isShort(Trade: TradeStruct): boolean {
  if (Trade.long == false) return true;
  return false;
}

export function getAmountDec(amount: string, decimals: number): Decimal {
  const x = new Decimal(10).pow(decimals);
  return new Decimal(amount).mul(x);
}
