// import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
// import { expect, assert } from "chai";
// //@ts-ignore
// import { ethers, deployments, userConfig, network } from "hardhat";
// import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// import {
//   AutoVault,
//   ERC20,
//   Helper,
//   IGainsNetwork,
//   VaultFactory,
//   FakeGainsNetwork,
// } from "../typechain-types";
// import { Deployment } from "hardhat-deploy/dist/types";
// import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object
// import { impersonateOracleFulfill } from "../utils/AutoGains";
// import { erc20 } from "../typechain-types/@openzeppelin/contracts/token";
// import { Decimal } from "decimal.js";
// import dotenv from "dotenv";
// import { TradeStruct } from "../typechain-types/contracts/Gains Contracts/IGainsNetwork";
// import { trace } from "console";

// dotenv.config();

// describe("AutoGains Tests", function () {
//   let accounts: SignerWithAddress[];
//   let deployer: SignerWithAddress;
//   let user: SignerWithAddress;

//   let vaultFactory: VaultFactory;
//   let Helper: Helper;

//   let USDC: ERC20;
//   let WETH: ERC20;
//   let DAI: ERC20;
//   let userAddress: string;
//   let GainsNetwork: IGainsNetwork;
//   let FakeGainsNetwork: FakeGainsNetwork;

//   beforeEach(async () => {
//     const chainID = network.config.chainId;
//     if (chainID == undefined) throw "Cannot find chainID";

//     accounts = (await ethers.getSigners()) as unknown as SignerWithAddress[]; // could also do with getNamedAccounts
//     deployer = accounts[0];
//     if (chainID == 31337) {
//       await network.provider.request({
//         method: "hardhat_impersonateAccount",
//         params: ["0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"],
//       });
//       user = await ethers.getSigner(
//         "0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"
//       ); //Test account with money
//       userAddress = await user.getAddress();
//     } else {
//       userAddress = await deployer.getAddress();
//       user = deployer;
//     }

//     await deployments.fixture(["Harness"]);

//     // const testContract = (await deployments.get("Test")) as Deployment;

//     // test = (await ethers.getContractAt(
//     //   "Test",
//     //   testContract.address.toString()
//     // )) as unknown as Test;

//     const fakeGainsContract = (await deployments.get(
//       "FakeGainsNetwork"
//     )) as Deployment;

//     FakeGainsNetwork = (await ethers.getContractAt(
//       "FakeGainsNetwork",
//       fakeGainsContract.address.toString(),
//       user
//     )) as unknown as FakeGainsNetwork;

//     GainsNetwork = (await ethers.getContractAt(
//       "IGainsNetwork",
//       contracts[chainID].GainsNetwork,
//       user
//     )) as unknown as IGainsNetwork;

//     const factoryContract = (await deployments.get(
//       "VaultFactory"
//     )) as Deployment;

//     vaultFactory = (await ethers.getContractAt(
//       "VaultFactory",
//       factoryContract.address.toString(),
//       user
//     )) as unknown as VaultFactory;

//     const helperContract = (await deployments.get("Helper")) as Deployment;

//     Helper = (await ethers.getContractAt(
//       "Helper",
//       helperContract.address.toString(),
//       user
//     )) as unknown as Helper;

//     USDC = (await ethers.getContractAt(
//       "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
//       contracts[chainID].USDC,
//       user
//     )) as unknown as ERC20;
//     WETH = (await ethers.getContractAt(
//       "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
//       contracts[chainID].WETH,
//       user
//     )) as unknown as ERC20;
//     DAI = (await ethers.getContractAt(
//       "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
//       contracts[chainID].DAI,
//       user
//     )) as unknown as ERC20;
//     await vaultFactory
//       .connect(deployer)
//       .setGainsAddress(FakeGainsNetwork.target);
//   });
//   // it("all contract exist", async () => {
//   //   assert.ok(vaultFactory.target);
//   //   assert.ok(USDC.target);
//   //   assert.ok(WETH.target);
//   //   assert.ok(DAI.target);
//   // });

