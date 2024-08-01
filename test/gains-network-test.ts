import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
//@ts-ignore
import { ethers, deployments, userConfig, network } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ERC20, IGainsNetwork, Test256 } from "../typechain-types";
import { Deployment } from "hardhat-deploy/dist/types";
import { Test } from "../typechain-types";
import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object
import {
  TradeInfoStruct,
  TradeStruct,
} from "../typechain-types/contracts/Gains Contracts/IGainsNetwork";

describe("AutoGains Tests", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let testToken: ERC20;
  let test: Test;
  let GainsNetwork: IGainsNetwork;
  beforeEach(async () => {
    accounts = (await ethers.getSigners()) as unknown as SignerWithAddress[]; // could also do with getNamedAccounts
    deployer = accounts[0];
    user = accounts[1];
    const chainID = network.config.chainId;
    if (chainID == undefined) throw "Error";

    GainsNetwork = (await ethers.getContractAt(
      "Test",
      contracts[chainID].GainsNetwork
    )) as unknown as IGainsNetwork;
  });

  it("can create a position", async () => {
    const userAddress = await deployer.getAddress();
    const tradeBefore = await GainsNetwork.getTrades(userAddress);
    console.log(`User trades before: ${tradeBefore}`);

    const Trade = {
         user:
     index:
     pairIndex:
     leverage:
     long:
     isOpen:
     collateralIndex:
    TradeType tradeType:
     collateralAmount:
     openPrice:
     tp:
     sl:
    __placeholder:
    } as TradeStruct;

    await GainsNetwork.openTrade(Trade, 0, userAddress);
    const tradeAfter = await GainsNetwork.getTrades(userAddress);
    console.log(`User trades before: ${tradeAfter}`);
  });
});
