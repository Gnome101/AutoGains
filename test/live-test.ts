// import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
// import { expect, assert } from "chai";
// //@ts-ignore
// import { ethers, deployments, userConfig, network } from "hardhat";
// import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// import {
//   AutoVault,
//   ERC20,
//   FakeGainsNetwork,
//   Helper,
//   IGainsNetwork,
//   VaultFactory,
// } from "../typechain-types";
// import { Deployment } from "hardhat-deploy/dist/types";
// import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object
// import { impersonateOracleFulfill } from "../utils/AutoGains";
// import { erc20 } from "../typechain-types/@openzeppelin/contracts/token";
// import { Decimal } from "decimal.js";
// import dotenv from "dotenv";
// import { TradeStruct } from "../typechain-types/contracts/Gains Contracts/IGainsNetwork";
// import { trace } from "console";
// import { gainsContracts } from "../typechain-types/contracts";

// dotenv.config();

// describe("Strategy Tests ", function () {
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

//     // await deployments.fixture(["Harness"]);

//     const factoryContract = (await deployments.get(
//       "VaultFactory"
//     )) as Deployment;

//     vaultFactory = (await ethers.getContractAt(
//       "VaultFactory",
//       factoryContract.address.toString(),
//       user
//     )) as unknown as VaultFactory;
//     GainsNetwork = (await ethers.getContractAt(
//       "IGainsNetwork",
//       contracts[chainID].GainsNetwork,
//       user
//     )) as unknown as IGainsNetwork;
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
//   });

//   it("strategy works as expected ", async () => {
//     const initalAmount = await getAmount(USDC, "10");
//     const apiKey = process.env.LUKE_API;
//     const method = "POST";
//     const url = `https://xpzyihmcunwwykjpfdgy.supabase.co/functions/v1/rsi-price-query`;
//     const path = `price;rsi`;
//     const headers = `["accept", "application/json", "Authorization","${apiKey}"]`;
//     const body = '{"symbol": 0, "period": 14}';
//     const jobId = "168535c73f7b46cd8fd9a7f21bdbedc1";

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
//     const decimals = new Decimal(10).pow(10);
//     //If x2 < 70 * decimals then return long action else return 0
//     const longStrategy = [
//       18,
//       14,
//       1,
//       1,
//       0,
//       new Decimal(30).mul(decimals).toFixed(),
//       0,
//       longAciton,
//       0,
//       0,
//     ];

//     const vaultAddress = await vaultFactory.createVault.staticCall(
//       USDC,
//       initalAmount.toFixed(),
//       APIInfos,
//       [longStrategy] as number[][]
//     );
//     await vaultFactory.createVault(USDC, initalAmount.toFixed(), APIInfos, [
//       longStrategy,
//     ]);

//     let autoVault = (await ethers.getContractAt(
//       "AutoVault",
//       vaultAddress,
//       user
//     )) as unknown as AutoVault;

//     let requestID = await autoVault.executeStrategy.staticCall(0);
//     const tx3 = await autoVault.executeStrategy(0);
//     await tx3.wait();
//     const tradesBefore = await GainsNetwork.getTrades(userAddress);

//     const requestPromise = new Promise<string>((resolve) => {
//       autoVault.once(
//         autoVault.getEvent("ChainlinkFulfilled"),
//         (requestId: string) => {
//           resolve(requestId);
//         }
//       );
//     });
//     const tradesAfter = await GainsNetwork.getTrades(userAddress);
//     console.log(tradesBefore, tradesAfter);
//     console.log("After Fufillment");
//   });
// });

// async function getAmount(Token: ERC20, amount: string) {
//   const x = await Token.decimals();
//   const y = new Decimal(10).pow(x.toString());
//   return new Decimal(amount).mul(y);
// }
