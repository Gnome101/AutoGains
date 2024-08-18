// import { ethers, deployments, network } from "hardhat";
// import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// import {
//   AutoVault,
//   Helper,
//   IGainsNetwork,
//   VaultFactory,
// } from "../typechain-types";
// import { ERC20 } from "../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";
// import { Deployment } from "hardhat-deploy/dist/types";
// import { contracts } from "../Addresses";
// import { Decimal } from "decimal.js";
// import dotenv from "dotenv";
// import { PriceUpdater } from "../scripts/readTrades";
// import { getStrategies } from "./getStrategies";
// import { expect } from "chai";
// import { TradeStruct } from "../typechain-types/contracts/Gains Contracts/FakeGainsNetwork";
// import { BigNumberish, Provider } from "ethers";
// import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
// import { assert } from "console";
// import { execArgv } from "process";
// import { chownSync } from "fs";
// import {
//   calculateFeeOnRaw,
//   calculateFeeOnTotal,
//   toDecimal,
// } from "./vault-test";

// dotenv.config();

// // Profiler configuration
// const ENABLE_PROFILER = true;
// const profiler = {
//   start: (label: string) => {
//     if (ENABLE_PROFILER) console.time(label);
//   },
//   end: (label: string) => {
//     if (ENABLE_PROFILER) console.timeEnd(label);
//   },
// };

// describe("Live Testnet Vault Tests", function () {
//   let accounts: SignerWithAddress[];
//   let deployer: SignerWithAddress;
//   let user: SignerWithAddress;
//   let vaultFactory: VaultFactory;
//   let Helper: Helper;
//   let USDC: ERC20;
//   let GainsNetwork: IGainsNetwork;
//   let autoVault: AutoVault;
//   let priceUpdater: PriceUpdater;

//   before(async () => {
//     profiler.start("Setup Test Environment");

//     const chainID = network.config.chainId;
//     if (chainID == undefined) throw "Cannot find chainID";

//     accounts = await ethers.getSigners();
//     deployer = accounts[0];
//     console.log(deployer.address);
//     user = chainID == 31337 ? await getTestUser() : deployer;

//     // await deployments.fixture(["all"]);

//     const factoryContract = await deployments.get("VaultFactory");
//     vaultFactory = await ethers.getContractAt(
//       "VaultFactory",
//       factoryContract.address,
//       user
//     );

//     GainsNetwork = await ethers.getContractAt(
//       "IGainsNetwork",
//       contracts[chainID].GainsNetwork,
//       user
//     );

//     const helperContract = await deployments.get("Helper");
//     Helper = await ethers.getContractAt("Helper", helperContract.address, user);

//     USDC = (await ethers.getContractAt(
//       "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
//       contracts[chainID].USDC,
//       user
//     )) as unknown as ERC20;

//     priceUpdater = new PriceUpdater();
//     await priceUpdater.waitForReady();

//     profiler.end("Setup Test Environment");
//   });

//   before(async () => {
//     // profiler.start("Create Vault");
//     // const initialAmount = await getAmount(USDC, "300");
//     // await USDC.approve(vaultFactory.target, initialAmount.toFixed());
//     // const APIInfos = Array(4).fill(createAPIInfo());
//     // const strategies = await getStrategies(Helper);
//     // const vaultAddress = await vaultFactory.createVault.staticCall(
//     //   USDC,
//     //   initialAmount.toFixed(),
//     //   APIInfos,
//     //   strategies
//     // );
//     // await vaultFactory.createVault(
//     //   USDC,
//     //   initialAmount.toFixed(),
//     //   APIInfos,
//     //   strategies
//     // );
//     // autoVault = await ethers.getContractAt("AutoVault", vaultAddress, user);
//     // console.log(`Deployed AutoVault at ${autoVault.target}`);
//     // profiler.end("Create Vault");
//   });

//   describe("Live Vault Tests", function () {
//     it("User can deposit wdaw", async function () {
//       profiler.start("Get Most Recent Data");

