import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers, deployments, userConfig, network } from "hardhat";
import { Signer, Wallet } from "ethers";

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
import type { Provider } from "@ethersproject/providers";

import { Deployment } from "hardhat-deploy/dist/types";
import { contracts } from "../Addresses";
import {
  impersonateOracleFulfill,
  impersonateOracleDoVaultAction,
} from "../utils/AutoGains";
import { erc20 } from "../typechain-types/@openzeppelin/contracts/token";
import { Decimal } from "decimal.js";
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
  getContractsForChain,
  CollateralTypes,
} from "@gainsnetwork/sdk";
import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config();
class PriceUpdater {
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
  await priceUpdater.waitForReady(); // Wait for WebSocket to be ready

  // const accounts = (await ethers.getSigners()) as Signer[];
  const _Provider = new ethers.providers.JsonRpcProvider(
    process.env.ARB_SEP_RPC
  );
  if (process.env.PRIVATE_KEY == undefined) throw "Noo";
  const _signer = new Wallet(process.env.PRIVATE_KEY?.toString(), _Provider);
  console.log(_signer.address);
  const chainID = network.config.chainId;
  if (chainID == undefined) throw "Cannot find chainID";

  const Gains = (await ethers.getContractAt(
    "ICoolGains",
    contracts[chainID].GainsNetwork
  )) as unknown as ICoolGains;

  const { gnsMultiCollatDiamond, gTokenOpenPnlFeed, gToken } =
    getContractsForChain(chainID, _signer, CollateralTypes.USDC);

  console.log(gnsMultiCollatDiamond.address);
  // Get the latest price from the WebSocket connection
  // const price = priceUpdater.getPrice(trade.pairIndex.toString());

  // if (price === undefined) {
  //   console.log(`No price available for pair index ${trade.pairIndex}`);
  //   return;
  // }

  // const result = await getPnl(
  //   price,
  //   trade,
  //   tradeInfo,
  //   initialAccFees,
  //   true,
  //   Context
  // );
  // pnlCollat -= closingFee;
  // console.log(price, trade.pairIndex, trade.leverage, trade.long);
  // console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