//   // it("can create a vault ", async () => {
//   //   const initalAmount = await getAmount(USDC, "10");
//   //   await USDC.approve(vaultFactory.target, initalAmount.toFixed());
//   //   const vaultAddress = await vaultFactory.createVault.staticCall(
//   //     USDC,
//   //     initalAmount.toFixed(),
//   //     [],
//   //     [],
//   //     [],
//   //     []
//   //   );

//   //   await vaultFactory.createVault(
//   //     USDC,
//   //     initalAmount.toFixed(),
//   //     [],
//   //     [],
//   //     [],
//   //     []
//   //   );
//   //   let autoVault = (await ethers.getContractAt(
//   //     "AutoVault",
//   //     vaultAddress,
//   //     user
//   //   )) as unknown as AutoVault;

//   //   const userVaultBalance = await autoVault.balanceOf(userAddress);

//   //   //Assuming a deposit fee of 0
//   //   //With Deposit Fees, userVaultBalance - userVaultBalance * DepositFee = initalAmount
//   //   //My balance should be equal to the inital deposit
//   //   assert.equal(
//   //     userVaultBalance.toString(),
//   //     initalAmount.toFixed(),
//   //     `Actual Vault Balance is different than expected`
//   //   );
//   // });
//   it("can create a vault with 2 strategies ", async () => {
//     const initalAmount = await getAmount(USDC, "10");
//     const apiKey = process.env.LUKE_API;
//     const method = "POST";
//     const url = `https://xpzyihmcunwwykjpfdgy.supabase.co/rest/v1/rpc/api_calculate_rsi?apikey=${apiKey}&symbol_arg=0`;
//     const path = `price;rsi`;
//     const headers =
//       '["accept", "application/json", "Authorization",""]';
//     const body = '{"symbol": 0, "period": 14}';
//     const jobId = "a8356f48569c434eaa4ac5fcb4db5cc0";

//     await USDC.approve(vaultFactory.target, initalAmount.toFixed());

//     const APIInfos = [
//       {
//         method: method,
//         url: url,
//         headers: headers,
//         body: body,
//         path: path,
//         jobIDs: jobId,
//       },
//       {
//         method: method,
//         url: url,
//         headers: headers,
//         body: body,
//         path: path,
//         jobIDs: jobId,
//       },
//     ] as VaultFactory.APIInfoStruct[];
//     //According to ChatGPT, if RSI is above 70 then its too high. If its below 30 then its too low
//     //So what I will do is have two strategies, if the RSI goes to 50 then it will close either position
//     //if 70 < x1 then longBTC else do nothing
//     const longAciton = await Helper.createOpenTradeAction(
//       1000,
//       0,
//       5000,
//       true,
//       true,
//       3,
//       0,
//       200000, // Should be 2%
//       10000000,
//       12000000,
//       8000000
//     );
//     const decimals = new Decimal(10).pow(18);
//     const longStrategy = [
//       18,
//       15,
//       1,
//       1,
//       0,
//       new Decimal(70).mul(decimals).toFixed(),
//       0,
//       longAciton,
//       0,
//       0,
//     ];

//     const shortAction = await Helper.createOpenTradeAction(
//       1000,
//       0,
//       5000,
//       false,
//       true,
//       3,
//       0,
//       200000,
//       10000000,
//       12000000,
//       8000000 // Should  be 2%
//     );
//     const shortStrategy = [
//       18,
//       14,
//       1,
//       1,
//       0,
//       new Decimal(30).mul(decimals).toFixed(),
//       0,
//       shortAction,
//       0,
//       0,
//     ];

//     let listOfStrategies = [[]] as number[][];
//     const vaultAddress = await vaultFactory.createVault.staticCall(
//       USDC,
//       initalAmount.toFixed(),
//       APIInfos,
//       [longStrategy, shortStrategy] as number[][]
//     );
//     await vaultFactory.createVault(USDC, initalAmount.toFixed(), APIInfos, [
//       longStrategy,
//       shortStrategy,
//     ]);
//     let autoVault = (await ethers.getContractAt(
//       "AutoVault",
//       vaultAddress,
//       user
//     )) as unknown as AutoVault;