//       //   console.log(
//       //     await getVaultTotalAssets("0x793448209Ef713CAe41437C7DaA219b59BEF1A4A")
//       //   );
//       //   console.log(
//       //     await getTradingVariables("0x793448209Ef713CAe41437C7DaA219b59BEF1A4A")
//       //   );
//       await getVaultTotalAssets("0x793448209Ef713CAe41437C7DaA219b59BEF1A4A");

//       profiler.end("Get Most Recent Data");

//       //   await testAction("Deposit");
//     });

//     // it("Strategy 4: Open and Cancel Order", async function () {
//     //   await testStrategy(3, verifyOpenOrder, verifyCancelOrder);
//     // });
//   });

//   async function testAction(actionName: string) {
//     profiler.start(`Test Strategy ${actionName}`);

//     const initialTrade = await getLastTrade();

//     await executeStrategyWithPrice(0, 25);
//     const tradeTwo = await waitForTradeUpdate(initialTrade);
//     console.log("Trades 0:", initialTrade, tradeTwo);
//     verifyOpenLong(initialTrade, tradeTwo);
//     //Now we know that a trade exists, we can see if the deposit function works
//     //First we need to determine the totalVault assets:

//     profiler.end(`Test Strategy ${actionName}`);
//   }

//   async function executeStrategyWithPrice(strategyIndex: number, rsi: number) {
//     const price = await getPriceFromUpdater();
//     await updateResponse(new Decimal(price), ethers.provider, new Decimal(rsi));
//     await autoVault.executeStrategy(strategyIndex);
//     // Wait for the strategy execution to be processed
//     // await new Promise((f) => setTimeout(f, 30000));
//   }

//   // Verification functions for each strategy
//   function verifyOpenLong(tradeBefore: any, tradeAfter: any) {
//     //This needs to go from no trade, to a trade
//     expect(tradeAfter.long).to.be.true;
//     expect(tradeAfter.leverage).to.be.eql("5000");
//   }

//   function verifyClose(tradeBefore: any, tradeAfter: any) {
//     //This needs to go from no trade, to a trade
//     expect(JSON.stringify(tradeAfter)).to.be.eql("{}");
//   }
//   function verifyUpdateSL(beforeTrade: any, tradeAfter: any) {
//     expect(tradeAfter.sl).to.not.equal(beforeTrade.sl);
//   }
//   function verifyUpdateTP(beforeTrade: any, tradeAfter: any) {
//     expect(tradeAfter.tp).to.not.equal(beforeTrade.tp);
//   }

//   function verifyUpdateLeverage(beforeTrade: any, tradeAfter: any) {
//     expect(beforeTrade.leverage).to.be.eql("5000");
//     expect(tradeAfter.leverage).to.be.eql("12000");
//     expect(tradeAfter.leverage).to.not.equal(beforeTrade.leverage);
//   }

//   function verifyDecreasedPosition(beforeTrade: any, tradeAfter: any) {
//     expect(Number(tradeAfter.collateralAmount)).to.be.lessThan(
//       Number(beforeTrade.collateralAmount)
//     );
//   }
//   function verifyIncreasedPosition(beforeTrade: any, tradeAfter: any) {
//     expect(Number(tradeAfter.collateralAmount)).to.be.greaterThan(
//       Number(beforeTrade.collateralAmount)
//     );
//   }

//   function verifyOpenOrder(tradeBefore: any, tradeAfter: Trade) {
//     expect(tradeAfter.tradeType).to.equal("1");
//   }

//   function verifyUpdateOrder(tradeBefore: any, tradeAfter: any) {
//     expect(tradeAfter.openPrice).to.not.equal(tradeBefore.openPrice);
//   }

