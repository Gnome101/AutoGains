import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
//@ts-ignore
import { ethers, deployments, userConfig, network } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

import { Deployment } from "hardhat-deploy/dist/types";
import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object
import {
  AutoVault,
  ERC20,
  FakeGainsNetwork,
  Helper,
  IGainsNetwork,
  VaultFactory,
} from "../typechain-types";
import {
  impersonateOracleFulfill,
  impersonateOracleDoVaultAction,
  previewDeposit,
  previewMint,
  previewWithdraw,
  previewRedeem,
} from "../utils/AutoGains";
import { Decimal } from "decimal.js";
import dotenv from "dotenv";
import { trace } from "console";
import { FEE_MULTIPLIER_SCALE } from "@gainsnetwork/sdk";
import { AddressLike, FallbackFragment, MinInt256 } from "ethers";

import { TradeStruct } from "../typechain-types/contracts/Gains Contracts/IGainsNetwork";
import { equal } from "assert";

dotenv.config();

describe("Vault Tests eeep", function () {
  let accounts: SignerWithAddress[];
  let otherUser: SignerWithAddress;
  let vaultCreator: SignerWithAddress;

  let vaultFactory: VaultFactory;
  let Helper: Helper;

  let USDC: ERC20;
  let otherUSDC: ERC20;
  let WETH: ERC20;
  let DAI: ERC20;
  let FakeGainsNetwork: FakeGainsNetwork;

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
  const MIN_DEPOSIT = new Decimal("10000");

  beforeEach(async () => {
    const chainID = network.config.chainId;
    if (chainID == undefined) throw "Cannot find chainID";

    accounts = (await ethers.getSigners()) as unknown as SignerWithAddress[]; // could also do with getNamedAccounts
    otherUser = accounts[0];

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

    FakeGainsNetwork = (await ethers.getContractAt(
      "FakeGainsNetwork",
      fakeGainsContract.address.toString(),
      vaultCreator
    )) as unknown as FakeGainsNetwork;

    const factoryContract = (await deployments.get(
      "VaultFactory"
    )) as Deployment;

    vaultFactory = (await ethers.getContractAt(
      "VaultFactory",
      factoryContract.address.toString(),
      vaultCreator
    )) as unknown as VaultFactory;

    const helperContract = (await deployments.get("Helper")) as Deployment;

    Helper = (await ethers.getContractAt(
      "Helper",
      helperContract.address.toString(),
      vaultCreator
    )) as unknown as Helper;

    USDC = (await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
      contracts[chainID].USDC,
      vaultCreator
    )) as unknown as ERC20;

    otherUSDC = (await ethers.getContractAt(
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

    MIN_FEE = await getAmount(USDC, "0.85");
  });

  it("can create a vault with 1 strategy  ", async () => {
    const initalAmount = await getAmount(USDC, "100");

    await USDC.approve(vaultFactory.target, initalAmount.toFixed());

    const APIInfos = [
      {
        method: "",
        url: "",
        headers: "",
        body: "",
        path: "",
        jobIDs: "",
      },
    ] as VaultFactory.APIInfoStruct[];
    //According to ChatGPT, if RSI is above 70 then its too high. If its below 30 then its too low
    //So what I will do is have two strategies, if the RSI goes to 50 then it will close either position
    //if 70 < x1 then longBTC else do nothing
    const longAciton = await Helper.createOpenTradeAction(
      1000,
      0,
      5000,
      true,
      true,
      3,
      0,
      200000, // Should be 2%
      10000000,
      12000000,
      8000000
    );
    const decimals = new Decimal(10).pow(18);

    // if x1< 70 then longAction else nothing
    const longStrategy = [
      18,
      15,
      1,
      0,
      0,
      new Decimal(70).mul(decimals).toFixed(),
      0,
      longAciton,
      0,
      0,
    ];

    const vaultAddress = await vaultFactory.createVault.staticCall(
      USDC,
      initalAmount.toFixed(),
      APIInfos,
      [longStrategy] as number[][],
      "AutoGainsUSDC",
      "aUSDC"
    );
    const vaultFactoryBalanceBefore = toDecimal(
      await USDC.balanceOf(vaultFactory.target)
    );

    await vaultFactory.createVault(
      USDC,
      initalAmount.toFixed(),
      APIInfos,
      [longStrategy],
      "AutoGainsUSDC",
      "aUSDC"
    );
    let autoVault = (await ethers.getContractAt(
      "AutoVault",
      vaultAddress,
      vaultCreator
    )) as unknown as AutoVault;

    const userVaultBalance = await autoVault.balanceOf(vaultCreator.address);
    const vaultFactoryBalanceAfter = toDecimal(
      await USDC.balanceOf(vaultFactory.target)
    );

    //Assuming a deposit fee of 0
    //The vaultOwner does not face a fee;2
    //With Deposit Fees, userVaultBalance - userVaultBalance * DepositFee = initalAmount
    //My balance should be equal to the inital deposit
    // const expectedFee = new Decimal(initalAmount)
    //   .mul(ENTRY_FEE)
    //   .dividedBy(MOVEMENT_FEE_SCALE);

    const expectedAmount = new Decimal(initalAmount);

    assert.equal(
      userVaultBalance.toString(),
      expectedAmount.toFixed(),
      `Actual Vault Balance is different than expected`
    );
    assert.equal(
      (await USDC.balanceOf(autoVault.target)).toString(),
      initalAmount.toFixed(),
      "Vault did not recieve inital amount"
    );

    assert.equal(
      vaultFactoryBalanceAfter.sub(vaultFactoryBalanceBefore).toFixed(),
      "0",
      "Vault Factory got fee"
    );
  });
  describe("Vault Created ", function () {
    let autoVault: AutoVault;
    let otherAutoVault: AutoVault;
    const decimals = new Decimal(10).pow(18);
    beforeEach(async () => {
      const initalAmount = await getAmount(USDC, "100");

      await USDC.approve(vaultFactory.target, initalAmount.toFixed());

      const APIInfos = [
        {
          method: "",
          url: "",
          headers: "",
          body: "",
          path: "",
          jobIDs: "",
        },
      ] as VaultFactory.APIInfoStruct[];
      //According to ChatGPT, if RSI is above 70 then its too high. If its below 30 then its too low
      //So what I will do is have two strategies, if the RSI goes to 50 then it will close either position
      //if 70 < x1 then longBTC else do nothing
      const longAciton = await Helper.createOpenTradeAction(
        1000,
        0,
        5000,
        true,
        true,
        collateralIndex,
        0,
        200000, // Should be 2%
        10000000,
        12000000,
        8000000
      );
      const decimals = new Decimal(10).pow(18);

      // if x1 >  70 then longAction else nothing
      const longStrategy = [
        18,
        15,
        1,
        0,
        0,
        new Decimal(70).mul(decimals).toFixed(),
        0,
        longAciton,
        0,
        0,
      ];

      const vaultAddress = await vaultFactory.createVault.staticCall(
        USDC,
        initalAmount.toFixed(),
        APIInfos,
        [longStrategy] as number[][],
        "AutoGainsUSDC",
        "aUSDC"
      );
      console.log("\nForming the vault ");
      await vaultFactory.createVault(
        USDC,
        initalAmount.toFixed(),
        APIInfos,
        [longStrategy],
        "AutoGainsUSDC",
        "aUSDC"
      );
      await time.increase(61);
      autoVault = (await ethers.getContractAt(
        "AutoVault",
        vaultAddress,
        vaultCreator
      )) as unknown as AutoVault;

      otherAutoVault = (await ethers.getContractAt(
        "AutoVault",
        vaultAddress,
        otherUser
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
    });
    describe("Basic Fucntions ", function () {
      it("creator can deposit for no fee ", async () => {
        const depositAmount = await getAmount(USDC, "2");
        await USDC.approve(autoVault.target, depositAmount.toFixed());
        const userBalanceBefore = new Decimal(
          (await autoVault.balanceOf(vaultCreator.address)).toString()
        );

        const expectedShares = await autoVault.deposit.staticCall(
          depositAmount.toFixed(),
          vaultCreator.address
        );

        await autoVault.deposit(depositAmount.toFixed(), vaultCreator.address);

        assert.equal(
          (await autoVault.balanceOf(vaultCreator.address)).toString(),
          userBalanceBefore.add(expectedShares.toString()).toFixed()
        );
      });
      it("other user can deposit for a fee ", async () => {
        console.log("\n Stragint test");
        const depositAmount = await getAmount(USDC, "2");
        await otherUSDC.approve(autoVault.target, depositAmount.toFixed());

        const expectedFee = calculateFeeOnTotal(depositAmount, ENTRY_FEE);
        const totalAssets = new Decimal(
          (await autoVault.totalAssets()).toString()
        );
        const totalSupply = new Decimal(
          (await autoVault.totalSupply()).toString()
        );
        const expectedShares = depositAmount
          .sub(expectedFee)
          .mul(totalSupply.plus(1))
          .dividedBy(totalAssets.plus(1))
          .floor();

        const Before = await getImportantInfo(
          otherAutoVault,
          USDC,
          otherUser.address
        );

        await otherAutoVault.deposit(
          depositAmount.toFixed(),
          otherUser.address
        );

        const After = await getImportantInfo(
          otherAutoVault,
          USDC,
          otherUser.address
        );

        assert.equal(
          After.userBalance.sub(Before.userBalance).toFixed(),
          expectedShares.toString(),
          "User balance increase by wrong amount"
        );
        assert.equal(
          After.factoryBalance.sub(Before.factoryBalance).toFixed(),
          expectedFee.dividedBy(FACTORY_SHARE).toFixed(),
          "Vault Factory recieved wrong fee"
        );
        assert.equal(
          After.vaultCreatorBalance.sub(Before.vaultCreatorBalance).toFixed(),
          expectedFee.sub(expectedFee.dividedBy(FACTORY_SHARE)).toFixed(),
          "Vault Creator recieved wrong fee"
        );
      });
      it("vaultCreator can mint for no fee ", async () => {
        const depositAmount = await getAmount(USDC, "2");
        await USDC.approve(autoVault.target, depositAmount.toFixed());
        const userBalanceBefore = new Decimal(
          (await autoVault.balanceOf(vaultCreator.address)).toString()
        );
        const expectedShares = depositAmount;

        await autoVault.mint(depositAmount.toFixed(), vaultCreator.address);

        assert.equal(
          (await autoVault.balanceOf(vaultCreator.address)).toString(),
          userBalanceBefore.add(expectedShares.toString()).toFixed()
        );
      });
      it("other user can mint for a fee ", async () => {
        const mintAmount = await getAmount(otherAutoVault, "2");

        const totalAssets = new Decimal(
          (await autoVault.totalAssets()).toString()
        );

        const totalSupply = new Decimal(
          (await autoVault.totalSupply()).toString()
        );

        let expectedAssetsPaid = mintAmount
          .mul(totalAssets.plus(1))
          .dividedBy(totalSupply.plus(1))
          .ceil();

        const expectedFee = calculateFeeOnRaw(expectedAssetsPaid, ENTRY_FEE);
        expectedAssetsPaid = expectedAssetsPaid.plus(expectedFee);
        console.log(mintAmount, "expected", expectedFee);

        const Before = await getImportantInfo(
          otherAutoVault,
          USDC,
          otherUser.address
        );

        await otherUSDC.approve(autoVault.target, expectedAssetsPaid.toFixed());
        await otherAutoVault.mint(mintAmount.toFixed(), otherUser.address);

        const After = await getImportantInfo(
          otherAutoVault,
          USDC,
          otherUser.address
        );
        assert.equal(
          After.userBalance.sub(Before.userBalance).toFixed(),
          mintAmount.toString(),
          "User balance increase by wrong amount"
        );
        assert.equal(
          Before.assetBalance.sub(After.assetBalance).toFixed(),
          expectedAssetsPaid.toFixed(),
          "User charged an incorrect amount"
        );
        assert.equal(
          After.factoryBalance.sub(Before.factoryBalance).toFixed(),
          expectedFee.dividedBy(FACTORY_SHARE).toFixed(),
          "Vault Factory recieved wrong fee"
        );
        assert.equal(
          After.vaultCreatorBalance.sub(Before.vaultCreatorBalance).toFixed(),
          expectedFee.sub(expectedFee.dividedBy(FACTORY_SHARE)).toFixed(),
          "Vault Creator recieved wrong fee"
        );
      });
      describe("Removing Funds", function () {
        beforeEach(async () => {
          //We need to deposit funds for otherUser
          const depositAmount = await getAmount(USDC, "3");
          await otherUSDC.approve(autoVault.target, depositAmount.toFixed());

          await otherAutoVault.deposit(
            depositAmount.toFixed(),
            otherUser.address
          );
          await time.increase(61);
        });
        it("vaultCreator can withdraw for no fee ", async () => {
          const depositAmount = await getAmount(USDC, "2");
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(vaultCreator.address)).toString()
          );
          const expectedSharesTaken = await autoVault.withdraw.staticCall(
            depositAmount.toFixed(),
            vaultCreator.address,
            vaultCreator.address
          );
          await autoVault.withdraw(
            depositAmount.toFixed(),
            vaultCreator.address,
            vaultCreator.address
          );
          assert.equal(
            (await autoVault.balanceOf(vaultCreator.address)).toString(),
            userBalanceBefore.sub(expectedSharesTaken.toString()).toFixed()
          );
        });
        it("other user can withdraw for a fee ", async () => {
          const withdrawAmount = await getAmount(USDC, ".5");

          const expectedFee = calculateFeeOnRaw(withdrawAmount, EXIT_FEE);

          const totalAssets = new Decimal(
            (await autoVault.totalAssets()).toString()
          );
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          const expectedShares = withdrawAmount
            .plus(expectedFee)
            .mul(totalSupply.plus(1))
            .dividedBy(totalAssets.plus(1))
            .ceil();

          console.log(withdrawAmount, "expected", expectedFee);

          const Before = await getImportantInfo(
            otherAutoVault,
            USDC,
            otherUser.address
          );

          await otherAutoVault.withdraw(
            withdrawAmount.toFixed(),
            otherUser.address,
            otherUser.address
          );

          const After = await getImportantInfo(
            otherAutoVault,
            USDC,
            otherUser.address
          );

          assert.equal(
            Before.userBalance.sub(After.userBalance).toFixed(),
            expectedShares.toFixed(),
            "User Shares decreased by wrong amount"
          );
          assert.equal(
            After.assetBalance.sub(Before.assetBalance).toFixed(),
            withdrawAmount.toFixed(),
            "User paid an incorrect amount"
          );
          assert.equal(
            After.factoryBalance.sub(Before.factoryBalance).toFixed(),
            expectedFee.dividedBy(FACTORY_SHARE).toFixed(),
            "Vault Factory recieved wrong fee"
          );
          assert.equal(
            After.vaultCreatorBalance.sub(Before.vaultCreatorBalance).toFixed(),
            expectedFee.sub(expectedFee.dividedBy(FACTORY_SHARE)).toFixed(),
            "Vault Creator recieved wrong fee"
          );
        });
        it("vaultCreator can redeem ", async () => {
          const redeemAmount = await getAmount(USDC, "2");
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(vaultCreator.address)).toString()
          );
          const expectedSharesTaken = await autoVault.redeem.staticCall(
            redeemAmount.toFixed(),
            vaultCreator.address,
            vaultCreator.address
          );

          await autoVault.redeem(
            redeemAmount.toFixed(),
            vaultCreator.address,
            vaultCreator.address
          );
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(vaultCreator.address)).toString()
          );
          assert.equal(
            redeemAmount.toString(),
            userBalanceBefore.sub(userBalanceAfter).toFixed()
          );
        });
        it("other user can redeem for a fee gyattt", async () => {
          const redeemAmount = await getAmount(otherAutoVault, "1");
          const totalAssets = new Decimal(
            (await autoVault.totalAssets()).toString()
          );

          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );

          let expectedAssets = redeemAmount
            .mul(totalAssets.plus(1))
            .dividedBy(totalSupply.plus(1))
            .floor();

          const expectedFee = calculateFeeOnTotal(expectedAssets, EXIT_FEE);
          expectedAssets = expectedAssets.sub(expectedFee);
          const Before = await getImportantInfo(
            otherAutoVault,
            USDC,
            otherUser.address
          );
          await otherAutoVault.redeem(
            redeemAmount.toFixed(),
            otherUser.address,
            otherUser.address
          );
          const After = await getImportantInfo(
            otherAutoVault,
            USDC,
            otherUser.address
          );
          assert.equal(
            Before.userBalance.sub(After.userBalance).toFixed(),
            redeemAmount.toString(),
            "User Shares decreased by wrong amount"
          );
          assert.equal(
            After.assetBalance.sub(Before.assetBalance).toFixed(),
            expectedAssets.toFixed(),
            "User paid an incorrect amount"
          );
          assert.equal(
            After.factoryBalance.sub(Before.factoryBalance).toFixed(),
            expectedFee.dividedBy(FACTORY_SHARE).floor().toFixed(),
            "Vault Factory recieved wrong fee"
          );
          assert.equal(
            After.vaultCreatorBalance.sub(Before.vaultCreatorBalance).toFixed(),
            expectedFee
              .sub(expectedFee.dividedBy(FACTORY_SHARE).floor())
              .toFixed(),
            "Vault Creator recieved wrong fee"
          );
        });
      });
    });
    describe("Active Trade ", async () => {
      beforeEach(async () => {
        let requestID = await autoVault.executeStrategy.staticCall(0);
        const tx3 = await autoVault.executeStrategy(0);
        await tx3.wait();
        const x = new Decimal(10).pow(18);
        const currentPrice = new Decimal(60).mul(x);
        let input = [
          currentPrice.toFixed(),
          new Decimal(80).mul(decimals).toFixed(),
        ];

        expect(
          await impersonateOracleFulfill(vaultFactory, requestID, input, 0)
        ).to.emit(FakeGainsNetwork, "OpenTradeCalled");
      });
      it("action should revert without getting collateral value awwaw", async () => {
        const depositAmount = await getAmount(USDC, "2");
        await USDC.approve(autoVault.target, depositAmount.toFixed());

        await expect(
          autoVault.deposit(depositAmount.toFixed(), vaultCreator.address)
        ).to.be.rejectedWith("NeedCallback()");
      });
      describe("Collateral is worth the same ", function () {
        let totalCollateral = new Decimal("0");
        let collateralAmounts = [] as Decimal[];
        const collateralWorth = new Decimal("1");
        beforeEach(async () => {
          totalCollateral = new Decimal("0");
          collateralAmounts = [] as Decimal[];

          const trades = await FakeGainsNetwork.getTrades(autoVault.target);
          for (const trade of trades) {
            const collateralAmount = trade.collateralAmount;

            collateralAmounts.push(new Decimal(collateralAmount.toString()));
            totalCollateral = totalCollateral.plus(collateralAmount.toString());
          }
          totalCollateral = totalCollateral.mul(collateralWorth).floor();
        });

        describe("Vault Creator", function () {
          it("deposit should work with minimal fee ", async () => {
            await test_deposit(
              USDC,
              autoVault,
              totalCollateral,
              vaultCreator,
              vaultFactory,
              MOVEMENT_FEE_SCALE
            );
          });
          it("mint should work with minimal fee test_mint", async () => {
            await test_mint(
              USDC,
              autoVault,
              totalCollateral,
              vaultCreator,
              vaultFactory,
              FACTORY_SHARE
            );
          });
        });
        describe("Other User ", function () {
          beforeEach(async () => {
            const depositAmount = await getAmount(USDC, "4");
            await otherUSDC.approve(
              otherAutoVault.target,
              depositAmount.toFixed()
            );
            const assetsInVault = await USDC.balanceOf(autoVault.target);
            const totalAssets = totalCollateral.plus(assetsInVault.toString());
            const totalSupply = new Decimal(
              (await autoVault.totalSupply()).toString()
            );
            const choice = 0;
            const expectedFee = calculateFeeOnTotal(depositAmount, ENTRY_FEE);
            const expectedShares = depositAmount
              .sub(expectedFee)
              .mul(totalSupply.plus(1))
              .dividedBy(totalAssets.plus(1))
              .floor();
            const requestID = await otherAutoVault.startAction.staticCall(
              otherUser.address,
              depositAmount.toFixed(),
              choice,
              expectedShares.toFixed()
            );

            await otherAutoVault.startAction(
              otherUser.address,
              depositAmount.toFixed(),
              choice,
              expectedShares.toFixed()
            );
            const input = [totalCollateral.toFixed()];

            await impersonateOracleDoVaultAction(
              vaultFactory,
              requestID,
              input,
              Number(await USDC.decimals()),
              0
            );
            await time.increase(61);
          });
          it("deposit should work with a fee hyuu", async () => {
            await test_deposit(
              otherUSDC,
              otherAutoVault,
              totalCollateral,
              otherUser,
              vaultFactory,
              FACTORY_SHARE
            );
          });
          it("mint should work with a fee ", async () => {
            await test_mint(
              otherUSDC,
              otherAutoVault,
              totalCollateral,
              otherUser,
              vaultFactory,
              FACTORY_SHARE
            );
          });
        });
        //To beat the cooldown period, one could deposit, then transfer to another address, then
      });
      describe("Collateral is worth less ", function () {
        let totalCollateral = new Decimal("0");
        let collateralAmounts = [] as Decimal[];
        const collateralWorth = new Decimal("0.5");
        beforeEach(async () => {
          totalCollateral = new Decimal("0");
          collateralAmounts = [] as Decimal[];

          const trades = await FakeGainsNetwork.getTrades(autoVault.target);
          for (const trade of trades) {
            const collateralAmount = trade.collateralAmount;

            collateralAmounts.push(new Decimal(collateralAmount.toString()));
            totalCollateral = totalCollateral.plus(collateralAmount.toString());
          }
          totalCollateral = totalCollateral.mul(collateralWorth).floor();
        });
        describe("Vault Creator ", function () {
          it("deposit should work with minimal fee wasaw", async () => {
            console.log(`Starting test...`);
            await test_deposit(
              USDC,
              autoVault,
              totalCollateral,
              vaultCreator,
              vaultFactory,
              FACTORY_SHARE
            );
          });
          it("mint should work with minimal fee ", async () => {
            await test_mint(
              USDC,
              autoVault,
              totalCollateral,
              vaultCreator,
              vaultFactory,
              FACTORY_SHARE
            );
          });
        });
        describe("Other User ", function () {
          beforeEach(async () => {
            const depositAmount = await getAmount(USDC, "4");
            await otherUSDC.approve(
              otherAutoVault.target,
              depositAmount.toFixed()
            );
            const assetsInVault = await USDC.balanceOf(autoVault.target);
            const totalAssets = totalCollateral.plus(assetsInVault.toString());
            const totalSupply = new Decimal(
              (await autoVault.totalSupply()).toString()
            );
            const choice = 0;
            const expectedFee = calculateFeeOnTotal(depositAmount, ENTRY_FEE);
            const expectedShares = depositAmount
              .sub(expectedFee)
              .mul(totalSupply.plus(1))
              .dividedBy(totalAssets.plus(1))
              .floor();
            const requestID = await otherAutoVault.startAction.staticCall(
              otherUser.address,
              depositAmount.toFixed(),
              choice,
              expectedShares.toFixed()
            );

            await otherAutoVault.startAction(
              otherUser.address,
              depositAmount.toFixed(),
              choice,
              expectedShares.toFixed()
            );
            const input = [totalCollateral.toFixed()];

            await impersonateOracleDoVaultAction(
              vaultFactory,
              requestID,
              input,
              Number(await USDC.decimals()),
              0
            );
            await time.increase(61);
          });
          it("deposit should work with a fee test_deposit", async () => {
            await test_deposit(
              otherUSDC,
              otherAutoVault,
              totalCollateral,
              otherUser,
              vaultFactory,
              FACTORY_SHARE
            );
          });
          it("mint should work with a fee ", async () => {
            await test_mint(
              otherUSDC,
              otherAutoVault,
              totalCollateral,
              otherUser,
              vaultFactory,
              FACTORY_SHARE
            );
          });
        });
      });
      describe("Collateral is worth 0 ", function () {
        let totalCollateral = new Decimal("0");
        let collateralAmounts = [] as Decimal[];
        const collateralWorth = new Decimal("0");
        beforeEach(async () => {
          totalCollateral = new Decimal("0");
          collateralAmounts = [] as Decimal[];

          const trades = await FakeGainsNetwork.getTrades(autoVault.target);
          for (const trade of trades) {
            const collateralAmount = trade.collateralAmount;

            collateralAmounts.push(new Decimal(collateralAmount.toString()));
            totalCollateral = totalCollateral.plus(collateralAmount.toString());
          }
          totalCollateral = totalCollateral.mul(collateralWorth).floor();
        });
        describe("Vault Creator ", function () {
          it("deposit should work with minimal fee ", async () => {
            await test_deposit(
              USDC,
              autoVault,
              totalCollateral,
              vaultCreator,
              vaultFactory,
              FACTORY_SHARE
            );
          });
          it("mint should work with minimal fee ", async () => {
            await test_mint(
              USDC,
              autoVault,
              totalCollateral,
              vaultCreator,
              vaultFactory,
              FACTORY_SHARE
            );
          });
        });
        describe("Other User ", function () {
          beforeEach(async () => {
            const depositAmount = await getAmount(USDC, "4");
            await otherUSDC.approve(
              otherAutoVault.target,
              depositAmount.toFixed()
            );
            const assetsInVault = await USDC.balanceOf(autoVault.target);
            const totalAssets = totalCollateral.plus(assetsInVault.toString());
            const totalSupply = new Decimal(
              (await autoVault.totalSupply()).toString()
            );
            const choice = 0;
            const expectedFee = calculateFeeOnTotal(depositAmount, ENTRY_FEE);
            const expectedShares = depositAmount
              .sub(expectedFee)
              .mul(totalSupply.plus(1))
              .dividedBy(totalAssets.plus(1))
              .floor();
            const requestID = await otherAutoVault.startAction.staticCall(
              otherUser.address,
              depositAmount.toFixed(),
              choice,
              expectedShares.toFixed()
            );

            await otherAutoVault.startAction(
              otherUser.address,
              depositAmount.toFixed(),
              choice,
              expectedShares.toFixed()
            );
            const input = [totalCollateral.toFixed()];

            await impersonateOracleDoVaultAction(
              vaultFactory,
              requestID,
              input,
              Number(await USDC.decimals()),
              0
            );
            await time.increase(61);
          });
          it("deposit should work with a fee ", async () => {
            await test_deposit(
              otherUSDC,
              otherAutoVault,
              totalCollateral,
              otherUser,
              vaultFactory,
              FACTORY_SHARE
            );
          });
          it("mint should work with a fee ", async () => {
            await test_mint(
              otherUSDC,
              otherAutoVault,
              totalCollateral,
              otherUser,
              vaultFactory,
              FACTORY_SHARE
            );
          });
        });
      });
      describe("Collateral is worth more ", function () {
        let totalCollateral = new Decimal("0");
        let collateralAmounts = [] as Decimal[];
        const collateralWorth = new Decimal("1.5");
        beforeEach(async () => {
          totalCollateral = new Decimal("0");
          collateralAmounts = [] as Decimal[];

          const trades = await FakeGainsNetwork.getTrades(autoVault.target);
          for (const trade of trades) {
            const collateralAmount = trade.collateralAmount;

            collateralAmounts.push(new Decimal(collateralAmount.toString()));
            totalCollateral = totalCollateral.plus(collateralAmount.toString());
          }
          totalCollateral = totalCollateral.mul(collateralWorth).floor();
        });
        describe("Vault Creator ", function () {
          it("deposit should work with minimal fee ", async () => {
            await test_deposit(
              USDC,
              autoVault,
              totalCollateral,
              vaultCreator,
              vaultFactory,
              FACTORY_SHARE
            );
          });
          it("mint should work with minimal fee ", async () => {
            await test_mint(
              USDC,
              autoVault,
              totalCollateral,
              vaultCreator,
              vaultFactory,
              FACTORY_SHARE
            );
          });
        });
        describe("Other User ", function () {
          beforeEach(async () => {
            const depositAmount = await getAmount(USDC, "4");
            await otherUSDC.approve(
              otherAutoVault.target,
              depositAmount.toFixed()
            );
            const assetsInVault = await USDC.balanceOf(autoVault.target);
            const totalAssets = totalCollateral.plus(assetsInVault.toString());
            const totalSupply = new Decimal(
              (await autoVault.totalSupply()).toString()
            );
            const choice = 0;
            const expectedFee = calculateFeeOnTotal(depositAmount, ENTRY_FEE);
            const expectedShares = depositAmount
              .sub(expectedFee)
              .mul(totalSupply.plus(1))
              .dividedBy(totalAssets.plus(1))
              .floor();
            const requestID = await otherAutoVault.startAction.staticCall(
              otherUser.address,
              depositAmount.toFixed(),
              choice,
              expectedShares.toFixed()
            );

            await otherAutoVault.startAction(
              otherUser.address,
              depositAmount.toFixed(),
              choice,
              expectedShares.toFixed()
            );
            const input = [totalCollateral.toFixed()];

            await impersonateOracleDoVaultAction(
              vaultFactory,
              requestID,
              input,
              Number(await USDC.decimals()),
              0
            );
            await time.increase(61);
          });
          it("deposit should work with a fee ", async () => {
            await test_deposit(
              otherUSDC,
              otherAutoVault,
              totalCollateral,
              otherUser,
              vaultFactory,
              FACTORY_SHARE
            );
          });
          it("mint should work with a fee ", async () => {
            await test_mint(
              otherUSDC,
              otherAutoVault,
              totalCollateral,
              otherUser,
              vaultFactory,
              FACTORY_SHARE
            );
          });
        });
      });
    });
    function calculateFeeOnTotal(assets: Decimal, feeAmount: Decimal): Decimal {
      return Decimal.max(
        assets
          .mul(feeAmount)
          .dividedBy(feeAmount.plus(MOVEMENT_FEE_SCALE))
          .ceil(),
        MIN_FEE
      );
    }
    function calculateFeeOnRaw(assets: Decimal, feeAmount: Decimal) {
      return Decimal.max(
        assets.mul(feeAmount).dividedBy(MOVEMENT_FEE_SCALE).ceil(),
        MIN_FEE
      );
    }
  });

  async function getImportantInfo(
    autoVault: AutoVault,
    collateral: ERC20,
    address: AddressLike
  ): Promise<StateInfo> {
    const userBalance = toDecimal(await autoVault.balanceOf(address));
    const assetBalance = toDecimal(await collateral.balanceOf(address));
    const factoryBalance = toDecimal(
      await collateral.balanceOf(vaultFactory.target)
    );
    const vaultCreatorBalance = toDecimal(
      await collateral.balanceOf(vaultCreator.address)
    );
    console.log(`User Balance: ${userBalance}`);
    return {
      userBalance,
      assetBalance,
      factoryBalance,
      vaultCreatorBalance,
    } as StateInfo;
  }
});
export interface StateInfo {
  userBalance: Decimal;
  assetBalance: Decimal;
  factoryBalance: Decimal;
  vaultCreatorBalance: Decimal;
}
export async function getImportantInfo(
  autoVault: AutoVault,
  collateral: ERC20,
  address: AddressLike,
  factoryAddress: AddressLike,
  vaultCeatorAddress: AddressLike
): Promise<StateInfo> {
  const userBalance = toDecimal(await autoVault.balanceOf(address));
  const assetBalance = toDecimal(await collateral.balanceOf(address));
  const factoryBalance = toDecimal(await collateral.balanceOf(factoryAddress));
  const vaultCreatorBalance = toDecimal(
    await collateral.balanceOf(vaultCeatorAddress)
  );
  return {
    userBalance,
    assetBalance,
    factoryBalance,
    vaultCreatorBalance,
  } as StateInfo;
}
export function calculateFeeOnTotal(
  assets: Decimal,
  feeAmount: Decimal,
  MOVEMENT_FEE_SCALE: Decimal,
  MIN_FEE: Decimal
): Decimal {
  return Decimal.max(
    assets.mul(feeAmount).dividedBy(feeAmount.plus(MOVEMENT_FEE_SCALE)).ceil(),
    MIN_FEE
  );
}
export function calculateFeeOnRaw(
  assets: Decimal,
  feeAmount: Decimal,
  MOVEMENT_FEE_SCALE: Decimal,
  MIN_FEE: Decimal
) {
  return Decimal.max(
    assets.mul(feeAmount).dividedBy(MOVEMENT_FEE_SCALE).ceil(),
    MIN_FEE
  );
}
async function getAmount(Token: ERC20, amount: string) {
  const x = await Token.decimals();
  const y = new Decimal(10).pow(x.toString());
  return new Decimal(amount).mul(y);
}

