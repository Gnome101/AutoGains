import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
//@ts-ignore
import { ethers, deployments, userConfig, network } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

import { Deployment } from "hardhat-deploy/dist/types";
import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object
import {
  impersonateOracleFulfill,
  impersonateOracleDoVaultAction,
  previewDeposit,
  previewMint,
  previewWithdraw,
  previewRedeem,
} from "../utils/AutoGains";
import {
  ERC20,
  FakeGainsNetwork,
  Helper,
  IGainsNetwork,
  VaultFactory,
  AutoVault,
  VaultFactory__factory,
} from "../typechain-types";
import { Decimal } from "decimal.js";
import dotenv from "dotenv";
import { trace } from "console";
import { FEE_MULTIPLIER_SCALE } from "@gainsnetwork/sdk";
import { AddressLike, FallbackFragment, MinInt256, Signer } from "ethers";
import { getAmountDec } from "./strategy-test";
import { Sign } from "crypto";
import exp from "constants";
import { seconds } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time/duration";

export async function deployContractsFixture(): Promise<Context> {
  // Deploy contracts, set up roles, etc.
  const chainID = network.config.chainId;
  if (chainID == undefined) throw "Cannot find chainID";

  const accounts =
    (await ethers.getSigners()) as unknown as SignerWithAddress[]; // could also do with getNamedAccounts
  const otherUser = accounts[0];
  let vaultCreator: SignerWithAddress;
  if (chainID == 31337) {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"],
    });
    vaultCreator = await ethers.getSigner(
      "0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"
    ); //Test account with money
    // vaultCreator.address = await vaultCreator.getAddress();
  } else {
    // vaultCreator.address = await otherUser.getAddress();
    vaultCreator = otherUser;
  }

  await deployments.fixture(["Test"]);

  // test = (await ethers.getContractAt(
  //   "Test",
  //   testContract.address.toString()
  // )) as unknown as Test;

  const fakeGainsContract = (await deployments.get(
    "FakeGainsNetwork"
  )) as Deployment;

  const FakeGainsNetwork = (await ethers.getContractAt(
    "FakeGainsNetwork",
    fakeGainsContract.address.toString(),
    vaultCreator
  )) as unknown as FakeGainsNetwork;

  const factoryContract = (await deployments.get("VaultFactory")) as Deployment;

  const vaultFactory = (await ethers.getContractAt(
    "VaultFactory",
    factoryContract.address.toString(),
    vaultCreator
  )) as unknown as VaultFactory;

  const helperContract = (await deployments.get("Helper")) as Deployment;

  const Helper = (await ethers.getContractAt(
    "Helper",
    helperContract.address.toString(),
    vaultCreator
  )) as unknown as Helper;

  const USDC = (await ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
    contracts[chainID].USDC,
    vaultCreator
  )) as unknown as ERC20;

  const otherUSDC = (await ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
    contracts[chainID].USDC,
    otherUser
  )) as unknown as ERC20;

  //Transfering some USDC to the otherUser
  await USDC.transfer(
    otherUser.address,
    (await getAmount(USDC, "100")).toFixed()
  );

  //Setting the gains address to the fake one
  await vaultFactory
    .connect(otherUser)
    .setGainsAddress(FakeGainsNetwork.target);

  const MIN_FEE = await getAmount(USDC, "0.85");

  return {
    vaultCreator,
    otherUser,
    vaultFactory,
    USDC,
    otherUSDC,
    FakeGainsNetwork,
    Helper,
    MIN_FEE,
  };
}
export interface Context {
  vaultCreator: SignerWithAddress;
  otherUser: SignerWithAddress;
  vaultFactory: VaultFactory;
  USDC: ERC20;
  otherUSDC: ERC20;
  FakeGainsNetwork: FakeGainsNetwork;
  Helper: Helper;
  MIN_FEE: Decimal;
}

