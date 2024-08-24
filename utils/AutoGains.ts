import { ethers, network } from "hardhat";
import { BigNumberish, BytesLike, Contract, FunctionFragment } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object
import {
  time,
  loadFixture,
  mineUpTo,
} from "@nomicfoundation/hardhat-network-helpers";
import Decimal from "decimal.js";
import { AutoVault, AutoVaultHarness__factory } from "../typechain-types";
import { expect } from "chai";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
  toDecimal,
  calculateFeeOnTotal,
  calculateFeeOnRaw,
} from "../test/vault-test";
Decimal.set({ precision: 40 });
export async function impersonateOracleRequestAndFulfill(
  testContract: any,
  fulfillValue: string
): Promise<void> {
  let capturedRequestId: string;

  const requestPromise = new Promise<string>((resolve) => {
    testContract.once(
      testContract.getEvent("ChainlinkRequested"),
      (requestId: string) => {
        capturedRequestId = requestId;
        resolve(capturedRequestId);
      }
    );
  });

  await testContract.request();
  capturedRequestId = await requestPromise;

  const chainId = network.config.chainId;
  if (chainId === undefined) throw new Error("Chain ID is undefined");

  const oracleAddress = contracts[chainId].OracleAddress;

  // Set balance for the oracle address
  await network.provider.send("hardhat_setBalance", [
    oracleAddress,
    "0x56BC75E2D63100000", // 100 ETH
  ]);

  // Impersonate the oracle account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [oracleAddress],
  });

  const impersonatedSigner = await ethers.getSigner(oracleAddress);
  const oracleContract = testContract.connect(impersonatedSigner);

  await oracleContract.fulfill(capturedRequestId.toString(), fulfillValue);

  // Stop impersonating the account (optional, but good practice)
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [oracleAddress],
  });
}
export async function impersonateOracleFulfill(
  testContract: any,
  requestID: BytesLike,
  fulfillValue: BigNumberish[],
  addToTimeStamp: number //This is used to manipulate the block number
): Promise<void> {
  const chainId = network.config.chainId;
  if (chainId === undefined) throw new Error("Chain ID is undefined");
  const latestBlock = await ethers.provider.getBlock("latest");
  if (latestBlock == undefined) throw "BlockNumber is null";

  const oracleAddress = contracts[chainId].OracleAddress;

  // Set balance for the oracle address
  await network.provider.send("hardhat_setBalance", [
    oracleAddress,
    "0x56BC75E2D63100000", // 100 ETH
  ]);

  // Impersonate the oracle account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [oracleAddress],
  });

  const impersonatedSigner = await ethers.getSigner(oracleAddress);
  const oracleContract = testContract.connect(impersonatedSigner);
  const x = new Decimal(10).pow(18);

  fulfillValue.splice(
    1,
    0,
    new Decimal(latestBlock.timestamp - addToTimeStamp).mul(x).toFixed()
  );
  if (addToTimeStamp == 0) addToTimeStamp++;

  // await mineUpTo(latestBlock.timestamp + addToTimeStamp);
  await oracleContract.fulfill(requestID.toString(), fulfillValue);

  // Stop impersonating the account (optional, but good practice)
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [oracleAddress],
  });
}
export async function impersonateOracleFulfillAndCheck(
  testContract: any,
  requestID: BytesLike,
  fulfillValue: BigNumberish[],
  addToTimeStamp: number, //This is used to manipulate the block number,
  contractToCheck: any,
  EventToCheck: string,
  tradeCheck: any
): Promise<void> {
  const chainId = network.config.chainId;
  if (chainId === undefined) throw new Error("Chain ID is undefined");
  const latestBlock = await ethers.provider.getBlock("latest");
  if (latestBlock == undefined) throw "BlockNumber is null";

  const oracleAddress = contracts[chainId].OracleAddress;

  // Set balance for the oracle address
  await network.provider.send("hardhat_setBalance", [
    oracleAddress,
    "0x56BC75E2D63100000", // 100 ETH
  ]);

  // Impersonate the oracle account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [oracleAddress],
  });

  const impersonatedSigner = await ethers.getSigner(oracleAddress);
  const oracleContract = testContract.connect(impersonatedSigner);
  const x = new Decimal(10).pow(18);

  fulfillValue.splice(
    1,
    0,
    new Decimal(latestBlock.timestamp - addToTimeStamp).mul(x).toFixed()
  );
  if (addToTimeStamp == 0) addToTimeStamp++;

  // await mineUpTo(latestBlock.timestamp + addToTimeStamp);
  if (tradeCheck) {
    await expect(oracleContract.fulfill(requestID.toString(), fulfillValue))
      .to.emit(contractToCheck, EventToCheck)
      .withArgs(tradeCheck, anyValue, anyValue);
  } else {
    await expect(
      oracleContract.fulfill(requestID.toString(), fulfillValue)
    ).to.emit(contractToCheck, EventToCheck);
  }

  // Stop impersonating the account (optional, but good practice)
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [oracleAddress],
  });
}
export async function impersonateOracleDoVaultAction(
  testContract: any,
  requestID: BytesLike,
  fulfillValue: BigNumberish[],
  tokenDecimals: number,
  addToTimeStamp: number,
  customCollateralWorth: string = "100"
): Promise<void> {
  const chainId = network.config.chainId;
  if (chainId === undefined) throw new Error("Chain ID is undefined");
  const latestBlock = await ethers.provider.getBlock("latest");
  if (latestBlock == undefined) throw "BlockNumber is null";
  const oracleAddress = contracts[chainId].OracleAddress;

  // Set balance for the oracle address
  await network.provider.send("hardhat_setBalance", [
    oracleAddress,
    "0x56BC75E2D63100000", // 100 ETH
  ]);

  // Impersonate the oracle account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [oracleAddress],
  });

  if (addToTimeStamp == 0) addToTimeStamp++;

  const impersonatedSigner = await ethers.getSigner(oracleAddress);
  const oracleContract = testContract.connect(impersonatedSigner);
  // await mineUpTo(latestBlock.timestamp + addToTimeStamp);
  let value = new Decimal(fulfillValue[0].toString());
  const decimalAdj = 18 - tokenDecimals;
  console.log(fulfillValue);
  value = value.mul(new Decimal(10).pow(decimalAdj));
  fulfillValue[0] = value.toFixed();
  const x = new Decimal(10).pow(18);
  //Broken
  fulfillValue.push(
    new Decimal(latestBlock.timestamp - addToTimeStamp)
      .mul(x)
      .toFixed()
      .toString()
  );

  fulfillValue.push(
    new Decimal(customCollateralWorth)
      .mul(new Decimal(10).pow(decimalAdj))
      .toFixed()
  );
  fulfillValue.push(
    new Decimal(customCollateralWorth)
      .mul(new Decimal(10).pow(decimalAdj))
      .toFixed()
  );
  console.log(fulfillValue);
  await oracleContract.preformAction(requestID.toString(), fulfillValue);

  // Stop impersonating the account (optional, but good practice)
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [oracleAddress],
  });
}
export async function impersonateOracleDoVaultActionAndCheck(
  testContract: any,
  requestID: BytesLike,
  fulfillValue: BigNumberish[],
  tokenDecimals: number,
  addToTimeStamp: number,
  tradePrice: string = "100",
  contractToCheck: any,
  EventToCheck: string
): Promise<void> {
  const chainId = network.config.chainId;
  if (chainId === undefined) throw new Error("Chain ID is undefined");
  const latestBlock = await ethers.provider.getBlock("latest");
  if (latestBlock == undefined) throw "BlockNumber is null";
  const oracleAddress = contracts[chainId].OracleAddress;

  // Set balance for the oracle address
  await network.provider.send("hardhat_setBalance", [
    oracleAddress,
    "0x56BC75E2D63100000", // 100 ETH
  ]);

  // Impersonate the oracle account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [oracleAddress],
  });

  if (addToTimeStamp == 0) addToTimeStamp++;

  const impersonatedSigner = await ethers.getSigner(oracleAddress);
  const oracleContract = testContract.connect(impersonatedSigner);
  // await mineUpTo(latestBlock.timestamp + addToTimeStamp);
  let value = new Decimal(fulfillValue[0].toString());
  const decimalAdj = 18 - tokenDecimals;
  console.log(fulfillValue);
  value = value.mul(new Decimal(10).pow(decimalAdj));
  fulfillValue[0] = value.toFixed();
  const x = new Decimal(10).pow(18);
  //Broken
  fulfillValue.push(
    new Decimal(latestBlock.timestamp - addToTimeStamp)
      .mul(x)
      .toFixed()
      .toString()
  );

  fulfillValue.push(
    new Decimal(tradePrice).mul(new Decimal(10).pow(decimalAdj)).toFixed()
  );

  console.log(fulfillValue);
  await expect(
    oracleContract.preformAction(requestID.toString(), fulfillValue)
  ).to.emit(contractToCheck, EventToCheck);

  // Stop impersonating the account (optional, but good practice)
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [oracleAddress],
  });
}