function isLong(Trade: TradeStruct): boolean {
  if (Trade.long == true) return true;
  return false;
}

function isShort(Trade: TradeStruct): boolean {
  if (Trade.long == false) return true;
  return false;
}

export function toDecimal(result: any): Decimal {
  return new Decimal(result.toString());
}
async function test_deposit(
  USDC: ERC20,
  autoVault: AutoVault,
  totalCollateral: Decimal,
  userDepositing: SignerWithAddress,
  vaultFactory: VaultFactory,
  FACTORY_SHARE: Decimal
) {
  const depositAmount = await getAmount(USDC, "2");
  await USDC.approve(autoVault.target, depositAmount.toFixed());

  const assetsInVault = await USDC.balanceOf(autoVault.target);
  const totalAssets = totalCollateral.plus(assetsInVault.toString());
  const choice = 0;

  const vaultCreatorAddress = await autoVault.vaultManager();
  console.log(
    `Total Assets: ${totalCollateral.toFixed()} and vault: ${assetsInVault}`
  );
  const { expectedAmount, expectedFee } = await previewDeposit(
    vaultFactory,
    autoVault,
    userDepositing.address,
    depositAmount,
    totalAssets
  );

  console.log(`Expected Fee: ${expectedFee} and Amount ${expectedAmount}`);
  const expectedShares = expectedAmount;
  const requestID = await autoVault.startAction.staticCall(
    userDepositing.address,
    depositAmount.toFixed(),
    choice,
    expectedShares.toFixed()
  );
  const Before = await getImportantInfo(
    autoVault,
    USDC,
    userDepositing.address,
    vaultFactory.target,
    vaultCreatorAddress
  );
  await autoVault.startAction(
    userDepositing.address,
    depositAmount.toFixed(),
    choice,
    expectedShares.toFixed()
  );
  const input = [totalCollateral.toFixed()];

  await impersonateOracleDoVaultAction(
    vaultFactory,
    requestID,
    input,
    Number(await USDC.decimals()),
    0
  );

  const After = await getImportantInfo(
    autoVault,
    USDC,
    userDepositing.address,
    vaultFactory.target,
    vaultCreatorAddress
  );
  //Since collateral is equal to how much put in, shares should be 1 to 1

  assert.equal(
    After.userBalance.sub(Before.userBalance).toFixed(),
    expectedShares.toFixed()
  );
  if (vaultCreatorAddress == userDepositing.address) {
    assert.equal(
      After.factoryBalance.sub(Before.factoryBalance).toFixed(),
      expectedFee.toFixed(), // We don't dividde, it all goes to them
      "Vault Factory recieved wrong fee"
    );
    assert.equal(
      Before.vaultCreatorBalance.sub(After.vaultCreatorBalance).toFixed(),
      depositAmount.toFixed(),
      "Vault Creator recieved wrong fee"
    );
  } else {
    assert.equal(
      After.factoryBalance.sub(Before.factoryBalance).toFixed(),
      expectedFee.dividedBy(FACTORY_SHARE).toFixed(),
      "Vault Factory recieved wrong fee"
    );
    assert.equal(
      After.vaultCreatorBalance.sub(Before.vaultCreatorBalance).toFixed(),
      expectedFee.sub(expectedFee.dividedBy(FACTORY_SHARE)).toFixed(),
      "Vault Creator recieved wrong fee"
    );
  }
}
async function test_mint(
  USDC: ERC20,
  autoVault: AutoVault,
  totalCollateral: Decimal,
  userDepositing: SignerWithAddress,
  vaultFactory: VaultFactory,
  FACTORY_SHARE: Decimal
) {
  const mintAmount = await getAmount(autoVault, "2");
  const choice = 1;
  const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
  const totalAssets = totalCollateral.plus(totalAssetsExisting.toString());
  console.log("total assets:", totalCollateral, totalAssetsExisting);
  const vaultCreatorAddress = await autoVault.vaultManager();

  const { expectedAmount, expectedFee } = await previewMint(
    vaultFactory,
    autoVault,
    userDepositing.address,
    mintAmount,
    totalAssets
  );
  const expectedAssetsPaid = expectedAmount;

  await USDC.approve(
    autoVault.target,
    expectedAssetsPaid.plus(expectedFee).toFixed()
  );
  console.log(
    `Total expected:${expectedAssetsPaid.plus(expectedFee).toFixed()}`
  );

  const requestID = await autoVault.startAction.staticCall(
    userDepositing.address,
    mintAmount.toFixed(),
    choice,
    expectedAssetsPaid.plus(expectedFee).toFixed()
  );
  const Before = await getImportantInfo(
    autoVault,
    USDC,
    userDepositing.address,
    vaultFactory.target,
    vaultCreatorAddress
  );

  await autoVault.startAction(
    userDepositing,
    mintAmount.toFixed(),
    choice,
    expectedAssetsPaid.toFixed()
  );

  const input = [totalCollateral.toFixed()];
  await impersonateOracleDoVaultAction(
    vaultFactory,
    requestID,
    input,
    Number(await USDC.decimals()),
    0
  );

  const After = await getImportantInfo(
    autoVault,
    USDC,
    userDepositing.address,
    vaultFactory.target,
    vaultCreatorAddress
  );

  assert.equal(
    After.userBalance.sub(Before.userBalance).toFixed(),
    mintAmount.toFixed(),
    "User balance increase should match minted amount"
  );

  if (vaultCreatorAddress == userDepositing.address) {
    assert.equal(
      Before.assetBalance.sub(After.assetBalance).toFixed(),
      expectedAssetsPaid.toFixed(),
      "User should be charged correct amount including fee"
    );
    assert.equal(
      After.factoryBalance.sub(Before.factoryBalance).toFixed(),
      expectedFee.toFixed(), // We don't dividde, it all goes to them
      "Vault Factory recieved wrong fee"
    );
    assert.equal(
      Before.vaultCreatorBalance.sub(After.vaultCreatorBalance).toFixed(),
      expectedAssetsPaid.toFixed(),
      "Vault Creator recieved wrong fee"
    );
  } else {
    assert.equal(
      After.factoryBalance.sub(Before.factoryBalance).toFixed(),
      expectedFee.dividedBy(FACTORY_SHARE).toFixed(),
      "Vault Factory recieved wrong fee"
    );
    assert.equal(
      After.vaultCreatorBalance.sub(Before.vaultCreatorBalance).toFixed(),
      expectedFee.sub(expectedFee.dividedBy(FACTORY_SHARE)).toFixed(),
      "Vault Creator recieved wrong fee"
    );
  }
}
