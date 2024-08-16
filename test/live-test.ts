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

import { Decimal } from "decimal.js";
import dotenv from "dotenv";
import { Addressable, Contract, Filter, Provider, TopicFilter } from "ethers";
import axios, { AxiosRequestConfig, Method } from "axios";
import { impersonateOracleFulfill } from "../utils/AutoGains";
import { DEFAULT_CIPHERS } from "tls";

import { PriceUpdater } from "../scripts/readTrades";
import { verify } from "../utils/verify";
import { getStrategies } from "./getStrategies";
dotenv.config();

describe("Strategy Tests ", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let vaultFactory: VaultFactory;
  let Helper: Helper;

  let USDC: ERC20;
  let WETH: ERC20;
  let DAI: ERC20;
  let userAddress: string;
  let GainsNetwork: IGainsNetwork;

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

    await deployments.fixture(["all"]);

    const factoryContract = (await deployments.get(
      "VaultFactory"
    )) as Deployment;

    vaultFactory = (await ethers.getContractAt(
      "VaultFactory",
      factoryContract.address.toString(),
      user
    )) as unknown as VaultFactory;

    GainsNetwork = (await ethers.getContractAt(
      "IGainsNetwork",
      contracts[chainID].GainsNetwork,
      user
    )) as unknown as IGainsNetwork;
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
  });
  describe("All Methods Work", function () {
    before(async () => {
      const initalAmount = await getAmount(USDC, "150");
      const apiKey = process.env.API;
      const method = "POST";
      const url = `https://xpzyihmcunwwykjpfdgy.supabase.co/rest/v1/rpc/process_indexed_json`;
      const path = "price;blockNumber;rsi";
      ("totalResultDiff");
      const headers = `["accept", "application/json", "apikey","${apiKey}"]`;
      const body = '{"input_index": 1, "input_json": {}}';
      const jobId = "168535c73f7b46cd8fd9a7f21bdbedc1";
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
      const decimals = new Decimal(10).pow(18);
      const action1 = 0;
    });
  });
  it("every method works with a strategy pow", async () => {
    const priceUpdater = new PriceUpdater();
    await priceUpdater.waitForReady(); // Wait for WebSocket to be ready

    const initalAmount = await getAmount(USDC, "150");
    const apiKey = process.env.API;
    const method = "POST";
    const url = `https://xpzyihmcunwwykjpfdgy.supabase.co/rest/v1/rpc/process_indexed_json`;
    const path = "price;blockNumber;rsi";
    ("totalResultDiff");
    const headers = `["accept", "application/json", "apikey","${apiKey}"]`;
    const body = '{"input_index": 1, "input_json": {}}';
    const jobId = "168535c73f7b46cd8fd9a7f21bdbedc1";
    const decimals = new Decimal(10).pow(18);

    const tx = await USDC.approve(vaultFactory.target, initalAmount.toFixed());
    await tx.wait();
    const APIInfos = [
      {
        method: method,
        url: url,
        headers: headers,
        body: body,
        path: path,
        jobIDs: jobId,
      },
      {
        method: method,
        url: url,
        headers: headers,
        body: body,
        path: path,
        jobIDs: jobId,
      },
      {
        method: method,
        url: url,
        headers: headers,
        body: body,
        path: path,
        jobIDs: jobId,
      },
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
    const strategies = await getStrategies(Helper);
    const vaultAddress = await vaultFactory.createVault.staticCall(
      USDC,
      initalAmount.toFixed(),
      APIInfos,
      strategies
    );
    const tx3 = await vaultFactory.createVault(
      USDC,
      initalAmount.toFixed(),
      APIInfos,
      strategies
    );
    await tx3.wait();
    // if (network.config.chainId != 31337) {
    //   await verify(vaultAddress, [], "contracts/AutoVault:AutoVault.sol");
    // }
    let autoVault = (await ethers.getContractAt(
      "AutoVault",
      vaultAddress,
      user
    )) as unknown as AutoVault;
    console.log(`Deployed autovault at ${autoVault.target}`);

    let requestID = await autoVault.executeStrategy.staticCall(0);
    let mostRecentPrice = undefined;
    while (mostRecentPrice == undefined) {
      mostRecentPrice = await priceUpdater.getPrice("0");
      setTimeout(() => {}, 500);
    }
    if (mostRecentPrice == undefined) throw "Failed to get price";
    console.log(`The msot recent price is ${mostRecentPrice.toString()}`);
    let price = new Decimal(mostRecentPrice);
    let rsi = new Decimal(25);
    await updateResponse(price, ethers.provider, rsi);
    console.log("Executing strategy", requestID);
    await new Promise((f) => setTimeout(f, 30000));
    const tx4 = await autoVault.executeStrategy(0);
    await tx4.wait();

    const tradesBefore = await GainsNetwork.getTrades(autoVault.target);
    console.log(`Trades before: ${tradesBefore}`);

    await waitForTradeUpdate(autoVault.target.toString(), 0);
    await new Promise((f) => setTimeout(f, 5000));

    mostRecentPrice = undefined;
    while (mostRecentPrice == undefined) {
      mostRecentPrice = await priceUpdater.getPrice("0");
      await new Promise((f) => setTimeout(f, 500));
    }
    if (mostRecentPrice == undefined) throw "Failed to get price";
    price = new Decimal(mostRecentPrice);
    rsi = new Decimal(95);
    await updateResponse(price, ethers.provider, rsi);
    const tx5 = await autoVault.executeStrategy(0);
    await tx5.wait();
    console.log(await autoVault.getC());
  });
  it("vault can update tp");
  it("vault can update sl");
  it("vault can updateLeverage");
  it("vault can decrease position size");

  async function waitForTradeUpdate(
    address: string,
    initialLength: number,
    timeout = 60000
  ) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const intervalId = setInterval(async () => {
        try {
          const tradesAfter = await GainsNetwork.getTrades(address);
          if (tradesAfter.length !== initialLength) {
            clearInterval(intervalId);
            resolve(tradesAfter);
          } else if (Date.now() - startTime > timeout) {
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

  async function getAmount(Token: ERC20, amount: string) {
    const x = await Token.decimals();
    const y = new Decimal(10).pow(x.toString());
    return new Decimal(amount).mul(y);
  }
  async function updateResponse(
    res: Decimal,
    provider: Provider,
    rsi: Decimal
  ) {
    const latestBlock = await provider.getBlock("latest");
    if (latestBlock == undefined) throw "undefined";
    const blockNumber = new Decimal(latestBlock.number.toString());
    // const x = new Decimal(10).pow(18);

    const body = `{"input_index": 1, "input_json": {"price": "${res.toFixed()}", "blockNumber":"${blockNumber.toFixed()}", "rsi": "${rsi.toFixed()}" }}`;
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