//   function verifyCancelOrder(tradeBefore: any, tradeAfter: any) {
//     expect(JSON.stringify(tradeBefore)).to.not.equal("{}");
//     expect(JSON.stringify(tradeAfter)).to.equal("{}");
//   }
//   interface Trade {
//     user: string;
//     index: string;
//     pairIndex: string;
//     leverage: string;
//     long: boolean;
//     isOpen: boolean;
//     collateralIndex: string;
//     tradeType: string;
//     collateralAmount: string;
//     openPrice: string;
//     tp: string;
//     sl: string;
//     __placeholder: string;
//   }
//   // Helper functions
//   async function getLastTrade(): Promise<Trade> {
//     const trades = await GainsNetwork.getTrades(autoVault.target);
//     if (trades.length == 0) return {} as Trade;
//     const lastTrade = trades[trades.length - 1];
//     return {
//       user: lastTrade.user,
//       index: lastTrade.index.toString(),
//       pairIndex: lastTrade.pairIndex.toString(),
//       leverage: lastTrade.leverage.toString(),
//       long: lastTrade.long,
//       isOpen: lastTrade.isOpen,
//       collateralIndex: lastTrade.collateralIndex.toString(),
//       tradeType: lastTrade.tradeType.toString(),
//       collateralAmount: lastTrade.collateralAmount.toString(),
//       openPrice: lastTrade.openPrice.toString(),
//       tp: lastTrade.tp.toString(),
//       sl: lastTrade.sl.toString(),
//       __placeholder: lastTrade.__placeholder.toString(),
//     };
//   }

//   // Helper functions
//   async function getTestUser() {
//     await network.provider.request({
//       method: "hardhat_impersonateAccount",
//       params: ["0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"],
//     });
//     return ethers.getSigner("0x793448209Ef713CAe41437C7DaA219b59BEF1A4A");
//   }

//   function createAPIInfo() {
//     return {
//       method: "POST",
//       url: `https://xpzyihmcunwwykjpfdgy.supabase.co/rest/v1/rpc/process_indexed_json`,
//       headers: `["accept", "application/json", "apikey","${process.env.API}"]`,
//       body: '{"input_index": 1, "input_json": {}}',
//       path: "price;blockNumber;rsi",
//       jobIDs: "168535c73f7b46cd8fd9a7f21bdbedc1",
//     };
//   }

//   async function getAmount(Token: ERC20, amount: string) {
//     const decimals = await Token.decimals();
//     return new Decimal(amount).mul(new Decimal(10).pow(decimals.toString()));
//   }

//   async function getPriceFromUpdater() {
//     let price;
//     while (price == undefined) {
//       price = await priceUpdater.getPrice("0");
//       await new Promise((f) => setTimeout(f, 500));
//     }
//     return price;
//   }

//   async function waitForTradeUpdate(
//     previousTrade: TradeStruct,
//     timeout = 70000
//   ): Promise<TradeStruct> {
//     return new Promise((resolve, reject) => {
//       const startTime = Date.now();
//       const intervalId = setInterval(async () => {
//         try {
//           const lastTrade = await getLastTrade();

//           console.log(
//             JSON.stringify(lastTrade),
//             "|",
//             JSON.stringify(previousTrade)
//           );
//           console.log(await autoVault.getC());
//           if (JSON.stringify(lastTrade) != JSON.stringify(previousTrade)) {
//             clearInterval(intervalId);
//             resolve(lastTrade);
//           }
//           if (Date.now() - startTime > timeout) {
//             clearInterval(intervalId);
//             reject(new Error("Timeout waiting for trade update"));
//           }
//         } catch (error) {
//           clearInterval(intervalId);
//           reject(error);
//         }
//       }, 5000);
//     });
//   }

//   async function updateResponse(
//     res: Decimal,
//     provider: Provider,
//     rsi: Decimal
//   ) {
//     const latestBlock = await provider.getBlock("latest");
//     if (latestBlock == undefined) throw "undefined";
//     const blockNumber = new Decimal(latestBlock.number.toString());
//     // const x = new Decimal(10).pow(18);

