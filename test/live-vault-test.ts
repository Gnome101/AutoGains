import { ethers, deployments, network } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ERC20 } from "../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";
import {
  AutoVault,
  Helper,
  IGainsNetwork,
  VaultFactory,
} from "../typechain-types";

import { Deployment } from "hardhat-deploy/dist/types";
import { contracts } from "../Addresses";
import { Decimal } from "decimal.js";
import dotenv from "dotenv";
import { PriceUpdater } from "../scripts/readTrades";
import { getStrategies } from "./getStrategies";
import { expect, assert } from "chai";
import { BigNumberish, Provider } from "ethers";
import { TradeStruct } from "../typechain-types/contracts/Gains Contracts/FakeGainsNetwork";

import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { execArgv } from "process";
import { chownSync } from "fs";
import {
  calculateFeeOnRaw,
  calculateFeeOnTotal,
  toDecimal,
} from "./vault-test";
import {
  previewDeposit,
  previewMint,
  previewRedeem,
  previewWithdraw,
} from "../utils/AutoGains";
import exp from "constants";

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

describe("Live Testnet Vault Tests", function () {
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
    const tx = await USDC.approve(vaultFactory.target, initialAmount.toFixed());
    await tx.wait();
    const APIInfos = Array(4).fill(createAPIInfo());

    const strategies = await getStrategies(Helper);
    const vaultAddress = await vaultFactory.createVault.staticCall(
      USDC,
      initialAmount.toFixed(),
      APIInfos,
      strategies,
      "AutoGainsUSDC",
      "aUSDC"
    );

    const tx2 = await vaultFactory.createVault(
      USDC,
      initialAmount.toFixed(),
      APIInfos,
      strategies,
      "AutoGainsUSDC",
      "aUSDC"
    );

    await tx2.wait();
    // const vaultAddress = "0x919110f38f9588d57d2f03044f28410cee8746f6";
    autoVault = await ethers.getContractAt("AutoVault", vaultAddress, user);
    console.log(`Deployed AutoVault at ${autoVault.target}`);
    profiler.end("Create Vault");
  });

  describe("Live Vault Tests", function () {
    it("User can deposit wooba", async function () {
      const add = await autoVault.asset();
      console.log("Asset", add);
      profiler.start("Get Most Recent Data");

      const initialTrade = await getLastTrade();
      profiler.end("Get Most Recent Data");

      profiler.start("Executing Trade");

      await executeStrategyWithPrice(0, 25);
      await waitForTradeUpdate(initialTrade);
      // await new Promise((f) => setTimeout(f, 60000));

      profiler.end("Executing Trade");
      const depositAmount = await getAmount(USDC, "4");

      profiler.start("Approving USDC");
      const tx = await USDC.approve(
        autoVault.target,
        depositAmount.mul(2).toFixed()
      );
      await tx.wait();
      profiler.end("Approving USDC");
      profiler.start("Preparing Deposit");

      const totalAssets = await getVaultTotalAssets(
        autoVault.target.toString()
      );
      const balanceBefore = toDecimal(await autoVault.balanceOf(user.address));
      console.log("estimate", totalAssets);
      const DepositPreview = await previewDeposit(
        vaultFactory,
        autoVault,
        user.address,
        depositAmount,
        totalAssets
      );
      const expectedShares = DepositPreview.expectedAmount;
      console.log(DepositPreview);

      profiler.end("Preparing Deposit");
      profiler.start("Start Action");

      await autoVault.startAction(
        user.address,
        depositAmount.toFixed(),
        0,
        expectedShares.mul("0.95").floor().toFixed()
      );
      profiler.end("Start Action");
      profiler.start("Waiting for Balance Update");

      await waitForBalanceUpdate(balanceBefore);
      profiler.end("Waiting for Balance Update");

      //   await testAction("Deposit");
    });
    it("User can mint ", async function () {
      const add = await autoVault.asset();
      console.log("Asset", add);
      profiler.start("Get Most Recent Data");

      const initialTrade = await getLastTrade();
      profiler.end("Get Most Recent Data");

      profiler.start("Executing Trade");

      await executeStrategyWithPrice(0, 25);
      await waitForTradeUpdate(initialTrade);

      profiler.end("Executing Trade");
      profiler.start("Approving USDC");

      const mintAmount = await getAmount(USDC, "4");
      const tx = await USDC.approve(
        autoVault.target,
        mintAmount.mul(2).toFixed()
      );
      await tx.wait();

      profiler.end("Approving USDC");
      profiler.start("Preparing Mint");
      const totalAssets = await getVaultTotalAssets(
        autoVault.target.toString()
      );
      const balanceBefore = toDecimal(await autoVault.balanceOf(user.address));

      const PreivewMint = await previewMint(
        vaultFactory,
        autoVault,
        user.address,
        mintAmount,
        totalAssets
      );
      const expectedShares = PreivewMint.expectedAmount;
      console.log(PreivewMint);

      profiler.end("Preparing Mint");
      profiler.start("Start Action");

      await autoVault.startAction(
        user.address,
        mintAmount.toFixed(),
        1,
        expectedShares.mul("1.2").floor().toFixed()
      );
      profiler.end("Start Action");
      profiler.start("Waiting for Balance Update");

      await waitForBalanceUpdate(balanceBefore);
      profiler.end("Waiting for Balance Update");
      const balanceAfter = toDecimal(await autoVault.balanceOf(user.address));

      assert.equal(
        balanceAfter.sub(balanceBefore).toFixed(),
        mintAmount.toFixed()
      );
      //   await testAction("Deposit");
    });
    it("user can start withdraw period and withdraw ", async () => {
      const initialTrade = await getLastTrade();
      profiler.end("Get Most Recent Data");

      profiler.start("Executing Trade");

      await executeStrategyWithPrice(0, 25);
      const tradeFormed = await waitForTradeUpdate(initialTrade);

      profiler.end("Executing Trade");
      const tx1 = await autoVault.forceWithdrawPeriod();
      await tx1.wait();

      const tx2 = await autoVault.startAction(user.address, "0", 2, "0");
      await tx2.wait();
      const tradeAfter = await waitForTradeUpdate(tradeFormed);
      verifyClose(tradeFormed, tradeAfter);

      const redeemAmount = await getAmount(USDC, "4");

      const expectedAssets = await autoVault.previewRedeem(
        redeemAmount.toFixed()
      );
      const balanceBefore = toDecimal(await USDC.balanceOf(user.address));
      const tx3 = await autoVault.redeem(
        redeemAmount.toFixed(),
        user.address,
        user.address
      );
      await tx3.wait();
      const balanceAfter = toDecimal(await USDC.balanceOf(user.address));
      assert.equal(
        balanceAfter.sub(balanceBefore).toFixed(),
        expectedAssets.toString()
      );
    });
    // it("Strategy 4: Open and Cancel Order", async function () {
    //   await testStrategy(3, verifyOpenOrder, verifyCancelOrder);
    // });
  });

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
  async function getBalance() {
    const bal = new Decimal(
      (await autoVault.balanceOf(user.address)).toString()
    );
    return bal;
  }
  async function waitForBalanceUpdate(
    previousBalance: Decimal,
    timeout = 70000
  ): Promise<Decimal> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const intervalId = setInterval(async () => {
        try {
          const latestBalance = await getBalance();

          console.log(previousBalance.toFixed(), "|", latestBalance.toFixed());

          if (previousBalance.toFixed() != latestBalance.toFixed()) {
            clearInterval(intervalId);
            resolve(latestBalance);
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

  async function getVaultTotalAssets(vaultAddress: string): Promise<Decimal> {
    // const tradeInfo = await getTradingVariables(vaultAddress);
    // const assets = await getTokenAssets(vaultAddress);

    const info = await Promise.all([
      await getTradingVariables(vaultAddress),
      await getTokenAssets(vaultAddress),
    ]);
    const decimals = new Decimal(10).pow(Number(await USDC.decimals()));
    return new Decimal(info[0].totalCollateral)
      .mul(decimals)
      .floor()
      .plus(info[1]);
  }
  async function getTokenAssets(vaultAddress: string): Promise<Decimal> {
    const assetAddress = await autoVault.asset();
    console.log("ADDy", assetAddress);
    const amount = await (
      await ethers.getContractAt(
        "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
        assetAddress
      )
    ).balanceOf(autoVault.target);

    return new Decimal(amount.toString());
  }
  interface TradingVariablesRequest {
    userAddress: string;
  }
  interface TradingVariablesResponse {
    totalCollateral: string;
    totalResultDiff: string;
    pnlArray: string[];
    collateralArray: string[];
    pairPrices: string[];
    blockTimestamp: string;
    latestPrices: string[];
    newCollateralArray: string[];
    totalnewCollateral: string;
  }

  async function getTradingVariables(userAddress: string): Promise<any> {
    const url =
      "https://xpzyihmcunwwykjpfdgy.supabase.co/functions/v1/get-trading-variables";
    const headers = {
      Authorization: `${process.env.LUKE_API}`,
      "Content-Type": "application/json",
    };
    const data: TradingVariablesRequest = { userAddress };

    try {
      const response: AxiosResponse<TradingVariablesResponse> =
        await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  }

  // Usage example:
  // getTradingVariables('0x793448209Ef713CAe41437C7DaA219b59BEF1A4A')
  //   .then(response => console.log(response))
  //   .catch(error => console.error('Error:', error));
});