export async function createAutoVault(
  c: Context,
  startingBalance: string,
  collatIndex: string,
  strategyCount: number = 1
): Promise<AutoVault> {
  const { USDC, vaultFactory, Helper, vaultCreator } = c;
  const initalAmount = await getAmount(USDC, "100");

  await USDC.approve(vaultFactory.target, initalAmount.toFixed());
  const dummyAPI = {
    method: "",
    url: "",
    headers: "",
    body: "",
    path: "",
    jobIDs: "",
  } as VaultFactory.APIInfoStruct;

  //According to ChatGPT, if RSI is above 70 then its too high. If its below 30 then its too low
  //So what I will do is have two strategies, if the RSI goes to 50 then it will close either position
  //if 70 < x1 then longBTC else do nothing
  const longAciton = await Helper.createOpenTradeAction(
    1000,
    0,
    5000,
    true,
    true,
    collatIndex,
    0,
    200000, // Should be 2%
    10000000,
    12000000,
    8000000
  );
  const decimals = new Decimal(10).pow(18);
  const closeAction = await Helper.createCloseTradeMarketAction();

  // if x1 >  70 then longAction else nothing
  //if x1 == 50 then close
  const longStrategy = [
    18,
    15,
    1,
    0,
    0,
    new Decimal(70).mul(decimals).toFixed(),
    0,
    longAciton,
    18,
    10,
    1,
    0,
    0,
    new Decimal(50).mul(decimals).toFixed(),
    0,
    closeAction,
    0,
    0,
  ];

  let APIInfos = Array(strategyCount).fill(dummyAPI);
  let strategies = Array(strategyCount).fill(longStrategy);

  const vaultAddress = await vaultFactory.createVault.staticCall(
    USDC,
    initalAmount.toFixed(),
    APIInfos,
    strategies
  );

  await vaultFactory.createVault(
    USDC,
    initalAmount.toFixed(),
    APIInfos,
    strategies
  );

  await time.increase(61);
  const autoVault = (await ethers.getContractAt(
    "AutoVault",
    vaultAddress,
    vaultCreator
  )) as unknown as AutoVault;

  const userVaultBalance = await autoVault.balanceOf(vaultCreator.address);

  //Assuming a deposit fee of 0
  //With Deposit Fees, userVaultBalance - userVaultBalance * DepositFee = initalAmount
  //My balance should be equal to the inital deposit
  assert.equal(
    userVaultBalance.toString(),
    initalAmount.toFixed(),
    `Actual Vault Balance is different than expected`
  );
  assert.equal(
    (await USDC.balanceOf(autoVault.target)).toString(),
    initalAmount.toFixed()
  );
  return autoVault;
}

export async function getAmount(Token: ERC20, amount: string) {
  const x = await Token.decimals();
  const y = new Decimal(10).pow(x.toString());
  return new Decimal(amount).mul(y);
}

export async function incrementTime(sec: number): Promise<number> {
  const latestBlock = await ethers.provider.getBlock("latest");
  if (latestBlock == undefined) throw "Latest block is undefined";
  const nextTime = latestBlock.timestamp + sec;
  await ethers.provider.send("evm_mine", [nextTime]);
  return nextTime;
}

export async function openDummyTrade(
  autoVault: AutoVault,
  Context: Context,
  strategy: string = "0"
) {
  const { vaultFactory, FakeGainsNetwork } = Context;
  const decimals = new Decimal(10).pow(18);
  let requestID = await autoVault.executeStrategy.staticCall(strategy);
  const tx3 = await autoVault.executeStrategy(strategy);
  await tx3.wait();
  const x = new Decimal(10).pow(18);
  const currentPrice = new Decimal(60).mul(x);
  let input = [currentPrice.toFixed(), new Decimal(80).mul(decimals).toFixed()];

  expect(
    await impersonateOracleFulfill(vaultFactory, requestID, input, 0)
  ).to.emit(FakeGainsNetwork, "OpenTradeCalled");
}

export async function closeDummyTrade(
  autoVault: AutoVault,
  Context: Context,
  strategy: string = "0"
) {
  const { vaultFactory, FakeGainsNetwork } = Context;
  const decimals = new Decimal(10).pow(18);
  let requestID = await autoVault.executeStrategy.staticCall(strategy);
  const tx3 = await autoVault.executeStrategy(strategy);
  await tx3.wait();
  const x = new Decimal(10).pow(18);
  const currentPrice = new Decimal(60).mul(x);
  let input = [currentPrice.toFixed(), new Decimal(50).mul(decimals).toFixed()];

  expect(
    await impersonateOracleFulfill(vaultFactory, requestID, input, 0)
  ).to.emit(FakeGainsNetwork, "CloseTradeMarketCalled");
}
