import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

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
  impersonateOracleFulfill,
  previewDeposit,
  previewMint,
  previewRedeem,
  previewWithdraw,
} from "../utils/AutoGains";
import {
  AutoVault,
  VaultFactory,
  ERC20,
  FakeGainsNetwork,
  Helper,
  VaultFactory__factory,
} from "../typechain-types";
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

describe("AutoGains Withdraw Period Tests wuba", function () {
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
        //Other user adds funds to autoVault
        const depositAmount = await getAmount(c.otherUSDC, "50");
        await c.otherUSDC.approve(
          otherAutoVault.target,
          depositAmount.toFixed()
        );
        await otherAutoVault.deposit(
          depositAmount.toFixed(),
          c.otherUser.address
        );
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
        it("should allow withdrawals after all positions are closed ", async function () {
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
        }); // Test redeem after positions are closed
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
            vaultFactory,
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
        it("should allow deposits during withdraw period ", async function () {
          const { vaultCreator, vaultFactory, USDC } = c;

          const depositAmount = await getAmount(USDC, "100");
          await USDC.approve(autoVault.target, depositAmount.toFixed());

          const assets = await autoVault.previewDeposit.staticCall(
            depositAmount.toString()
          );

          const Before = await getImportantInfo(
            autoVault,
            USDC,
            vaultCreator.address,
            vaultFactory.target,
            vaultCreator.address
          );

          await expect(
            autoVault.deposit(depositAmount.toFixed(), vaultCreator.address)
          )
            .to.emit(autoVault, "Deposit")
            .withArgs(
              vaultCreator.address,
              vaultCreator.address,
              depositAmount.toFixed(),
              assets.toString()
            );

          const After = await getImportantInfo(
            autoVault,
            USDC,
            vaultCreator.address,
            vaultFactory.target,
            vaultCreator.address
          );

          assert.equal(
            After.userBalance.sub(Before.userBalance).toFixed(),
            assets.toString(),
            "User balance should increase by correct amount of shares"
          );

          assert.equal(
            Before.assetBalance.sub(After.assetBalance).toFixed(),
            depositAmount.toFixed(),
            "User asset balance should decrease by deposited amount"
          );

          if (vaultCreator.address === (await autoVault.vaultManager())) {
            assert.equal(
              After.factoryBalance.sub(Before.factoryBalance).toFixed(),
              "0",
              "Vault Factory received wrong fee"
            );
          }
        });
        it("should allow minting during withdraw period ", async function () {
          const { vaultCreator, vaultFactory, USDC } = c;

          const mintAmount = await getAmount(USDC, "100");

          const totalAssets = await autoVault.totalAssets();
          const assetsUsed = await autoVault.previewMint.staticCall(
            mintAmount.toString()
          );

          await USDC.approve(autoVault.target, assetsUsed.toString());

          const Before = await getImportantInfo(
            autoVault,
            USDC,
            vaultCreator.address,
            vaultFactory.target,
            vaultCreator.address
          );

          await expect(
            autoVault.mint(mintAmount.toFixed(), vaultCreator.address)
          )
            .to.emit(autoVault, "Deposit")
            .withArgs(
              vaultCreator.address,
              vaultCreator.address,
              assetsUsed.toString(),
              mintAmount.toFixed()
            );

          const After = await getImportantInfo(
            autoVault,
            USDC,
            vaultCreator.address,
            vaultFactory.target,
            vaultCreator.address
          );

          assert.equal(
            After.userBalance.sub(Before.userBalance).toFixed(),
            mintAmount.toFixed(),
            "User balance should increase by correct amount of shares"
          );

          assert.equal(
            Before.assetBalance.sub(After.assetBalance).toFixed(),
            assetsUsed.toString(),
            "User asset balance should decrease by correct amount of assets"
          );

          if (vaultCreator.address === (await autoVault.vaultManager())) {
            assert.equal(
              After.factoryBalance.sub(Before.factoryBalance).toFixed(),
              "0",
              "Vault Factory received wrong fee"
            );
          }
        });
        it("should handle multiple users withdrawing during the same period ", async function () {
          const { vaultCreator, otherUser, vaultFactory, USDC, otherUSDC } = c;

          // Prepare withdrawals for both users
          const withdrawAmount1 = await getAmount(USDC, "50");
          const withdrawAmount2 = await getAmount(USDC, "30");

          const assets1 = await autoVault.previewWithdraw.staticCall(
            withdrawAmount1.toString()
          );
          const assets2 = await otherAutoVault.previewWithdraw.staticCall(
            withdrawAmount2.toString()
          );

          const Before1 = await getImportantInfo(
            autoVault,
            USDC,
            vaultCreator.address,
            vaultFactory.target,
            vaultCreator.address
          );

          const Before2 = await getImportantInfo(
            otherAutoVault,
            otherUSDC,
            otherUser.address,
            vaultFactory.target,
            vaultCreator.address
          );

          // Perform withdrawals
          await expect(
            autoVault.withdraw(
              withdrawAmount1.toFixed(),
              vaultCreator.address,
              vaultCreator.address
            )
          )
            .to.emit(autoVault, "Withdraw")
            .withArgs(
              vaultCreator.address,
              vaultCreator.address,
              vaultCreator.address,
              withdrawAmount1.toFixed(),
              assets1.toString()
            );

          const totalAssets = new Decimal(
            (await otherAutoVault.totalAssets()).toString()
          );

          const { expectedAmount, expectedFee } = await previewWithdraw(
            vaultFactory,
            otherAutoVault,
            otherUser.address,
            withdrawAmount2,
            totalAssets
          );

          await expect(
            otherAutoVault.withdraw(
              withdrawAmount2.toFixed(),
              otherUser.address,
              otherUser.address
            )
          )
            .to.emit(autoVault, "Withdraw")
            .withArgs(
              otherUser.address,
              otherUser.address,
              otherUser.address,
              withdrawAmount2.toFixed(),
              assets2.toString()
            );

          const After1 = await getImportantInfo(
            autoVault,
            USDC,
            vaultCreator.address,
            vaultFactory.target,
            vaultCreator.address
          );

          const After2 = await getImportantInfo(
            autoVault,
            USDC,
            otherUser.address,
            vaultFactory.target,
            vaultCreator.address
          );

          //Calculate vaultMaker fee
          const vaultMakerFee = expectedFee.sub(
            expectedFee.dividedBy(2).floor()
          );
          // Check balances for first user
          assert.equal(
            Before1.userBalance.sub(After1.userBalance).toFixed(),
            assets1.toString(),
            "First user's balance should decrease by correct amount of shares"
          );

          assert.equal(
            After1.assetBalance.sub(Before1.assetBalance).toFixed(),
            withdrawAmount1.add(vaultMakerFee).toFixed(),
            "First user's asset balance should increase by withdrawn amount"
          );

          // Check balances for second user
          assert.equal(
            Before2.userBalance.sub(After2.userBalance).toFixed(),
            assets2.toString(),
            "Second user's balance should decrease by correct amount of shares"
          );

          assert.equal(
            After2.assetBalance.sub(Before2.assetBalance).toFixed(),
            withdrawAmount2.toFixed(),
            "Second user's asset balance should increase by withdrawn amount"
          );
        });
        it("should not allow initiating a new withdraw period if one is active ", async function () {
          const { vaultCreator } = c;

          // Set initial withdraw period
          await autoVault.setWithdrawPeriod();
          const initialWithdrawPeriod = await autoVault.nextWithdrawPeriod();

          // Attempt to set a new withdraw period
          await expect(
            autoVault.setWithdrawPeriod()
          ).to.be.revertedWithCustomError(
            autoVault,
            "WithdrawPeriodAlreadySet"
          );

          // Verify the withdraw period hasn't changed
          const currentWithdrawPeriod = await autoVault.nextWithdrawPeriod();
          assert.equal(
            currentWithdrawPeriod.toString(),
            initialWithdrawPeriod.toString(),
            "Withdraw period should not have changed"
          );
        });
        it("should respect the withdraw period duration ", async function () {
          const { vaultCreator } = c;

          // Set withdraw period
          await autoVault.setWithdrawPeriod();
          const withdrawPeriodStart = await autoVault.nextWithdrawPeriod();

          // Try to withdraw just before the period starts
          await expect(
            autoVault.startAction(vaultCreator.address, 1, 2, 0)
          ).to.be.revertedWithCustomError(autoVault, "NotYetWithdrawPeriod");

          // Move time to start of withdraw period
          await time.increaseTo(withdrawPeriodStart);

          // Withdrawal should now be possible
          await expect(autoVault.startAction(vaultCreator.address, 1, 2, 0)).to
            .not.be.reverted;

          // Move time to just before end of withdraw period
          const withdrawPeriodLength = await autoVault.withdrawPeriodLength();
          await time.increaseTo(
            BigInt(withdrawPeriodStart) + BigInt(withdrawPeriodLength) - 1n
          );

          // Withdrawal should still be possible
          await expect(autoVault.startAction(vaultCreator.address, 1, 2, 0)).to
            .not.be.reverted;

          // Move time past end of withdraw period
          await time.increaseTo(
            BigInt(withdrawPeriodStart) + BigInt(withdrawPeriodLength) + 1n
          );

          // Withdrawal should now be impossible
          await expect(
            autoVault.startAction(vaultCreator.address, 1, 2, 0)
          ).to.be.revertedWithCustomError(autoVault, "PastWithdrawPeriod");
        });
        describe("Withdraw Period Restrictions", function () {
          let c: Context;
          let autoVault: AutoVault;

          beforeEach(async function () {
            c = await deployContractsFixture();
            autoVault = await createAutoVault(c, "100", "1");
            await openDummyTrade(autoVault, c);
          });
        });
      });
      describe("Withdraw Period Restrictions", function () {
        let c: Context;
        let autoVault: AutoVault;

        beforeEach(async function () {
          c = await deployContractsFixture();
          autoVault = await createAutoVault(c, "100", "1");
          await openDummyTrade(autoVault, c);
        });

        it("should not allow strategy execution during withdraw period ", async function () {
          const { vaultCreator } = c;

          // Set withdraw period
          await autoVault.setWithdrawPeriod();
          const withdrawPeriodStart = await autoVault.nextWithdrawPeriod();

          // Move time to start of withdraw period
          await time.increaseTo(withdrawPeriodStart);

          // Attempt to execute strategy
          await expect(
            autoVault.executeStrategy(0)
          ).to.be.revertedWithCustomError(
            autoVault,
            "NoTradesDuringWithdrawPeriod"
          );

          // Move time to just before end of withdraw period
          const withdrawPeriodLength = await autoVault.withdrawPeriodLength();
          await time.increaseTo(
            BigInt(withdrawPeriodStart) + BigInt(withdrawPeriodLength) - 1n
          );

          // Attempt to execute strategy again
          await expect(
            autoVault.executeStrategy(0)
          ).to.be.revertedWithCustomError(
            autoVault,
            "NoTradesDuringWithdrawPeriod"
          );

          // Move time past end of withdraw period
          await time.increaseTo(
            BigInt(withdrawPeriodStart) + BigInt(withdrawPeriodLength) + 1n
          );

          // Strategy execution should now be possible
          await expect(autoVault.executeStrategy(0)).to.not.be.reverted;
        });

        it("should not allow fulfill during withdraw period ", async function () {
          const { vaultCreator, vaultFactory } = c;

          // Set withdraw period
          await autoVault.setWithdrawPeriod();
          const withdrawPeriodStart = await autoVault.nextWithdrawPeriod();

          const requestID = await autoVault.executeStrategy.staticCall(0);
          await autoVault.executeStrategy(0);

          // Move time to start of withdraw period
          await time.increaseTo(withdrawPeriodStart);

          // Attempt to fulfill

          const dummyData = [1];

          await expect(
            impersonateOracleFulfill(vaultFactory, requestID, dummyData, 0)
          ).to.be.revertedWithCustomError(
            autoVault,
            "NoTradesDuringWithdrawPeriod"
          );

          // Move time to just before end of withdraw period
          const withdrawPeriodLength = await autoVault.withdrawPeriodLength();
          await time.increaseTo(
            BigInt(withdrawPeriodStart) + BigInt(withdrawPeriodLength) - 1n
          );

          // Attempt to fulfill again
          await expect(
            impersonateOracleFulfill(vaultFactory, requestID, dummyData, 0)
          ).to.be.revertedWithCustomError(
            autoVault,
            "NoTradesDuringWithdrawPeriod"
          );

          // Move time past end of withdraw period
          await time.increaseTo(
            BigInt(withdrawPeriodStart) + BigInt(withdrawPeriodLength) + 1n
          );

          // Fulfill should now be possible (it might revert for other reasons, but not because of the withdraw period)
          await expect(
            impersonateOracleFulfill(vaultFactory, requestID, dummyData, 0)
          ).to.not.be.revertedWithCustomError(
            autoVault,
            "NoTradesDuringWithdrawPeriod"
          );
        });
      });
    });
    describe("Force Withdraw Period ", function () {
      it("should allow the owner to force a withdraw period", async function () {
        expect(await autoVault.isWithdrawPeriod()).to.be.false;

        await expect(autoVault.forceWithdrawPeriod())
          .to.emit(autoVault, "WithdrawPeriodTriggered")
          .withArgs();

        expect(await autoVault.isWithdrawPeriod()).to.be.true;
      });

      it("should revert if called by non-owner", async function () {
        const { vaultCreator, vaultFactory } = c;

        await expect(
          otherAutoVault.forceWithdrawPeriod()
        ).to.be.revertedWithCustomError(autoVault, "VaultManagerOnly");
      });

      it("should revert if withdraw period is already active", async function () {
        await autoVault.forceWithdrawPeriod();

        await expect(
          autoVault.forceWithdrawPeriod()
        ).to.be.revertedWithCustomError(
          autoVault,
          "WithdrawPeriodAlreadyActive"
        );
      });
    });
    describe("End Withdraw Period ", function () {
      beforeEach(async function () {
        await autoVault.forceWithdrawPeriod();
      });

      it("should allow the owner to end a withdraw period", async function () {
        expect(await autoVault.isWithdrawPeriod()).to.be.true;

        await expect(autoVault.endWithdrawPeriod())
          .to.emit(autoVault, "WithdrawPeriodEnded")
          .withArgs();

        expect(await autoVault.isWithdrawPeriod()).to.be.false;
      });

      it("should revert if called by non-owner", async function () {
        await expect(
          otherAutoVault.endWithdrawPeriod()
        ).to.be.revertedWithCustomError(autoVault, "VaultManagerOnly");
      });

      it("should revert if no active withdraw period", async function () {
        await autoVault.endWithdrawPeriod();

        await expect(
          autoVault.endWithdrawPeriod()
        ).to.be.revertedWithCustomError(
          autoVault,
          "WithdrawPeriodAlreadyEnded"
        );
      });
    });
  });
});
