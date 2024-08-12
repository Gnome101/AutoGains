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

  console.log(capturedRequestId, await impersonatedSigner.getAddress());
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

  fulfillValue.splice(1, 0, (latestBlock.number * 10 ** 10).toString());
  console.log(fulfillValue);
  if (addToBlockNumber == 0) addToBlockNumber++;

  await mineUpTo(latestBlock.number + addToBlockNumber);
  await oracleContract.fulfill(requestID.toString(), fulfillValue);

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
  console.log("Decimals", tokenDecimals);
  await mineUpTo(latestBlock.number + addToBlockNumber);
  let value = new Decimal(fulfillValue[0].toString());
  console.log("Original number:", value);
  const decimalAdj = 10 - tokenDecimals;
  value = value.mul(new Decimal(10).pow(decimalAdj));
  fulfillValue[0] = value.toFixed();
  console.log(fulfillValue);
  fulfillValue.push((latestBlock.number * 10 ** 10).toString());
  await oracleContract.preformAction(requestID.toString(), fulfillValue);

  // Stop impersonating the account (optional, but good practice)
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [oracleAddress],
  });
}