//     const userVaultBalance = await autoVault.balanceOf(userAddress);

//     //Assuming a deposit fee of 0
//     //With Deposit Fees, userVaultBalance - userVaultBalance * DepositFee = initalAmount
//     //My balance should be equal to the inital deposit
//     assert.equal(
//       userVaultBalance.toString(),
//       initalAmount.toFixed(),
//       `Actual Vault Balance is different than expected`
//     );
//     assert.equal(
//       (await USDC.balanceOf(autoVault.target)).toString(),
//       initalAmount.toFixed()
//     );
//   });

//   describe("Strategies ", function () {
//     let AutoVault: AutoVault;
//     const decimals = new Decimal(10).pow(18);
//     beforeEach(async () => {
//       const initalAmount = await getAmount(USDC, "100");
//       const apiKey = process.env.LUKE_API;

//       const method = "POST";
//       const url = `https://xpzyihmcunwwykjpfdgy.supabase.co/functions/v1/rsi-price-query`;
//       const path = `price;rsi`;
//       const headers = `["accept", "application/json", "Authorization","${apiKey}"]`;

//       const body = '{"symbol": 0, "period": 14}';
//       const jobId = "168535c73f7b46cd8fd9a7f21bdbedc1";

//       const tx1 = await USDC.approve(
//         vaultFactory.target,
//         initalAmount.toFixed()
//       );
//       await tx1.wait();
//       const APIInfos = [
//         {
//           method: method,
//           url: url,
//           headers: headers,
//           body: body,
//           path: path,
//           jobIDs: jobId,
//         },
//         {
//           method: method,
//           url: url,
//           headers: headers,
//           body: body,
//           path: path,
//           jobIDs: jobId,
//         },
//       ] as VaultFactory.APIInfoStruct[];

//       //According to ChatGPT, if RSI is above 70 then its too high. If its below 30 then its too low
//       //So what I will do is have two strategies, if the RSI goes to 50 then it will close either position
//       //if 70 < x1 then longBTC else do nothing
//       const longAciton = await Helper.createOpenTradeAction(
//         10000,
//         0,
//         5000,
//         true,
//         true,
//         3,
//         1,
//         550000, // Should be 2%
//         1000000,
//         1200000,
//         800000
//       );
//       const longStrategy = [0, longAciton];

//       const shortAction = await Helper.createOpenTradeAction(
//         1000,
//         0,
//         5000,
//         false,
//         true,
//         3,
//         0,
//         200000,
//         1000000,
//         1200000,
//         800000 // Should  be 2%
//       );
//       const shortStrategy = [
//         18,
//         15,
//         1,
//         1,
//         0,
//         new Decimal(70).mul(decimals).toFixed(),
//         0,
//         shortAction,
//         0,
//         0,
//       ];

//       let listOfStrategies = [[]] as number[][];
//       const vaultAddress = await vaultFactory.createVault.staticCall(
//         USDC,
//         initalAmount.toFixed(),
//         APIInfos,
//         [longStrategy, shortStrategy] as number[][]
//       );
//       const tx2 = await vaultFactory.createVault(
//         USDC,
//         initalAmount.toFixed(),
//         APIInfos,
//         [longStrategy, shortStrategy]
//       );
//       await tx2.wait();

//       AutoVault = (await ethers.getContractAt(
//         "AutoVault",
//         vaultAddress,
//         user
//       )) as unknown as AutoVault;

//       const userVaultBalance = await AutoVault.balanceOf(userAddress);

//       //Assuming a deposit fee of 0
//       //With Deposit Fees, userVaultBalance - userVaultBalance * DepositFee = initalAmount
//       //My balance should be equal to the inital deposit
//       assert.equal(
//         userVaultBalance.toString(),
//         initalAmount.toFixed(),
//         `Actual Vault Balance is different than expected`
//       );
//     });

//     it("can execute a trade ", async () => {
//       const requestID = await AutoVault.executeStrategy.staticCall(0);
//       console.log(requestID, AutoVault.target);
//       const tx3 = await AutoVault.executeStrategy(0);
//       await tx3.wait();
//       const counters = await GainsNetwork.getCounters(AutoVault.target, 0);
//       const currentIndex = counters.currentIndex;

