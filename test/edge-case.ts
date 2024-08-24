import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { AutoVault } from "../typechain-types";
import { Context } from "./common-test";

import { expect } from "chai";
import { ethers } from "hardhat";
import {
  deployContractsFixture,
  createAutoVault,
  getAmount,
  openDummyTrade,
} from "./common-test";

describe("AutoVault Edge Cases and Security ", function () {
  let c: Context,
    autoVault: AutoVault,
    vaultCreator: SignerWithAddress,
    otherUser: SignerWithAddress;

  beforeEach(async () => {
    c = await deployContractsFixture();
    vaultCreator = c.vaultCreator;
    otherUser = c.otherUser;
    autoVault = await createAutoVault(c, "100", "0");
  });

  describe("Edge Cases and Security", function () {
    it("should prevent withdrawals when trades are active and no withdraw period is set ", async () => {
      // Open a dummy trade
      await openDummyTrade(autoVault, c);

      const withdrawAmount = await getAmount(c.USDC, "10");

      // Attempt to withdraw
      await expect(
        autoVault.withdraw(
          withdrawAmount.toFixed(),
          vaultCreator.address,
          vaultCreator.address
        )
      ).to.be.revertedWithCustomError(autoVault, "NeedCallback()");
    });
    it("should prevent non-token holders from initiating withdraw period", async () => {
      // Attempt to set withdraw period with non-token holder
      await expect(autoVault.connect(otherUser).setWithdrawPeriod())
        .to.be.revertedWithCustomError(autoVault, "NotTokenHolder")
        .withArgs(otherUser.address);
    });
    it("should handle attempt to re-enter withdraw period", async () => {
      // Set initial withdraw period
      await autoVault.setWithdrawPeriod();

      // Get the next withdraw period timestamp
      const nextWithdrawPeriod = await autoVault.nextWithdrawPeriod();

      // Attempt to set another withdraw period
      await expect(autoVault.setWithdrawPeriod()).to.be.revertedWithCustomError(
        autoVault,
        "WithdrawPeriodAlreadySet"
      );

      // Advance time past the withdraw period
      const threeHoursInSeconds = 60n * 60n * 3n;

      await ethers.provider.send("evm_mine", [
        (nextWithdrawPeriod + threeHoursInSeconds).toString(),
      ]);

      // Now setting a new withdraw period should work
      await expect(autoVault.setWithdrawPeriod()).to.emit(
        autoVault,
        "WithdrawPeriodSet"
      );
    });
    it("should handle withdraw period initiation with zero balance", async () => {
      // Transfer all tokens from vaultCreator to otherUser
      const balance = await autoVault.balanceOf(vaultCreator.address);
      await autoVault
        .connect(vaultCreator)
        .transfer(otherUser.address, balance);

      // Attempt to set withdraw period with zero balance
      await expect(autoVault.setWithdrawPeriod())
        .to.be.revertedWithCustomError(autoVault, "NotTokenHolder")
        .withArgs(vaultCreator.address);
    });
    it("should allow setting withdraw period immediately after ending forced withdraw period", async () => {
      // Force withdraw period
      await autoVault.forceWithdrawPeriod();

      // End withdraw period
      await autoVault.endWithdrawPeriod();

      // Set new withdraw period
      await expect(autoVault.setWithdrawPeriod()).to.emit(
        autoVault,
        "WithdrawPeriodSet"
      );
    });
  });
});