export async function previewDeposit(
  autoVault: AutoVault,
  runner: string,
  depositAmount: Decimal,
  totalAssets: Decimal
): Promise<PreviewAmounts> {
  const totalSupply = new Decimal((await autoVault.totalSupply()).toString());
  let entryFee = await autoVault.ENTRY_FEE();
  console.log(entryFee);
  const MOVEMENT_FEE_SCALE = new Decimal(10 ** 4);
  const minFee = await autoVault.vaultActionFee();

  let expectedFee = calculateFeeOnTotal(
    depositAmount,
    toDecimal(entryFee),
    MOVEMENT_FEE_SCALE,
    toDecimal(minFee)
  );
  const vaultManager = await autoVault.vaultManager();
  if (vaultManager == runner) {
    expectedFee = expectedFee.sub(expectedFee.dividedBy("2").ceil());
  }
  console.log(
    "JavaScwa",
    depositAmount.sub(expectedFee),
    totalSupply,
    totalAssets
  );

  const expectedShares = depositAmount
    .sub(expectedFee)
    .mul(totalSupply.plus(1))
    .dividedBy(totalAssets.plus(1))
    .floor();

  return { expectedAmount: expectedShares, expectedFee: expectedFee };
}
export async function previewMint(
  autoVault: AutoVault,
  runner: string,
  mintAmount: Decimal,
  totalAssets: Decimal
): Promise<PreviewAmounts> {
  const totalSupply = new Decimal((await autoVault.totalSupply()).toString());

  const entryFee = toDecimal(await autoVault.ENTRY_FEE());
  const MOVEMENT_FEE_SCALE = new Decimal(10 ** 4);
  const minFee = toDecimal(await autoVault.vaultActionFee());
  console.log("info js", totalAssets, totalSupply);
  const expectedAssetsPaid = mintAmount
    .mul(totalAssets.plus(1))
    .dividedBy(totalSupply.plus(1))
    .ceil();

  let expectedFee = calculateFeeOnRaw(
    expectedAssetsPaid,
    entryFee,
    MOVEMENT_FEE_SCALE,
    minFee
  );
  const vaultManager = await autoVault.vaultManager();

  if (vaultManager == runner) {
    expectedFee = expectedFee.sub(expectedFee.dividedBy("2").ceil());
  }
  console.log("UOWW", expectedAssetsPaid, expectedFee);
  return {
    expectedAmount: expectedAssetsPaid.plus(expectedFee),
    expectedFee: expectedFee,
  };
}
export async function previewWithdraw(
  autoVault: AutoVault,
  runner: string,
  withdrawAmount: Decimal,
  totalAssets: Decimal
): Promise<PreviewAmounts> {
  const totalSupply = new Decimal((await autoVault.totalSupply()).toString());

  const exitFee = toDecimal(await autoVault.EXIT_FEE());
  const MOVEMENT_FEE_SCALE = new Decimal(10 ** 4);
  const minFee = toDecimal(await autoVault.vaultActionFee());
  console.log(`min Fee:${minFee}`);
  let expectedFee = calculateFeeOnRaw(
    withdrawAmount,
    exitFee,
    MOVEMENT_FEE_SCALE,
    minFee
  );
  const vaultManager = await autoVault.vaultManager();
  if (vaultManager == runner) {
    expectedFee = new Decimal(0);
  }
  if (vaultManager == runner) {
    expectedFee = expectedFee.sub(expectedFee.dividedBy("2").ceil());
  }

  const expectedSoldShares = withdrawAmount
    .plus(expectedFee)
    .mul(totalSupply.plus(1))
    .dividedBy(totalAssets.plus(1))
    .ceil();

  return {
    expectedAmount: expectedSoldShares,
    expectedFee: expectedFee,
  };
}
export async function previewRedeem(
  autoVault: AutoVault,
  runner: string,
  redeemAmount: Decimal,
  totalAssets: Decimal
): Promise<PreviewAmounts> {
  const totalSupply = new Decimal((await autoVault.totalSupply()).toString());

  const exitFee = toDecimal(await autoVault.EXIT_FEE());
  const MOVEMENT_FEE_SCALE = new Decimal(10 ** 4);
  const minFee = toDecimal(await autoVault.vaultActionFee());
  console.log(
    "More TS",
    redeemAmount,
    totalAssets.plus(1),
    totalSupply.plus(1)
  );
  let expectedAssetsEarned = redeemAmount
    .mul(totalAssets.plus(1))
    .dividedBy(totalSupply.plus(1))
    .floor();

  let expectedFee = calculateFeeOnTotal(
    expectedAssetsEarned,
    exitFee,
    MOVEMENT_FEE_SCALE,
    minFee
  );
  const vaultManager = await autoVault.vaultManager();

  if (vaultManager == runner) {
    expectedFee = new Decimal(0);
  }
  console.log("TS", expectedAssetsEarned, expectedFee);
  if (vaultManager == runner) {
    expectedFee = expectedFee.sub(expectedFee.dividedBy("2").ceil());
  }
  if (expectedAssetsEarned.sub(expectedFee).lessThanOrEqualTo(0))
    throw "Fee is greater than amount";
  return {
    expectedAmount: expectedAssetsEarned.sub(expectedFee),
    expectedFee: expectedFee,
  };
}
export interface PreviewAmounts {
  expectedAmount: Decimal;
  expectedFee: Decimal;
}