//       const chainID = network.config.chainId;
//       if (chainID == undefined) throw "Cannot find chainID";

//       let input = [
//         new Decimal(65).mul(decimals).toFixed(),
//         new Decimal(75).mul(decimals).toFixed(),
//       ];
//       const totalAssetsBefore = new Decimal(
//         (await AutoVault.totalAssets()).toString()
//       );

//       await impersonateOracleFulfill(AutoVault, requestID, input);

//       const trades = await FakeGainsNetwork.getTrades(AutoVault.target);

//       const totalAssetsAfter = new Decimal(
//         (await AutoVault.totalAssets()).toString()
//       );

//       assert.equal(totalAssetsAfter.sub(totalAssetsBefore).toFixed(), "0"); //They should be the same
//     });
//     it("a user can deposit more into a vault ", async () => {
//       const additionalAmount = await getAmount(USDC, "10");
//       const balanceBefore = await AutoVault.balanceOf(userAddress);
//       await USDC.approve(AutoVault.target, additionalAmount.toFixed());
//       await AutoVault.deposit(additionalAmount.toFixed(), userAddress);

//       const balanceAfter = new Decimal(
//         (await AutoVault.balanceOf(userAddress)).toString()
//       );
//       const shares = await AutoVault.convertToShares(
//         additionalAmount.toFixed()
//       );
//       assert.equal(
//         balanceAfter.sub(balanceBefore.toString()).toFixed(),
//         shares.toString()
//       );
//     });

//     //When you put funds in, you receive shares according to how much is left.
//     //And you recieve coupons that purchase the result of a given position
//     //The issue with this is that if someone know that coupon was worth 2x the inital collateral they could but it for that much

//     it("a user can withdraw even with an active trade egg", async () => {
//       const requestID = await AutoVault.executeStrategy.staticCall(0);
//       console.log(requestID, AutoVault.target);
//       const tx3 = await AutoVault.executeStrategy(0);
//       await tx3.wait();
//       const counters = await GainsNetwork.getCounters(AutoVault.target, 0);
//       const currentIndex = counters.currentIndex;

//       const chainID = network.config.chainId;
//       if (chainID == undefined) throw "Cannot find chainID";

//       let input = [
//         new Decimal(65).mul(decimals).toFixed(),
//         new Decimal(75).mul(decimals).toFixed(),
//       ];
//       const totalAssetsBefore = new Decimal(
//         (await AutoVault.totalAssets()).toString()
//       );

//       await impersonateOracleFulfill(AutoVault, requestID, input);

//       const tradesBefore = await FakeGainsNetwork.getTrades(AutoVault.target);
//       const shareBalance = await AutoVault.balanceOf(userAddress);
//       await AutoVault.redeem(shareBalance.toString(), userAddress, userAddress);
//       const tradesAfter = await FakeGainsNetwork.getTrades(AutoVault.target);

//       console.log(tradesAfter, tradesBefore);
//     });
//   });

//   // it("number actually comes back right bbq", async function () {
//   //   this.timeout(0); // Disable the timeout for this test

//   //   let tx = await test256.request();
//   //   await tx.wait();

//   //   console.log("Starting continuous query. Press Ctrl+C to stop.");

//   //   return new Promise((resolve) => {
//   //     const intervalId = setInterval(async () => {
//   //       try {
//   //         const r = await test256.getResponse();
//   //         console.log("Response:", r.toString());
//   //       } catch (error) {
//   //         console.error("Error querying response:", error);
//   //       }
//   //     }, 5000);

//   //     // Set up a handler for the SIGINT signal (Ctrl+C)
//   //     process.on("SIGINT", () => {
//   //       clearInterval(intervalId);
//   //       console.log("Continuous query stopped.");
//   //       resolve();
//   //     });
//   //   });
//   // });
// });

// async function getAmount(Token: ERC20, amount: string) {
//   const x = await Token.decimals();
//   const y = new Decimal(10).pow(x.toString());
//   return new Decimal(amount).mul(y);
// }
