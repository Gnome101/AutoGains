import { ethers, network } from "hardhat";
import { BigNumberish, BytesLike, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object

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
  fulfillValue: BigNumberish[]
): Promise<void> {
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
  fulfillValue: BigNumberish
): Promise<void> {
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

  await oracleContract.preformAction(requestID.toString(), fulfillValue);

  // Stop impersonating the account (optional, but good practice)
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [oracleAddress],
  });
}
