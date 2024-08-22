import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  AutoVault,
  VaultFactory,
  ERC20,
  FakeGainsNetwork,
  Helper,
  VaultFactory__factory,
} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Decimal } from "decimal.js";
import {
  Context,
  createAutoVault,
  deployContractsFixture,
  getAmount,
  incrementTime,
  openDummyTrade,
} from "./common-test";
import { getAmountDec } from "./strategy-test";
import {
  impersonateOracleDoVaultActionAndCheck,
  previewRedeem,
} from "../utils/AutoGains";
import { UnmanagedSubscriber } from "ethers";
import { getImportantInfo } from "./vault-test";
let accounts: SignerWithAddress[];

let WETH: ERC20;
let DAI: ERC20;

const ENTRY_FEE = new Decimal(80);
const EXIT_FEE = new Decimal(80);
const MOVEMENT_FEE_SCALE = new Decimal(10 ** 4);
const FACTORY_SHARE = new Decimal(2);

const COOLDOWN_PERIOD = 60;
const MAX_BLOCK_DIFFERENCE = 16;
const SWAP_FEE = 2_000;
const SWAP_FEE_SCALE = 10 ** 6;
let MIN_FEE: Decimal;
const collateralIndex = 1;

let c: Context;

describe("AutoGains Withdraw Period Tests", function () {
  // Test suite for withdraw period functionality
  describe("Withdraw Period", function () {
    let autoVault: AutoVault;
    let otherAutoVault: AutoVault;
    // Setup before each test

    beforeEach(async function () {
      c = await deployContractsFixture();
      await c.vaultFactory
        .connect(c.otherUser)
        .setGainsAddress(c.FakeGainsNetwork.target);
      autoVault = await createAutoVault(c, "100", "3");
      otherAutoVault = autoVault.connect(c.otherUser);
    });
    describe("Withdraw Period Initiation", function () {
      // Test initiating withdraw period
      it("should revert when non token holder initiates withdraw period ", async () => {
        const { otherUser } = c;
        const error = `NotTokenHolder("${otherUser.address}")`;
        await expect(otherAutoVault.setWithdrawPeriod()).to.be.rejectedWith(
          error
        );
      });

      // Test initiating withdraw period
      it("should allow any token holder to initiate withdraw period ", async function () {
        const MIN_PERIOD = Number(await autoVault.MIN_PERIOD_TIME());
        const nextTime = await incrementTime(100);
        await expect(autoVault.setWithdrawPeriod())
          .to.emit(autoVault, "WithdrawPeriodSet")
          .withArgs(nextTime + MIN_PERIOD);
      });
    });
    describe("Withdraw Period Set", function () {
      let withdrawPeriod: number;

      beforeEach(async () => {
        await autoVault.setWithdrawPeriod();
        withdrawPeriod = Number(await autoVault.nextWithdrawPeriod());
        await openDummyTrade(autoVault, c);
      });

      it("can not enter withdraw period before its time ", async () => {
        const { vaultCreator } = c;
        const currentTime = await incrementTime(0);
        const error = `NotYetWithdrawPeriod(${withdrawPeriod - currentTime})`;

        await expect(
          autoVault.startAction(vaultCreator.address, 0, 2, 0)
        ).to.be.rejectedWith(error);
      });
      // Test closing positions during withdraw period
      it("should close all active positions when withdraw period is initiated ", async () => {
        const { vaultCreator, vaultFactory, USDC, FakeGainsNetwork } = c;
        const currentTime = await incrementTime(
          Number(await autoVault.MIN_PERIOD_TIME())
        );
        const reqID = await autoVault.startAction.staticCall(
          vaultCreator.address,
          0,
          2,
          0
        );

        await autoVault.startAction(vaultCreator.address, 0, 2, 0);
        const input = [0];
        await impersonateOracleDoVaultActionAndCheck(
          vaultFactory,
          reqID,
          input,
          Number(await USDC.decimals()),
          0,
          undefined,
          FakeGainsNetwork,
          "CloseTradeMarketCalled"
        );
      });

      describe("Entered Withdraw Period", function () {
        beforeEach(async () => {
          const { vaultCreator, USDC } = c;

          await incrementTime(Number(await autoVault.MIN_PERIOD_TIME()));

          // Close positions
          const reqID = await autoVault.startAction.staticCall(
            vaultCreator.address,
            0,
            2,
            0
          );
          await autoVault.startAction(vaultCreator.address, 0, 2, 0);
          await impersonateOracleDoVaultActionAndCheck(
            c.vaultFactory,
            reqID,
            [0],
            Number(await USDC.decimals()),
            0,
            undefined,
            c.FakeGainsNetwork,
            "CloseTradeMarketCalled"
          );
        });
        // Test withdraw after positions are closed
        it("should allow withdrawals after all positions are closed wooba", async function () {
          const { vaultCreator, USDC } = c;
          // Attempt withdrawal
          const withdrawAmount = await getAmount(USDC, "50");

          const shares = await autoVault.previewWithdraw.staticCall(
            withdrawAmount.toFixed()
          );
          await expect(
            autoVault.withdraw(
              withdrawAmount.toFixed(),
              vaultCreator.address,
              vaultCreator.address
            )
          )
            .to.emit(autoVault, "Withdraw")
            .withArgs(
              vaultCreator.address,
              vaultCreator.address,
              vaultCreator.address,
              withdrawAmount.toFixed(),
              shares.toString()
            );
        });
        // Test redeem after positions are closed
        it("should allow redemptions after all positions are closed ", async function () {
          const { vaultCreator, vaultFactory, USDC } = c;

          // Attempt withdrawal
          const redeemAmount = new Decimal(
            (await autoVault.balanceOf(vaultCreator.address)).toString()
          );

          const assets = await autoVault.previewRedeem.staticCall(
            redeemAmount.toString()
          );
          const totalAssets = await USDC.balanceOf(autoVault.target);

          const { expectedAmount, expectedFee } = await previewRedeem(
            autoVault,
            vaultCreator.address,
            redeemAmount,
            new Decimal(totalAssets.toString())
          );

          const expectedAssetsEarned = expectedAmount;
          assert.equal(
            assets.toString(),
            expectedAssetsEarned.toFixed(),
            `The predicted amount of assets are not correct`
          );

          const Before = await getImportantInfo(
            autoVault,
            USDC,
            vaultCreator.address,
            vaultFactory.target,
            vaultCreator.address
          );

          await expect(
            autoVault.redeem(
              redeemAmount.toString(),
              vaultCreator.address,
              vaultCreator.address
            )
          )
            .to.emit(autoVault, "Withdraw")
            .withArgs(
              vaultCreator.address,
              vaultCreator.address,
              vaultCreator.address,
              assets.toString(),
              redeemAmount.toString()
            );

          const After = await getImportantInfo(
            autoVault,
            USDC,
            vaultCreator.address,
            vaultFactory.target,
            vaultCreator.address
          );
          assert.equal(
            Before.userBalance.sub(After.userBalance).toFixed(),
            redeemAmount.toFixed(),
            "vaultCreator balance should decrease by correct amount"
          );

          assert.equal(
            After.assetBalance.sub(Before.assetBalance).toFixed(),
            expectedAssetsEarned.toFixed()
          );
          if (vaultCreator.address == vaultCreator.address) {
            assert.equal(
              After.factoryBalance.sub(Before.factoryBalance).toFixed(),
              expectedFee.toFixed(),
              "Vault Factory received wrong fee"
            );
            assert.equal(
              After.vaultCreatorBalance
                .sub(Before.vaultCreatorBalance)
                .toFixed(),
              expectedAssetsEarned.toFixed(),
              "Vault Creator received wrong fee"
            );
          } else {
            assert.equal(
              After.factoryBalance.sub(Before.factoryBalance).toFixed(),
              expectedFee.dividedBy(FACTORY_SHARE).toFixed(),
              "Vault Factory received wrong fee"
            );
            assert.equal(
              After.vaultCreatorBalance
                .sub(Before.vaultCreatorBalance)
                .toFixed(),
              expectedFee.sub(expectedFee.dividedBy(FACTORY_SHARE)).toFixed(),
              "Vault Creator received wrong fee"
            );
          }
        });

        // Test deposit during withdraw period
        it("should allow deposits during withdraw period");

        // Test mint during withdraw period
        it("should allow minting during withdraw period");
      });

      // Test multiple users withdrawing
      it("should handle multiple users withdrawing during the same period");

      // Test initiating new withdraw period
      it("should not allow initiating a new withdraw period if one is active");

      // Test withdraw period duration
      it("should respect the withdraw period duration");
    });

    // Test emergency withdraw
    it("should allow emergency withdraw by vault manager");
  });

  // Test suite for regular operations outside withdraw period
  describe("Regular Operations", function () {
    // Setup before each test
    beforeEach(async function () {
      // Load the fixture and set up initial state without active trades
    });

    // Test normal deposit
    it("should allow normal deposits when no active trades");

    // Test normal withdraw
    it("should allow normal withdrawals when no active trades");

    // Test normal redeem
    it("should allow normal redemptions when no active trades");

    // Test normal mint
    it("should allow normal minting when no active trades");
  });

  // Test suite for edge cases and security
  describe("Edge Cases and Security", function () {
    // Test attempting to withdraw without initiating period
    it(
      "should prevent withdrawals when trades are active and no withdraw period is set"
    );

    // Test non-token holder attempting to initiate withdraw
    it("should prevent non-token holders from initiating withdraw period");

    // Test re-entering withdraw period
    it("should handle attempt to re-enter withdraw period");

    // Test withdraw period with zero balance
    it("should handle withdraw period initiation with zero balance");
  });
});
