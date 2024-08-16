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
import { AutoVaultHarness__factory } from "../typechain-types";
import { expect } from "chai";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

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
  addToBlockNumber: number //This is used to manipulate the block number
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

  fulfillValue.splice(1, 0, new Decimal(latestBlock.number).mul(x).toFixed());
  if (addToBlockNumber == 0) addToBlockNumber++;

  await mineUpTo(latestBlock.number + addToBlockNumber);
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
  addToBlockNumber: number, //This is used to manipulate the block number,
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

  fulfillValue.splice(1, 0, new Decimal(latestBlock.number).mul(x).toFixed());
  if (addToBlockNumber == 0) addToBlockNumber++;

  await mineUpTo(latestBlock.number + addToBlockNumber);
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
  addToBlockNumber: number
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

  if (addToBlockNumber == 0) addToBlockNumber++;

  const impersonatedSigner = await ethers.getSigner(oracleAddress);
  const oracleContract = testContract.connect(impersonatedSigner);
  await mineUpTo(latestBlock.number + addToBlockNumber);
  let value = new Decimal(fulfillValue[0].toString());
  const decimalAdj = 10 - tokenDecimals;
  console.log(fulfillValue);
  value = value.mul(new Decimal(10).pow(decimalAdj));
  fulfillValue[0] = value.toFixed();
  const x = new Decimal(10).pow(10);

  fulfillValue.push(
    new Decimal(latestBlock.number).mul(x).toFixed().toString()
  );
  fulfillValue.push(new Decimal(100).mul(x).toFixed());
  await oracleContract.preformAction(requestID.toString(), fulfillValue);

  // Stop impersonating the account (optional, but good practice)
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [oracleAddress],
  });
}