//     const body = `{"input_index": 1, "input_json": {"price": "${res.toFixed()}", "blockNumber":"${blockNumber.toFixed()}", "rsi": "${rsi.toFixed()}" }}`;
//     console.log(body);
//     const headers = `["Content-Type", "application/json", "apikey","${process.env.API}"]`;
//     const parsedHeaders: Record<string, string> = {};
//     const headerArray: string[] = JSON.parse(headers);

//     for (let i = 0; i < headerArray.length; i += 2) {
//       if (headerArray[i].toLowerCase() === "accept") {
//         parsedHeaders["Content-Type"] = headerArray[i + 1];
//       } else {
//         parsedHeaders[headerArray[i]] = headerArray[i + 1];
//       }
//     }
//     const config: AxiosRequestConfig = {
//       method: "POST" as Method,
//       url: `https://xpzyihmcunwwykjpfdgy.supabase.co/rest/v1/rpc/process_indexed_json`,
//       headers: parsedHeaders,
//       data: body ? JSON.parse(body) : undefined,
//     };

//     const response = await axios(config);
//     return response.data;
//   }
//   async function previewDeposit(
//     autoVault: AutoVault,
//     runner: string,
//     depositAmount: Decimal
//   ): Promise<Decimal> {
//     profiler.start(`Preview Deposit`);

//     const totalAssets = await getVaultTotalAssets(autoVault.target.toString());
//     const totalSupply = new Decimal((await autoVault.totalSupply()).toString());

//     const entryFee = toDecimal(await autoVault.ENTRY_FEE());
//     const MOVEMENT_FEE_SCALE = new Decimal(10 ** 4);
//     const minFee = toDecimal(await autoVault.vaultActionFee());
//     let expectedFee = calculateFeeOnTotal(
//       depositAmount,
//       entryFee,
//       MOVEMENT_FEE_SCALE,
//       minFee
//     );
//     const vaultManager = await autoVault.vaultManager();
//     if (vaultManager == runner) {
//       expectedFee = expectedFee.sub(expectedFee.dividedBy("2").ceil());
//     }

//     const expectedShares = depositAmount
//       .sub(expectedFee)
//       .mul(totalSupply.plus(1))
//       .dividedBy(totalAssets.plus(1))
//       .floor();
//     profiler.end(`Preview Deposit`);
//     return expectedShares;
//   }
//   async function previewMint(
//     autoVault: AutoVault,
//     runner: string,
//     mintAmount: Decimal
//   ): Promise<Decimal> {
//     profiler.start(`Preview Deposit`);

//     const totalAssets = await getVaultTotalAssets(autoVault.target.toString());
//     const totalSupply = new Decimal((await autoVault.totalSupply()).toString());

//     const entryFee = toDecimal(await autoVault.ENTRY_FEE());
//     const MOVEMENT_FEE_SCALE = new Decimal(10 ** 4);
//     const minFee = toDecimal(await autoVault.vaultActionFee());

//     const expectedAssetsPaid = mintAmount
//       .mul(totalAssets.plus(1))
//       .dividedBy(totalSupply.plus(1))
//       .ceil();

//     let expectedFee = calculateFeeOnRaw(
//       expectedAssetsPaid,
//       entryFee,
//       MOVEMENT_FEE_SCALE,
//       minFee
//     );
//     const vaultManager = await autoVault.vaultManager();
//     if (vaultManager == runner) {
//       expectedFee = expectedFee.sub(expectedFee.dividedBy("2").ceil());
//     }

//     profiler.end(`Preview Deposit`);
//     return expectedAssetsPaid.plus(expectedFee);
//   }
//   async function previewWithdraw(
//     autoVault: AutoVault,
//     runner: string,
//     withdrawAmount: Decimal
//   ): Promise<Decimal> {
//     profiler.start(`Preview Deposit`);

//     const totalAssets = await getVaultTotalAssets(autoVault.target.toString());
//     const totalSupply = new Decimal((await autoVault.totalSupply()).toString());

