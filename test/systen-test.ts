import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
//@ts-ignore
import { ethers, deployments, userConfig } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ERC20 } from "../typechain-types";
import { Deployment } from "hardhat-deploy/dist/types";
import { Test } from "../typechain-types";

describe("Lock", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let testToken: ERC20;
  let test: Test;
  beforeEach(async () => {
    accounts = (await ethers.getSigners()) as unknown as SignerWithAddress[]; // could also do with getNamedAccounts
    deployer = accounts[0];
    user = accounts[1];

    await deployments.fixture(["Test"]);
    const testContract = (await deployments.get("Test")) as Deployment;
    const testTokenAddress = testContract.address.toString();

    test = (await ethers.getContractAt(
      "Test",
      testTokenAddress
    )) as unknown as Test;
  });
  // it("token exists", async () => {
  //   assert.ok(await testToken.target);
  // });
  it("test exists", async () => {
    await test.initializeEquation([4, 1, 0, 11]);
    console.log((await test.calculate(10)).toString());
  });
});
