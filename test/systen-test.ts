import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
//@ts-ignore
import { ethers, deployments, userConfig, network } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ERC20, Test256 } from "../typechain-types";
import { Deployment } from "hardhat-deploy/dist/types";
import { Test } from "../typechain-types";
import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object
import { impersonateOracleAndFulfill } from "../utils/AutoGains";
describe("AutoGains Tests", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let testToken: ERC20;
  let test: Test;
  let Test256: Test256;
  beforeEach(async () => {
    accounts = (await ethers.getSigners()) as unknown as SignerWithAddress[]; // could also do with getNamedAccounts
    deployer = accounts[0];
    user = accounts[1];

    await deployments.fixture(["all"]);
    const test256Contract = (await deployments.get("Test256")) as Deployment;
    Test256 = (await ethers.getContractAt(
      "Test256",
      test256Contract.address.toString()
    )) as unknown as Test256;

    const testContract = (await deployments.get("Test")) as Deployment;
    test = (await ethers.getContractAt(
      "Test",
      testContract.address.toString()
    )) as unknown as Test;
  });
  // it("token exists", async () => {
  //   assert.ok(await testToken.target);
  // });
  // it("test exists", async () => {
  //   //if (x1 > x2) then x3 + x4 else x3 - x4

  //   await test.initializeEquation([
  //     18, 13, 1, 0, 1, 1, 4, 1, 2, 1, 3, 5, 1, 2, 1, 3,
  //   ]);

  //   console.log((await test.calculate([10, 5, 3, 2])).toString());
  // });
  // it("test exists equ", async () => {
  //   //if x1 < x2 then x3 else x4

  //   await test.initializeEquation([18, 12, 1, 0, 1, 1, 1, 2, 1, 3]);

  //   console.log(
  //     (
  //       await test.calculate([1221312, 3123, 12321, 123123, 123123, 123123])
  //     ).toString()
  //   );
  // });
  // it("number actually comes back right", async function () {
  //   this.timeout(0); // Disable the timeout for this test

  //   let tx = await Test256.request();
  //   await tx.wait();

  //   console.log("Starting continuous query. Press Ctrl+C to stop.");

  //   return new Promise((resolve) => {
  //     const intervalId = setInterval(async () => {
  //       try {
  //         const r = await Test256.response();
  //         console.log("Response:", r.toString());
  //       } catch (error) {
  //         console.error("Error querying response:", error);
  //       }
  //     }, 5000);

  //     // Set up a handler for the SIGINT signal (Ctrl+C)
  //     process.on("SIGINT", () => {
  //       clearInterval(intervalId);
  //       console.log("Continuous query stopped.");
  //       resolve();
  //     });
  //   });
  // });
  // it("Fufillment works", async () => {
  //   await impersonateOracleAndFulfill(Test256, "10");
  //   const res = await Test256.response();
  //   assert.equal(res.toString(), "10");
  // });
  it("number actually comes back right", async function () {
    console.log("Starting continuous query. Press Ctrl+C to stop.");

    return new Promise((resolve) => {
      const intervalId = setInterval(async () => {
        try {
          const r = await Test256.response();
          console.log("Response:", r.toString());
        } catch (error) {
          console.error("Error querying response:", error);
        }
      }, 5000);

      // Set up a handler for the SIGINT signal (Ctrl+C)
      process.on("SIGINT", () => {
        clearInterval(intervalId);
        console.log("Continuous query stopped.");
        resolve();
      });
    });
  });
});
