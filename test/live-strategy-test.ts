import { ethers, deployments, network } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  AutoVault,
  Helper,
  IGainsNetwork,
  VaultFactory,
} from "../typechain-types";
import { ERC20 } from "../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";

import { Deployment } from "hardhat-deploy/dist/types";
import { contracts } from "../Addresses";
import { Decimal } from "decimal.js";
import dotenv from "dotenv";
import { PriceUpdater } from "../scripts/readTrades";
import { getStrategies } from "./getStrategies";
import { expect } from "chai";
import { TradeStruct } from "../typechain-types/contracts/Gains Contracts/FakeGainsNetwork";

import { BigNumberish, Provider } from "ethers";
import axios, { AxiosRequestConfig, Method } from "axios";
import { assert } from "console";
import { execArgv } from "process";
import { chownSync } from "fs";

dotenv.config();

// Profiler configuration
const ENABLE_PROFILER = true;
const profiler = {
  start: (label: string) => {
    if (ENABLE_PROFILER) console.time(label);
  },
  end: (label: string) => {
    if (ENABLE_PROFILER) console.timeEnd(label);
  },
};

describe("Live Testnet Strategy Tests", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let vaultFactory: VaultFactory;
  let Helper: Helper;
  let USDC: ERC20;
  let GainsNetwork: IGainsNetwork;
  let autoVault: AutoVault;
  let priceUpdater: PriceUpdater;

  before(async () => {
    profiler.start("Setup Test Environment");

    const chainID = network.config.chainId;
    if (chainID == undefined) throw "Cannot find chainID";

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    console.log(deployer.address);
    user = chainID == 31337 ? await getTestUser() : deployer;
    if (chainID == 31337) throw "These tests are for live runs only";

    // await deployments.fixture(["all"]);

    const factoryContract = await deployments.get("VaultFactory");
    vaultFactory = await ethers.getContractAt(
      "VaultFactory",
      factoryContract.address,
      user
    );

    GainsNetwork = await ethers.getContractAt(
      "IGainsNetwork",
      contracts[chainID].GainsNetwork,
      user
    );

    const helperContract = await deployments.get("Helper");
    Helper = await ethers.getContractAt("Helper", helperContract.address, user);

    USDC = (await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
      contracts[chainID].USDC,
      user
    )) as unknown as ERC20;

    priceUpdater = new PriceUpdater();
    await priceUpdater.waitForReady();

    profiler.end("Setup Test Environment");
  });

  before(async () => {
    profiler.start("Create Vault");

    const initialAmount = await getAmount(USDC, "300");

    await USDC.approve(vaultFactory.target, initialAmount.toFixed());

    const APIInfos = Array(4).fill(createAPIInfo());
    const strategies = await getStrategies(Helper);

    const vaultAddress = await vaultFactory.createVault.staticCall(
      USDC,
      initialAmount.toFixed(),
      APIInfos,
      strategies
    );
    await vaultFactory.createVault(
      USDC,
      initialAmount.toFixed(),
      APIInfos,
      strategies
    );

    autoVault = await ethers.getContractAt("AutoVault", vaultAddress, user);
    console.log(`Deployed AutoVault at ${autoVault.target}`);

    profiler.end("Create Vault");
  });

  describe("Strategy Tests", function () {
    it("Strategy 1: Open Long and Update SL/TP ", async function () {
      await testStrategy(0, verifyOpenLong, verifyUpdateSL, verifyUpdateTP);
    });

    it("Strategy 2: Open Long and Update Leverage ", async function () {
      await testStrategy(1, verifyOpenLong, verifyUpdateLeverage, verifyClose);
    });

    it("Strategy 3: Open Long and Decrease/Increase Position ", async function () {
      await testStrategy(
        2,
        verifyOpenLong,
        verifyDecreasedPosition,
        verifyIncreasedPosition
      );
    });

    it("Strategy 4: Open and Update Order ", async function () {
      //Its important to note that there are lots of rules
      //So when updating an open order, ensure that open price is above teh stop loss, but
      //also that teh stop loss is not too far below the open price
      await testStrategy(
        3,
        verifyOpenOrder,
        verifyUpdateOrder,
        verifyCancelOrder
      );
    });

    // it("Strategy 4: Open and Cancel Order", async function () {
    //   await testStrategy(3, verifyOpenOrder, verifyCancelOrder);
    // });
  });

  async function testStrategy(
    strategyIndex: number,
    verifyFunction1: (initialTrade: any, updatedTrade: any) => void,
    verifyFunction2: (updatedTrade: any, finalTrade: any) => void,
    verifyFunction3: (updatedTrade: any, finalTrade: any) => void
  ) {
    profiler.start(`Test Strategy ${strategyIndex}`);

    const initialTrade = await getLastTrade();

    await executeStrategyWithPrice(strategyIndex, 25);
    const tradeTwo = await waitForTradeUpdate(initialTrade);
    console.log("Trades 0:", initialTrade, tradeTwo);
    verifyFunction1(initialTrade, tradeTwo);

    await executeStrategyWithPrice(strategyIndex, 85);
    console.log(`Now waiting for an update on tradeTwo`);
    const tradeThree = await waitForTradeUpdate(tradeTwo);
    console.log("Trades 1:", tradeTwo, tradeThree);

    verifyFunction2(tradeTwo, tradeThree);

    await executeStrategyWithPrice(strategyIndex, 50);
    const finalTrade = await waitForTradeUpdate(tradeThree);
    console.log("Trades: 2", tradeThree, finalTrade);

    verifyFunction3(tradeThree, finalTrade);

    profiler.end(`Test Strategy ${strategyIndex}`);
  }

  async function executeStrategyWithPrice(strategyIndex: number, rsi: number) {
    const price = await getPriceFromUpdater();
    await updateResponse(new Decimal(price), ethers.provider, new Decimal(rsi));
    await autoVault.executeStrategy(strategyIndex);
    // Wait for the strategy execution to be processed
    // await new Promise((f) => setTimeout(f, 30000));
  }

  // Verification functions for each strategy
  function verifyOpenLong(tradeBefore: any, tradeAfter: any) {
    //This needs to go from no trade, to a trade
    expect(tradeAfter.long).to.be.true;
    expect(tradeAfter.leverage).to.be.eql("5000");
  }

  function verifyClose(tradeBefore: any, tradeAfter: any) {
    //This needs to go from no trade, to a trade
    expect(JSON.stringify(tradeAfter)).to.be.eql("{}");
  }
  function verifyUpdateSL(beforeTrade: any, tradeAfter: any) {
    expect(tradeAfter.sl).to.not.equal(beforeTrade.sl);
  }
  function verifyUpdateTP(beforeTrade: any, tradeAfter: any) {
    expect(tradeAfter.tp).to.not.equal(beforeTrade.tp);
  }

  function verifyUpdateLeverage(beforeTrade: any, tradeAfter: any) {
    expect(beforeTrade.leverage).to.be.eql("5000");
    expect(tradeAfter.leverage).to.be.eql("12000");
    expect(tradeAfter.leverage).to.not.equal(beforeTrade.leverage);
  }

  function verifyDecreasedPosition(beforeTrade: any, tradeAfter: any) {
    expect(Number(tradeAfter.collateralAmount)).to.be.lessThan(
      Number(beforeTrade.collateralAmount)
    );
  }
  function verifyIncreasedPosition(beforeTrade: any, tradeAfter: any) {
    expect(Number(tradeAfter.collateralAmount)).to.be.greaterThan(
      Number(beforeTrade.collateralAmount)
    );
  }

  function verifyOpenOrder(tradeBefore: any, tradeAfter: Trade) {
    expect(tradeAfter.tradeType).to.equal("1");
  }

  function verifyUpdateOrder(tradeBefore: any, tradeAfter: any) {
    expect(tradeAfter.openPrice).to.not.equal(tradeBefore.openPrice);
  }

  function verifyCancelOrder(tradeBefore: any, tradeAfter: any) {
    expect(JSON.stringify(tradeBefore)).to.not.equal("{}");
    expect(JSON.stringify(tradeAfter)).to.equal("{}");
  }
  interface Trade {
    user: string;
    index: string;
    pairIndex: string;
    leverage: string;
    long: boolean;
    isOpen: boolean;
    collateralIndex: string;
    tradeType: string;
    collateralAmount: string;
    openPrice: string;
    tp: string;
    sl: string;
    __placeholder: string;
  }
  // Helper functions
  async function getLastTrade(): Promise<Trade> {
    const trades = await GainsNetwork.getTrades(autoVault.target);
    if (trades.length == 0) return {} as Trade;
    const lastTrade = trades[trades.length - 1];
    return {
      user: lastTrade.user,
      index: lastTrade.index.toString(),
      pairIndex: lastTrade.pairIndex.toString(),
      leverage: lastTrade.leverage.toString(),
      long: lastTrade.long,
      isOpen: lastTrade.isOpen,
      collateralIndex: lastTrade.collateralIndex.toString(),
      tradeType: lastTrade.tradeType.toString(),
      collateralAmount: lastTrade.collateralAmount.toString(),
      openPrice: lastTrade.openPrice.toString(),
      tp: lastTrade.tp.toString(),
      sl: lastTrade.sl.toString(),
      __placeholder: lastTrade.__placeholder.toString(),
    };
  }

  // Helper functions
  async function getTestUser() {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"],
    });
    return ethers.getSigner("0x793448209Ef713CAe41437C7DaA219b59BEF1A4A");
  }

  function createAPIInfo() {
    return {
      method: "POST",
      url: `https://xpzyihmcunwwykjpfdgy.supabase.co/rest/v1/rpc/process_indexed_json`,
      headers: `["accept", "application/json", "apikey","${process.env.API}"]`,
      body: '{"input_index": 1, "input_json": {}}',
      path: "price;blockTimestamp;rsi",
      jobIDs: "168535c73f7b46cd8fd9a7f21bdbedc1",
    };
  }

  async function getAmount(Token: ERC20, amount: string) {
    const decimals = await Token.decimals();
    return new Decimal(amount).mul(new Decimal(10).pow(decimals.toString()));
  }

  async function getPriceFromUpdater() {
    let price;
    while (price == undefined) {
      price = await priceUpdater.getPrice("0");
      await new Promise((f) => setTimeout(f, 500));
    }
    return price;
  }

  async function waitForTradeUpdate(
    previousTrade: TradeStruct,
    timeout = 70000
  ): Promise<TradeStruct> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const intervalId = setInterval(async () => {
        try {
          const lastTrade = await getLastTrade();

          console.log(
            JSON.stringify(lastTrade),
            "|",
            JSON.stringify(previousTrade)
          );

          if (JSON.stringify(lastTrade) != JSON.stringify(previousTrade)) {
            clearInterval(intervalId);
            resolve(lastTrade);
          }
          if (Date.now() - startTime > timeout) {
            clearInterval(intervalId);
            reject(new Error("Timeout waiting for trade update"));
          }
        } catch (error) {
          clearInterval(intervalId);
          reject(error);
        }
      }, 5000);
    });
  }

  function areTradesEqual(trade1: TradeStruct, trade2: TradeStruct): boolean {
    const keys = Object.keys(trade1) as (keyof TradeStruct)[];
    return keys.every((key) => {
      const value1 = trade1[key];
      const value2 = trade2[key];
      if (typeof value1 === "bigint" && typeof value2 === "bigint") {
        return value1.toString() === value2.toString();
      }
      return value1 === value2;
    });
  }

  async function updateResponse(
    res: Decimal,
    provider: Provider,
    rsi: Decimal
  ) {
    const latestBlock = await provider.getBlock("latest");
    if (latestBlock == undefined) throw "undefined";
    const blockTimestamp = new Decimal(latestBlock.timestamp.toString());
    // const x = new Decimal(10).pow(18);

    const body = `{"input_index": 1, "input_json": {"price": "${res.toFixed()}", "blockTimestamp":"${blockTimestamp.toFixed()}", "rsi": "${rsi.toFixed()}" }}`;
    console.log(body);
    const headers = `["Content-Type", "application/json", "apikey","${process.env.API}"]`;
    const parsedHeaders: Record<string, string> = {};
    const headerArray: string[] = JSON.parse(headers);

    for (let i = 0; i < headerArray.length; i += 2) {
      if (headerArray[i].toLowerCase() === "accept") {
        parsedHeaders["Content-Type"] = headerArray[i + 1];
      } else {
        parsedHeaders[headerArray[i]] = headerArray[i + 1];
      }
    }
    const config: AxiosRequestConfig = {
      method: "POST" as Method,
      url: `https://xpzyihmcunwwykjpfdgy.supabase.co/rest/v1/rpc/process_indexed_json`,
      headers: parsedHeaders,
      data: body ? JSON.parse(body) : undefined,
    };

    const response = await axios(config);
    return response.data;
  }
});
