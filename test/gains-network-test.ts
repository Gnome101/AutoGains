import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
//@ts-ignore
import { ethers, deployments, userConfig, network } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ERC20, IGainsNetwork, Test256 } from "../typechain-types";
import { Deployment } from "hardhat-deploy/dist/types";
import { Test } from "../typechain-types";
import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object
import {
  TradeInfoStruct,
  TradeStruct,
} from "../typechain-types/contracts/Gains Contracts/IGainsNetwork";

describe("AutoGains Tests", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let testToken: ERC20;
  let test: Test;
  let GainsNetwork: IGainsNetwork;
  beforeEach(async () => {
    accounts = (await ethers.getSigners()) as unknown as SignerWithAddress[]; // could also do with getNamedAccounts
    deployer = accounts[0];
    user = accounts[1];
    const chainID = network.config.chainId;
    if (chainID == undefined) throw "Error";

    GainsNetwork = (await ethers.getContractAt(
      "IGainsNetwork",
      contracts[chainID].GainsNetwork
    )) as unknown as IGainsNetwork;
  });

  it("can create and close a limit position", async () => {
    const userAddress = await deployer.getAddress();
    const tradeBefore = await GainsNetwork.getTrades(userAddress);
    console.log(`User trades before: ${tradeBefore}`);
    const counters = await GainsNetwork.getCounters(userAddress, 0);
    const currentIndex = counters.currentIndex;
    const Trade = {
      user: userAddress,
      index: currentIndex,
      pairIndex: 0,
      leverage: 6000,
      long: true,
      isOpen: true,
      collateralIndex: 3, // 3 is usdc
      tradeType: 1,
      collateralAmount: 100000000,
      openPrice: 600000000000000,
      tp: 960000000000000,
      sl: 540000000000000,
      __placeholder: 0,
    } as TradeStruct;

    const tx1 = await GainsNetwork.openTrade(Trade, 1000, userAddress);
    await tx1.wait();
    const tradeAfterOpen = await GainsNetwork.getTrades(userAddress);
    console.log(`User trades after open: ${tradeAfterOpen}`);

    const tx2 = await GainsNetwork.cancelOpenOrder(currentIndex);
    await tx2.wait();

    const tradeAfterClose = await GainsNetwork.getTrades(userAddress);
    console.log(`User trades after close: ${tradeAfterClose}`);
  });
  it("can create, update,and close a limit position ", async () => {
    const userAddress = await deployer.getAddress();
    const tradeBefore = await GainsNetwork.getTrades(userAddress);
    console.log(`User trades before: ${tradeBefore}`);
    const counters = await GainsNetwork.getCounters(userAddress, 0);
    const currentIndex = counters.currentIndex;
    const Trade = {
      user: userAddress,
      index: currentIndex,
      pairIndex: 0,
      leverage: 6000,
      long: true,
      isOpen: true,
      collateralIndex: 3, // 3 is usdc
      tradeType: 1,
      collateralAmount: 100000000,
      openPrice: 600000000000000,
      tp: 960000000000000,
      sl: 540000000000000,
      __placeholder: 0,
    } as TradeStruct;

    const tx1 = await GainsNetwork.openTrade(Trade, 1000, userAddress);
    await tx1.wait();
    const tradeAfterOpen = await GainsNetwork.getTrades(userAddress);
    console.log(`User trades after Open: ${tradeAfterOpen}`);

    const tx2 = await GainsNetwork.updateOpenOrder(
      currentIndex,
      610000000000000,
      960000000000000,
      540000000000000,
      1000
    );
    await tx2.wait();
    const tradeAfterUpdate = await GainsNetwork.getTrades(userAddress);
    console.log(`User trades after Update: ${tradeAfterUpdate}`);
    const tx3 = await GainsNetwork.cancelOpenOrder(currentIndex);
    await tx3.wait();

    const tradeAfterClose = await GainsNetwork.getTrades(userAddress);
    console.log(`User trades after Close: ${tradeAfterClose}`);
  });
  it("can create and close a market position gns", async () => {
    const userAddress = await deployer.getAddress();
    const tradeBefore = await GainsNetwork.getTrades(userAddress);
    console.log(`User trades before: ${tradeBefore}`);
    const counters = await GainsNetwork.getCounters(userAddress, 0);
    const currentIndex = counters.currentIndex;
    const Trade = {
      user: userAddress,
      index: currentIndex,
      pairIndex: 0,
      leverage: 6000,
      long: true,
      isOpen: true,
      collateralIndex: 3, // 3 is usdc
      tradeType: 0, // 0 is market, 1 is limit, 2 is stop
      collateralAmount: 100000000,
      openPrice: 660000000000000,
      tp: 960000000000000,
      sl: 540000000000000,
      __placeholder: 0,
    } as TradeStruct;

    const tx1 = await GainsNetwork.openTrade(Trade, 1000, userAddress);
    await tx1.wait();
    const tradeAfterOpen = await GainsNetwork.getTrades(userAddress);
    console.log(`User trades after open: ${tradeAfterOpen}`);

    const tx2 = await GainsNetwork.closeTradeMarket(currentIndex);
    await tx2.wait();

    const tradeAfterClose = await GainsNetwork.getTrades(userAddress);
    console.log(`User trades after close: ${tradeAfterClose}`);
  });
});
