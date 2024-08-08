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

  const accounts = await ethers.getSigners();
  const chainID = network.config.chainId;
  if (chainID == undefined) throw "Cannot find chainID";

  const Gains = (await ethers.getContractAt(
    "ICoolGains",
    contracts[chainID].GainsNetwork
  )) as unknown as ICoolGains;

  const trades = await Gains.getTrades(accounts[0].address);
  const tradeInfos = await Gains.getTradeInfos(accounts[0].address);
  const currentIndex = 3;
  const currentTrade = trades[currentIndex];

  const trade = {
    user: currentTrade.user.toString(),
    index: Number(currentTrade.index),
    pairIndex: Number(currentTrade.pairIndex) as PairIndex,
    leverage: Number(currentTrade.leverage) / 1e3,
    long: currentTrade.long,
    isOpen: currentTrade.isOpen,
    collateralIndex: Number(currentTrade.collateralIndex),
    tradeType: Number(currentTrade.tradeType) as TradeType,
    collateralAmount: Number(currentTrade.collateralAmount) / 1e6,
    openPrice: Number(currentTrade.openPrice) / 1e10,
    sl: Number(currentTrade.sl) / 1e10,
    tp: Number(currentTrade.tp) / 1e10,
  } as Trade;

  const tradeInfo = {
    createdBlock: Number(tradeInfos[currentIndex].createdBlock),
    tpLastUpdatedBlock: Number(tradeInfos[currentIndex].tpLastUpdatedBlock),
    slLastUpdatedBlock: Number(tradeInfos[currentIndex].slLastUpdatedBlock),
    maxSlippageP: Number(tradeInfos[currentIndex].maxSlippageP) / 1e3,
    lastOiUpdateTs: Number(tradeInfos[currentIndex].lastOiUpdateTs),
    collateralPriceUsd:
      Number(tradeInfos[currentIndex].collateralPriceUsd) / 1e8,
  } as TradeInfo;

  const feeInfo = await Gains.getBorrowingPair(
    trade.collateralIndex,
    trade.pairIndex
  );
  const borrowGroups = (await Gains.getBorrowingPairGroups(
    trade.collateralIndex,
    trade.pairIndex
  )) as BorrowingPairGroupStruct[];

  const initalFee = await Gains.getBorrowingInitialAccFees(
    trade.collateralIndex,
    accounts[0].address,
    trade.index
  );

  const initialAccFees = {
    accPairFee: Number(initalFee.accPairFee) / 1e10,
    accGroupFee: Number(initalFee.accGroupFee) / 1e10,
    block: Number(initalFee.block),
  } as TradeInitialAccFees;

  const pairData = await Gains.pairsBackend(trade.pairIndex);

  console.log(pairData);
  const pairs = await Gains.pairs(trade.pairIndex);
  const feeStuff = await Gains.fees(pairs.feeIndex);
  const fee = {
    openFeeP: Number(pairData.fee.openFeeP) / 1e12,
    closeFeeP: Number(pairData.fee.closeFeeP) / 1e12,
    minPositionSizeUsd: Number(pairData.fee.minPositionSizeUsd) / 1e18,
    triggerOrderFeeP: Number(pairData.fee.triggerOrderFeeP) / 1e12,
  } as Fee;
  console.log(fee);
  const latestBlock = Number(
    (await ethers.provider.getBlock("latest"))?.number
  );
  // const pairGroups = await Gains.getBorrowingPairGroups(trade.collateralIndex,trade.pairIndex);
  // const pendingAccFees = await Gains.getBorrowingPairPendingAccFees(trade.collateralIndex,trade.pairIndex,(latestBlock));
  // const openInterest = await Gains.getBorrowingPairOi(trade.collateralIndex,trade.pairIndex);
  const allBorrowingPairs = await Gains.getAllBorrowingPairs(
    trade.collateralIndex
  );
  const [pairsBorrowingData, rawPairsOpenInterest, pairsBorrowingPairGroup] = [
    allBorrowingPairs[0],
    allBorrowingPairs[1],
    allBorrowingPairs[2],
  ];
  const pairsOpenInterests = rawPairsOpenInterest.map((oi) => transformOi(oi));

  let borrowingFeesGroupIds = [
    ...new Set(
      pairsBorrowingPairGroup
        .map((value) => value.map((value) => value.groupIndex))
        .flat()
    ),
  ].sort((a: any, b: any) => Number(a) - Number(b));
  borrowingFeesGroupIds = borrowingFeesGroupIds.map((x) =>
    Number(x)
  ) as Number[];

  // console.log(borrowingFeesGroupIds);
  const borrowingFeeGroupResults =
    borrowingFeesGroupIds.length > 0
      ? await Gains.getBorrowingGroups(
          trade.collateralIndex,
          Array.from(
            Array(
              +borrowingFeesGroupIds[borrowingFeesGroupIds.length - 1] + 1
            ).keys()
          )
        )
      : [[], []];

  const groupsBorrowingData = borrowingFeeGroupResults[0];
  const groupsOpenInterest = borrowingFeeGroupResults[1].map((oi) =>
    transformOi(oi)
  );

  const borrowFeePairs = pairsBorrowingData.map(
    (
      {
        feePerBlock,
        accFeeLong,
        accFeeShort,
        accLastUpdatedBlock,
        feeExponent,
      },
      idx
    ) => ({
      oi: pairsOpenInterests[idx],
      feePerBlock: transformFrom1e10(feePerBlock),
      accFeeLong: transformFrom1e10(accFeeLong),
      accFeeShort: transformFrom1e10(accFeeShort),
      accLastUpdatedBlock: parseInt(accLastUpdatedBlock.toString()),
      feeExponent: parseInt(feeExponent.toString()),
      groups: pairsBorrowingPairGroup[idx].map((group) => ({
        groupIndex: parseInt(group.groupIndex.toString()),
        block: parseInt(group.block.toString()),
        initialAccFeeLong: transformFrom1e10(group.initialAccFeeLong),
        initialAccFeeShort: transformFrom1e10(group.initialAccFeeShort),
        prevGroupAccFeeLong: transformFrom1e10(group.prevGroupAccFeeLong),
        prevGroupAccFeeShort: transformFrom1e10(group.prevGroupAccFeeShort),
        pairAccFeeLong: transformFrom1e10(group.pairAccFeeLong),
        pairAccFeeShort: transformFrom1e10(group.pairAccFeeShort),
      })),
    })
  );
  const borrowFeesGroup = groupsBorrowingData.map(
    (
      {
        feePerBlock,
        accFeeLong,
        accFeeShort,
        accLastUpdatedBlock,
        feeExponent,
      },
      idx
    ) => ({
      oi: groupsOpenInterest[idx],
      feePerBlock: transformFrom1e10(feePerBlock),
      accFeeLong: transformFrom1e10(accFeeLong),
      accFeeShort: transformFrom1e10(accFeeShort),
      accLastUpdatedBlock: parseInt(accLastUpdatedBlock.toString()),
      feeExponent: parseInt(feeExponent.toString()),
    })
  );

  const maxGainP = 900;
  const openinterest = await Gains.getBorrowingPairOi(trade.collateralIndex, 1);
  // console.log("A", pairsOpenInterests);
  const BorrowingFeeContext = {
    currentBlock: latestBlock,
    groups: borrowFeesGroup,
    pairs: borrowFeePairs,
    openInterest: transformOi(pairsOpenInterests[trade.pairIndex]),
  };
  console.log("A", borrowFeePairs.length, borrowFeesGroup.length);
  const Context = {
    ...BorrowingFeeContext,
    fee: fee as Fee,
    maxGainP: maxGainP as number,
  } as GetPnlContext;

  // Get the latest price from the WebSocket connection
  const price = priceUpdater.getPrice(trade.pairIndex.toString());

  if (price === undefined) {
    console.log(`No price available for pair index ${trade.pairIndex}`);
    return;
  }
  const feeA = await getBorrowingFee(
    trade.collateralAmount * trade.leverage,
    trade.pairIndex,
    trade.long,
    initialAccFees,
    Context
  );

  // let pnlCollat = trade.long
  //   ? ((price - trade.openPrice) / trade.openPrice) *
  //     trade.leverage *
  //     trade.collateralAmount
  //   : ((trade.openPrice - price) / trade.openPrice) *
  //     trade.leverage *
  //     trade.collateralAmount;
  const minFee = Number(await Gains.pairMinFeeUsd(trade.pairIndex)) / 1e18;
  console.log(minFee);
  const closingFee = await getClosingFee(
    trade.collateralAmount,
    trade.leverage,
    trade.pairIndex,
    fee
  );

  const obj = {
    price: price,
    trade,
    tradeInfo,
    initialAccFees,
    fees: true,
    Context,
  };

  writeFileSync("info.json", JSON.stringify(obj, null, 2));

  const result = await getPnl(
    price,
    trade,
    tradeInfo,
    initialAccFees,
    true,
    Context
  );
  if (result == undefined) throw " Oh no";
  // pnlCollat -= closingFee;
  console.log(price, trade.pairIndex, trade.leverage, trade.long);
  console.log(closingFee);
  let change = 0;
  if (minFee > closingFee) change = closingFee - minFee;
  console.log(result[0] + change);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
