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

    // await deployments.fixture(["all"]);

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

  it("strategy works as expected pow", async () => {
    const initalAmount = await getAmount(USDC, "150");
    const apiKey = process.env.LUKE_API;
    const method = "POST";
    const url = `https://xpzyihmcunwwykjpfdgy.supabase.co/functions/v1/rsi-price-query`;
    const path = "data,0,price;blockNumber;data,0,rsi";
    const headers = `["accept", "application/json", "Authorization","${apiKey}"]`;
    const body = '{"symbols": [0], "period": 90}';
    const jobId = "168535c73f7b46cd8fd9a7f21bdbedc1";
    const decimals = new Decimal(10).pow(10);

    // const tx = await USDC.approve(vaultFactory.target, initalAmount.toFixed());
    // await tx.wait();
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
    const longAction = await Helper.createOpenTradeAction(
      10000, // maxSlippage
      0, // pairIndex (BTC)
      5000, // leverage (5x)
      true, // long
      true, // isOpen
      3, // collateralType (USDC)
      0, // orderType (Market)
      800000, // collateralPercent (2%)
      1000000, // openPricePercent
      1200000, // takeProfitPercent
      800000 // stopLossPercent
    );

    // Short action when RSI > 70
    const shortAction = await Helper.createOpenTradeAction(
      10000,
      0,
      5000,
      false, // short
      true,
      3,
      0,
      800000,
      1050000,
      800000, // TP is lower for short
      1200000 // SL is higher for short
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
      new Decimal(45).mul(decimals).toFixed(),
      0,
      longAction,
      18,
      15,
      1,
      2,
      0,
      new Decimal(65).mul(decimals).toFixed(),
      0,
      shortAction,
      18,
      16,
      15,
      1,
      2,
      0,
      new Decimal(50).mul(decimals).toFixed(),
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
      initalAmount.toFixed(),
      APIInfos,
      [strategy] as number[][]
    );
    const tx3 = await vaultFactory.createVault(
      USDC,
      initalAmount.toFixed(),
      APIInfos,
      [strategy]
    );
    await tx3.wait();
    let autoVault = (await ethers.getContractAt(
      "AutoVault",
      vaultAddress,
      user
    )) as unknown as AutoVault;
    console.log(`Deployed autovault at ${autoVault.target}`);
    let requestID = await autoVault.executeStrategy.staticCall(0);
    // const tx4 = await autoVault.executeStrategy(0);
    // await tx4.wait();
    const tradesBefore = await GainsNetwork.getTrades(autoVault.target);
    console.log(`Trades before: ${tradesBefore}`);

    const requestPromise = new Promise<string>((resolve) => {
      autoVault.once(
        autoVault.getEvent("ChainlinkFulfilled"),
        async (requestId: string) => {
          const tradesAfter = await GainsNetwork.getTrades(autoVault.target);
          console.log(`Trades after: ${tradesAfter}`);
          resolve(requestId);
        }
      );
    });
    return new Promise((resolve) => {
      const intervalId = setInterval(async () => {
        try {
          const r = await autoVault.getC();
          console.log("Response:", r.toString());
        } catch (error) {
          console.error("Error querying response:", error);
        }
      }, 5000);

      // Set up a handler for the SIGINT signal (Ctrl+C)
      process.on("SIGINT", () => {
        clearInterval(intervalId);
        console.log("Continuous query stopped.");
        resolve();
      });
    });
  });
});

async function getAmount(Token: ERC20, amount: string) {
  const x = await Token.decimals();
  const y = new Decimal(10).pow(x.toString());
  return new Decimal(amount).mul(y);
}