//     const exitFee = toDecimal(await autoVault.EXIT_FEE());
//     const MOVEMENT_FEE_SCALE = new Decimal(10 ** 4);
//     const minFee = toDecimal(await autoVault.vaultActionFee());
//     let expectedFee = calculateFeeOnRaw(
//       withdrawAmount,
//       exitFee,
//       MOVEMENT_FEE_SCALE,
//       minFee
//     );
//     const vaultManager = await autoVault.vaultManager();
//     if (vaultManager == runner) {
//       expectedFee = expectedFee.sub(expectedFee.dividedBy("2").ceil());
//     }

//     const expectedSoldShares = withdrawAmount
//       .plus(expectedFee)
//       .mul(totalSupply.plus(1))
//       .dividedBy(totalAssets.plus(1))
//       .ceil();

//     profiler.end(`Preview Deposit`);
//     return expectedSoldShares;
//   }
//   async function previewRedeem(
//     autoVault: AutoVault,
//     runner: string,
//     redeemAmount: Decimal
//   ): Promise<Decimal> {
//     profiler.start(`Preview Deposit`);

//     const totalAssets = await getVaultTotalAssets(autoVault.target.toString());
//     const totalSupply = new Decimal((await autoVault.totalSupply()).toString());

//     const exitFee = toDecimal(await autoVault.EXIT_FEE());
//     const MOVEMENT_FEE_SCALE = new Decimal(10 ** 4);
//     const minFee = toDecimal(await autoVault.vaultActionFee());

//     let expectedAssetsEarned = redeemAmount
//       .mul(totalAssets.plus(1))
//       .dividedBy(totalSupply.plus(1))
//       .floor();

//     let expectedFee = calculateFeeOnTotal(
//       expectedAssetsEarned,
//       exitFee,
//       MOVEMENT_FEE_SCALE,
//       minFee
//     );
//     const vaultManager = await autoVault.vaultManager();
//     if (vaultManager == runner) {
//       expectedFee = expectedFee.sub(expectedFee.dividedBy("2").ceil());
//     }

//     profiler.end(`Preview Deposit`);
//     return expectedAssetsEarned.sub(expectedFee);
//   }

//   async function getVaultTotalAssets(vaultAddress: string): Promise<Decimal> {
//     const info = await Promise.all([
//       getTradingVariables(vaultAddress),
//       getTokenAssets(vaultAddress),
//     ]);
//     console.log(info);
//     return new Decimal(info[0].latestPrices).plus(info[1]);
//   }
//   async function getTokenAssets(vaultAddress: string): Promise<Decimal> {
//     const autoVault = await ethers.getContractAt("AutoVault", vaultAddress);
//     const amount = await (
//       await ethers.getContractAt(
//         "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
//         await autoVault.asset()
//       )
//     ).balanceOf(autoVault.target);

//     return new Decimal(amount.toString());
//   }
//   interface TradingVariablesRequest {
//     userAddress: string;
//   }
//   interface TradingVariablesResponse {
//     totalCollateral: string;
//     totalResultDiff: string;
//     pnlArray: string[];
//     collateralArray: string[];
//     pairPrices: string[];
//     blockNumber: string;
//     latestPrices: string[];
//     newCollateralArray: string[];
//     totalnewCollateral: string;
//   }
//   async function getTradingVariables(userAddress: string): Promise<any> {
//     const url =
//       "https://xpzyihmcunwwykjpfdgy.supabase.co/functions/v1/get-trading-variables";
//     const headers = {
//       Authorization: `${process.env.LUKE_API}`,
//       "Content-Type": "application/json",
//     };
//     const data: TradingVariablesRequest = { userAddress };

//     try {
//       const response: AxiosResponse<TradingVariablesResponse> =
//         await axios.post(url, data, { headers });
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error("Axios error:", error.response?.data || error.message);
//       } else {
//         console.error("Unexpected error:", error);
//       }
//       throw error;
//     }
//   }

//   // Usage example:
//   // getTradingVariables('0x793448209Ef713CAe41437C7DaA219b59BEF1A4A')
//   //   .then(response => console.log(response))
//   //   .catch(error => console.error('Error:', error));
// });
