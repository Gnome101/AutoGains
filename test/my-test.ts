//@ts-ignore
import { ethers, deployments, userConfig, network } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  AutoVault,
  ERC20,
  FakeGainsNetwork,
  Helper,
  IGainsNetwork,
  VaultFactory,
} from "../typechain-types";
import { Deployment } from "hardhat-deploy/dist/types";
import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object

import { Decimal } from "decimal.js";
import dotenv from "dotenv";
import { Addressable, Contract, Filter, Provider, TopicFilter } from "ethers";
import axios, { AxiosRequestConfig, Method } from "axios";
import { impersonateOracleFulfill } from "../utils/AutoGains";
import { DEFAULT_CIPHERS } from "tls";

import { PriceUpdater } from "../scripts/readTrades";
import { verify } from "../utils/verify";
import { getAmountDec } from "./strategy-test";

import { abi } from "../DiamondABI";
dotenv.config();

describe("Strategy Tests ", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let vaultFactory: VaultFactory;
  let Helper: Helper;

  let USDC: ERC20;
  let WETH: ERC20;
  let DAI: ERC20;
  let userAddress: string;
  let GainsNetwork: IGainsNetwork;

  beforeEach(async () => {
    const chainID = network.config.chainId;
    if (chainID == undefined) throw "Cannot find chainID";

    accounts = (await ethers.getSigners()) as unknown as SignerWithAddress[]; // could also do with getNamedAccounts
    deployer = accounts[0];
    if (chainID == 31337) {
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"],
      });
      user = await ethers.getSigner(
        "0x793448209Ef713CAe41437C7DaA219b59BEF1A4A"
      ); //Test account with money
      userAddress = await user.getAddress();
    } else {
      userAddress = await deployer.getAddress();
      user = deployer;
    }
    await deployments.fixture(["all"]);

    vaultFactory = (await ethers.getContractAt(
      "VaultFactory",
      "0x8f1B59d8e0455742A3b26fFA8A16Fe4131249BF9",
      user
    )) as unknown as VaultFactory;

    GainsNetwork = (await ethers.getContractAt(
      "IGainsNetwork",
      contracts[chainID].GainsNetwork,
      user
    )) as unknown as IGainsNetwork;

    USDC = (await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
      contracts[chainID].USDC,
      user
    )) as unknown as ERC20;
  });

  it("every method works with a strategy powa", async () => {});
});
