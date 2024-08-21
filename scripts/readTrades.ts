import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers, deployments, userConfig, network } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  AutoVault,
  ERC20,
  FakeGainsNetwork,
  Helper,
  ICoolGains,
  IGainsNetwork,
  VaultFactory,
} from "../typechain-types";
import { Deployment, FacetCutAction } from "hardhat-deploy/dist/types";
import { contracts } from "../Addresses";
import {
  impersonateOracleFulfill,
  impersonateOracleDoVaultAction,
} from "../utils/AutoGains";
import { erc20 } from "../typechain-types/@openzeppelin/contracts/token";
import { Decimal } from "decimal.js";
import dotenv from "dotenv";
import { TradeStruct } from "../typechain-types/contracts/Gains Contracts/IGainsNetwork";
import { BorrowingPairGroupStruct } from "../typechain-types/contracts/Gains Contracts/ICoolGains";
import {
  getPnl,
  Trade,
  TradeInfo,
  TradeType,
  TradeInitialAccFees,
  Fee,
  GetPnlContext,
  PairIndex,
  getBorrowingFee,
  getClosingFee,
  GetBorrowingFeeContext,
  convertPairBorrowingFees,
  fetchGroupBorrowingFees,
  BorrowingFee,
} from "@gainsnetwork/sdk";
import { writeFileSync } from "fs";
import WebSocket from "ws";
import { transformOi, transformFrom1e10 } from "./getBorrowFees";
import axios, { AxiosRequestConfig, Method } from "axios";
import { Contract, Provider } from "ethers";
import { abi } from "../DiamondABI";
import { ErrorDecoder } from "ethers-decode-error";
import type { DecodedError } from "ethers-decode-error";
export class PriceUpdater {
  private ws: WebSocket;
  private prices: Map<string, number> = new Map();
  private isReady: boolean = false;

  constructor() {
    this.ws = new WebSocket("wss://backend-pricing.eu.gains.trade");

    this.ws.on("open", () => {
      console.log("WebSocket connection established");
      this.isReady = true;
    });

    this.ws.on("message", (data: WebSocket.Data) => {
      const updates = JSON.parse(data.toString());
      for (let i = 0; i < updates.length; i += 2) {
        const pairId = updates[i].toString();
        const price = updates[i + 1];
        this.prices.set(pairId, price);
      }
    });

    this.ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    this.ws.on("close", () => {
      console.log("WebSocket connection closed");
      this.isReady = false;
    });
  }

  getPrice(pairIndex: string): number | undefined {
    return this.prices.get(pairIndex);
  }

  async waitForReady(timeout: number = 5000): Promise<void> {
    if (this.isReady) return;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("WebSocket connection timeout"));
      }, timeout);

      const checkReady = () => {
        if (this.isReady) {
          clearTimeout(timer);
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };

      checkReady();
    });
  }
}

const priceUpdater = new PriceUpdater();

async function main() {
  // await priceUpdater.waitForReady(); // Wait for WebSocket to be ready

  const accounts = await ethers.getSigners();
  const chainID = network.config.chainId;
  if (chainID == undefined) throw "Cannot find chainID";

  // const vault = (await ethers.getContractAt(
  //   "AutoVault",
  //   "0xec90a10e4bed4903fe68cfa57a7cbdcebb104bfb"
  // )) as unknown as AutoVault;
  // const vaultAddress = "0xec90a10e4bed4903fe68cfa57a7cbdcebb104bfb";

  // const errorDecoder = ErrorDecoder.create([abi]);
  // // Impersonate the oracle account
  // const VaultFactory = "0x3151278D2d6c7c361C1F6d2e80501B984c49A8A0";
  // await network.provider.send("hardhat_setBalance", [
  //   VaultFactory,
  //   "0x56BC75E2D63100000", // 100 ETH
  // ]);
  // await network.provider.request({
  //   method: "hardhat_impersonateAccount",
  //   params: [VaultFactory],
  // });
  // const impersonatedSigner = await ethers.getSigner(VaultFactory);

  // const AutoVault = await ethers.getContractAt(
  //   "AutoVault",
  //   vaultAddress,
  //   impersonatedSigner
  // );
  // // const AutoVault = new Contract("VaultFactory", impersonatedSigner);

  // try {
  //   await AutoVault.preformAction(0, 50000000, 0, 591710000000000);
  // } catch (err) {
  //   const decodedError: DecodedError = await errorDecoder.decode(err);
  //   console.log(`Revert reason: ${decodedError.reason}`);
  // }
}

async function updateResponse(res: Decimal, provider: Provider, rsi: Decimal) {
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
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
