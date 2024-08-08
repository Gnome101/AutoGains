import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
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
import {
  impersonateOracleFulfill,
  impersonateOracleDoVaultAction,
} from "../utils/AutoGains";
import { erc20 } from "../typechain-types/@openzeppelin/contracts/token";
import { Decimal } from "decimal.js";
import dotenv from "dotenv";
import { TradeStruct } from "../typechain-types/contracts/Gains Contracts/IGainsNetwork";
import { trace } from "console";

dotenv.config();

describe("Vault Tests ", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let vaultFactory: VaultFactory;
  let Helper: Helper;

  let USDC: ERC20;
  let WETH: ERC20;
  let DAI: ERC20;
  let userAddress: string;
  let FakeGainsNetwork: FakeGainsNetwork;

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

    await deployments.fixture(["Harness"]);

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
      user
    )) as unknown as FakeGainsNetwork;

    const factoryContract = (await deployments.get(
      "VaultFactory"
    )) as Deployment;

    vaultFactory = (await ethers.getContractAt(
      "VaultFactory",
      factoryContract.address.toString(),
      user
    )) as unknown as VaultFactory;

    const helperContract = (await deployments.get("Helper")) as Deployment;

    Helper = (await ethers.getContractAt(
      "Helper",
      helperContract.address.toString(),
      user
    )) as unknown as Helper;

    USDC = (await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
      contracts[chainID].USDC,
      user
    )) as unknown as ERC20;

    await vaultFactory
      .connect(deployer)
      .setGainsAddress(FakeGainsNetwork.target);
  });

  it("can create a vault with 1 strategy  ", async () => {
    const initalAmount = await getAmount(USDC, "10");

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
      1,
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
      [longStrategy] as number[][]
    );
    await vaultFactory.createVault(USDC, initalAmount.toFixed(), APIInfos, [
      longStrategy,
    ]);
    let autoVault = (await ethers.getContractAt(
      "AutoVault",
      vaultAddress,
      user
    )) as unknown as AutoVault;

    const userVaultBalance = await autoVault.balanceOf(userAddress);

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
  describe("Vault Created ", function () {
    let autoVault: AutoVault;
    const decimals = new Decimal(10).pow(10);
    beforeEach(async () => {
      const initalAmount = await getAmount(USDC, "10");

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
      const decimals = new Decimal(10).pow(10);

      // if x1< 70 then longAction else nothing
      const longStrategy = [
        18,
        15,
        1,
        1,
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
        [longStrategy] as number[][]
      );
      await vaultFactory.createVault(USDC, initalAmount.toFixed(), APIInfos, [
        longStrategy,
      ]);
      autoVault = (await ethers.getContractAt(
        "AutoVault",
        vaultAddress,
        user
      )) as unknown as AutoVault;

      const userVaultBalance = await autoVault.balanceOf(userAddress);

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
    describe("Basic Fucntions", function () {
      it("user can deposit ", async () => {
        const depositAmount = await getAmount(USDC, "2");
        await USDC.approve(autoVault.target, depositAmount.toFixed());
        const userBalanceBefore = new Decimal(
          (await autoVault.balanceOf(userAddress)).toString()
        );
        const expectedShares = await autoVault.deposit.staticCall(
          depositAmount.toFixed(),
          userAddress
        );
        await autoVault.deposit(depositAmount.toFixed(), userAddress);

        assert.equal(
          (await autoVault.balanceOf(userAddress)).toString(),
          userBalanceBefore.add(expectedShares.toString()).toFixed()
        );
      });
      it("user can mint ", async () => {
        const depositAmount = await getAmount(USDC, "2");
        await USDC.approve(autoVault.target, depositAmount.toFixed());
        const userBalanceBefore = new Decimal(
          (await autoVault.balanceOf(userAddress)).toString()
        );
        const expectedShares = await autoVault.deposit.staticCall(
          depositAmount.toFixed(),
          userAddress
        );
        await autoVault.mint(depositAmount.toFixed(), userAddress);

        assert.equal(
          (await autoVault.balanceOf(userAddress)).toString(),
          userBalanceBefore.add(expectedShares.toString()).toFixed()
        );
      });
      it("user can withdraw ", async () => {
        const depositAmount = await getAmount(USDC, "2");
        const userBalanceBefore = new Decimal(
          (await autoVault.balanceOf(userAddress)).toString()
        );
        const expectedSharesTaken = await autoVault.withdraw.staticCall(
          depositAmount.toFixed(),
          userAddress,
          userAddress
        );
        await autoVault.withdraw(
          depositAmount.toFixed(),
          userAddress,
          userAddress
        );
        assert.equal(
          (await autoVault.balanceOf(userAddress)).toString(),
          userBalanceBefore.sub(expectedSharesTaken.toString()).toFixed()
        );
      });
      it("user can redeem ", async () => {
        const depositAmount = await getAmount(USDC, "2");
        const userBalanceBefore = new Decimal(
          (await autoVault.balanceOf(userAddress)).toString()
        );
        const expectedSharesTaken = await autoVault.withdraw.staticCall(
          depositAmount.toFixed(),
          userAddress,
          userAddress
        );
        await autoVault.redeem(
          depositAmount.toFixed(),
          userAddress,
          userAddress
        );
        assert.equal(
          (await autoVault.balanceOf(userAddress)).toString(),
          userBalanceBefore.sub(expectedSharesTaken.toString()).toFixed()
        );
      });
    });
    describe("Active Trade", async () => {
      beforeEach(async () => {
        let requestID = await autoVault.executeStrategy.staticCall(0);
        const tx3 = await autoVault.executeStrategy(0);
        await tx3.wait();
        const x = new Decimal(10).pow(10);
        const currentPrice = new Decimal(60).mul(x);
        let input = [
          currentPrice.toFixed(),
          new Decimal(80).mul(decimals).toFixed(),
        ];

        expect(
          await impersonateOracleFulfill(autoVault, requestID, input)
        ).to.emit(FakeGainsNetwork, "OpenTradeCalled");
      });
      it("action should revert without getting collateral value ", async () => {
        const depositAmount = await getAmount(USDC, "2");
        await USDC.approve(autoVault.target, depositAmount.toFixed());

        await expect(
          autoVault.deposit(depositAmount.toFixed(), userAddress)
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
        it("deposit should work upon receiving collateral value ", async () => {
          const depositAmount = await getAmount(USDC, "2");
          await USDC.approve(autoVault.target, depositAmount.toFixed());
          const choice = 0;

          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            depositAmount.toFixed(),
            choice,
            depositAmount.toFixed()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          await autoVault.startAction(
            userAddress,
            depositAmount.toFixed(),
            choice,
            depositAmount.toFixed()
          );
          const assetsInVault = await USDC.balanceOf(autoVault.target);
          const input = totalCollateral.toFixed();
          const totalAssets = totalCollateral.plus(assetsInVault.toString());
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          //Since collateral is equal to how much put in, shares should be 1 to 1

          const expectedShares = depositAmount
            .mul(totalSupply.plus(1))
            .dividedBy(totalAssets.plus(1))
            .floor();

          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          assert.equal(
            userBalanceAfter.sub(userBalanceBefore).toFixed(),
            expectedShares.toFixed()
          );
        });
        it("mint should work upon receiving collateral value ", async () => {
          const mintAmount = await getAmount(USDC, "2");
          //We need to convert from shares to assets
          const choice = 1;
          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssets = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          const expectedAssetsPaid = mintAmount
            .mul(totalAssets.plus(1))
            .dividedBy(totalSupply.plus(1))
            .ceil();
          await USDC.approve(autoVault.target, expectedAssetsPaid.toFixed());

          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            mintAmount.toFixed(),
            choice,
            expectedAssetsPaid.toFixed()
          );
          const assetBalanceBefore = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          await autoVault.startAction(
            userAddress,
            mintAmount.toFixed(),
            choice,
            expectedAssetsPaid.toFixed()
          );

          const input = totalCollateral.toFixed();
          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          //Since collateral is equal to how much put in, shares should be 1 to 1
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceAfter = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          assert.equal(
            userBalanceAfter.sub(userBalanceBefore).toFixed(),
            mintAmount.toFixed()
          );
          assert.equal(
            assetBalanceBefore.sub(assetBalanceAfter).toFixed(),
            expectedAssetsPaid.toFixed()
          );
        });
        it("withdraw should work upon receiving collateral value ", async () => {
          const withdrawAmount = await getAmount(USDC, "2");
          const choice = 2;

          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            withdrawAmount.toFixed(),
            choice,
            withdrawAmount.toFixed()
          );

          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceBefore = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          await autoVault.startAction(
            userAddress,
            withdrawAmount.toFixed(),
            choice,
            withdrawAmount.toFixed()
          );

          // console.log(`Total collateral before:`, totalCollateral);
          const input = totalCollateral.toFixed();
          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssetsInControl = new Decimal(
            totalAssetsExisting.toString()
          );
          const totalAssets = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          console.log("A", (await USDC.balanceOf(autoVault.target)).toString());
          console.log(collateralAmounts, withdrawAmount, totalAssets);
          console.log(
            collateralAmounts[0].mul(withdrawAmount).dividedBy(totalAssets)
          );
          collateralAmounts = collateralAmounts.map((x) =>
            x.sub(x.mul(withdrawAmount).dividedBy(totalAssets).floor())
          );
          console.log(collateralAmounts);
          //Since collateral is equal to how much put in, shares should be 1 to 1
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceAfter = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          const expectedSoldShares = withdrawAmount
            .mul(totalSupply.plus(1))
            .dividedBy(totalAssets.plus(1))
            .ceil();

          assert.equal(
            userBalanceBefore.sub(userBalanceAfter).toFixed(),
            expectedSoldShares.toFixed(),
            "User balance should decrease by correct amount"
          );
          let trades = await FakeGainsNetwork.getTrades(autoVault.target);
          totalCollateral = new Decimal("0");
          let i = 0;
          for (const trade of trades) {
            const collateralAmount = trade.collateralAmount;
            assert.equal(
              collateralAmounts[i].toFixed(),
              collateralAmount.toString(),
              "Trades should decrease by desired amount"
            );
            totalCollateral = totalCollateral.plus(collateralAmount.toString());
            i++;
          }
          // console.log(`Total collateral after:`, totalCollateral);

          assert.equal(
            assetBalanceAfter.sub(assetBalanceBefore).toFixed(),
            withdrawAmount.toFixed()
          );
        });
        it("redeeming should work upon receiving collateral value ", async () => {
          const redeemAmount = await getAmount(autoVault, "2");
          const choice = 3;
          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            redeemAmount.toFixed(),
            choice,
            redeemAmount.toFixed()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceBefore = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          const input = totalCollateral.toFixed();
          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssetsInControl = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const expectedAssetsEarned = redeemAmount
            .mul(totalAssetsInControl.plus(1))
            .dividedBy((await autoVault.totalSupply()).toString())
            .floor();

          await autoVault.startAction(
            userAddress,
            redeemAmount.toFixed(),
            choice,
            expectedAssetsEarned.toFixed()
          );

          // console.log(`Total collateral before:`, totalCollateral);

          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          collateralAmounts = collateralAmounts.map((x) =>
            x
              .mul(totalAssetsInControl.sub(expectedAssetsEarned))
              .dividedBy(totalAssetsInControl)
              .floor()
          );
          //Since collateral is equal to how much put in, shares should be 1 to 1
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceAfter = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          assert.equal(
            userBalanceBefore.sub(userBalanceAfter).toFixed(),
            redeemAmount.toFixed(),
            "User balance should decrease by correct amount"
          );
          let trades = await FakeGainsNetwork.getTrades(autoVault.target);
          totalCollateral = new Decimal("0");
          let i = 0;
          for (const trade of trades) {
            const collateralAmount = trade.collateralAmount;
            assert.equal(
              collateralAmounts[i].toFixed(),
              collateralAmount.toString(),
              "Trades should decrease by desired amount"
            );
            totalCollateral = totalCollateral.plus(collateralAmount.toString());
            i++;
          }
          // console.log(`Total collateral after:`, totalCollateral);

          assert.equal(
            assetBalanceAfter.sub(assetBalanceBefore).toFixed(),
            expectedAssetsEarned.toFixed()
          );
        });
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
        it("deposit should work upon receiving collateral value ", async () => {
          const depositAmount = await getAmount(USDC, "2");
          await USDC.approve(autoVault.target, depositAmount.toFixed());
          const choice = 0;

          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            depositAmount.toFixed(),
            choice,
            depositAmount.toFixed()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          await autoVault.startAction(
            userAddress,
            depositAmount.toFixed(),
            choice,
            depositAmount.toFixed()
          );
          const assetsInVault = await USDC.balanceOf(autoVault.target);
          const input = totalCollateral.toFixed();
          const totalAssets = totalCollateral.plus(assetsInVault.toString());
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          //Since collateral is equal to how much put in, shares should be 1 to 1

          const expectedShares = depositAmount
            .mul(totalSupply.plus(1))
            .dividedBy(totalAssets.plus(1))
            .floor();

          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          assert.equal(
            userBalanceAfter.sub(userBalanceBefore).toFixed(),
            expectedShares.toFixed()
          );
        });
        it("mint should work upon receiving collateral value ", async () => {
          const mintAmount = await getAmount(USDC, "2");
          //We need to convert from shares to assets
          const choice = 1;
          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssets = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          const expectedAssetsPaid = mintAmount
            .mul(totalAssets.plus(1))
            .dividedBy(totalSupply.plus(1))
            .ceil();
          await USDC.approve(autoVault.target, expectedAssetsPaid.toFixed());

          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            mintAmount.toFixed(),
            choice,
            expectedAssetsPaid.toFixed()
          );
          const assetBalanceBefore = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          await autoVault.startAction(
            userAddress,
            mintAmount.toFixed(),
            choice,
            expectedAssetsPaid.toFixed()
          );

          const input = totalCollateral.toFixed();
          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          //Since collateral is equal to how much put in, shares should be 1 to 1
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceAfter = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          assert.equal(
            userBalanceAfter.sub(userBalanceBefore).toFixed(),
            mintAmount.toFixed()
          );
          assert.equal(
            assetBalanceBefore.sub(assetBalanceAfter).toFixed(),
            expectedAssetsPaid.toFixed()
          );
        });
        it("withdraw should work upon receiving collateral value ", async () => {
          const withdrawAmount = await getAmount(USDC, "2");
          const choice = 2;

          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            withdrawAmount.toFixed(),
            choice,
            withdrawAmount.toFixed()
          );

          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceBefore = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          await autoVault.startAction(
            userAddress,
            withdrawAmount.toFixed(),
            choice,
            withdrawAmount.toFixed()
          );

          // console.log(`Total collateral before:`, totalCollateral);
          const input = totalCollateral.toFixed();
          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssetsInControl = new Decimal(
            totalAssetsExisting.toString()
          );
          const totalAssets = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          console.log("A", (await USDC.balanceOf(autoVault.target)).toString());
          console.log(collateralAmounts, withdrawAmount, totalAssets);
          console.log(
            collateralAmounts[0].mul(withdrawAmount).dividedBy(totalAssets)
          );
          collateralAmounts = collateralAmounts.map((x) =>
            x.sub(x.mul(withdrawAmount).dividedBy(totalAssets).floor())
          );
          console.log(collateralAmounts);
          //Since collateral is equal to how much put in, shares should be 1 to 1
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceAfter = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          const expectedSoldShares = withdrawAmount
            .mul(totalSupply.plus(1))
            .dividedBy(totalAssets.plus(1))
            .ceil();

          assert.equal(
            userBalanceBefore.sub(userBalanceAfter).toFixed(),
            expectedSoldShares.toFixed(),
            "User balance should decrease by correct amount"
          );
          let trades = await FakeGainsNetwork.getTrades(autoVault.target);
          totalCollateral = new Decimal("0");
          let i = 0;
          for (const trade of trades) {
            const collateralAmount = trade.collateralAmount;
            assert.equal(
              collateralAmounts[i].toFixed(),
              collateralAmount.toString(),
              "Trades should decrease by desired amount"
            );
            totalCollateral = totalCollateral.plus(collateralAmount.toString());
            i++;
          }
          // console.log(`Total collateral after:`, totalCollateral);

          assert.equal(
            assetBalanceAfter.sub(assetBalanceBefore).toFixed(),
            withdrawAmount.toFixed()
          );
        });
        it("redeeming should work upon receiving collateral value ", async () => {
          const redeemAmount = await getAmount(autoVault, "2");
          const choice = 3;
          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            redeemAmount.toFixed(),
            choice,
            redeemAmount.toFixed()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceBefore = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          const input = totalCollateral.toFixed();
          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssetsInControl = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const expectedAssetsEarned = redeemAmount
            .mul(totalAssetsInControl.plus(1))
            .dividedBy((await autoVault.totalSupply()).toString())
            .floor();

          await autoVault.startAction(
            userAddress,
            redeemAmount.toFixed(),
            choice,
            expectedAssetsEarned.toFixed()
          );

          // console.log(`Total collateral before:`, totalCollateral);

          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          collateralAmounts = collateralAmounts.map((x) =>
            x
              .mul(totalAssetsInControl.sub(expectedAssetsEarned))
              .dividedBy(totalAssetsInControl)
              .floor()
          );
          //Since collateral is equal to how much put in, shares should be 1 to 1
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceAfter = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          assert.equal(
            userBalanceBefore.sub(userBalanceAfter).toFixed(),
            redeemAmount.toFixed(),
            "User balance should decrease by correct amount"
          );
          let trades = await FakeGainsNetwork.getTrades(autoVault.target);
          totalCollateral = new Decimal("0");
          let i = 0;
          for (const trade of trades) {
            const collateralAmount = trade.collateralAmount;
            assert.equal(
              collateralAmounts[i].toFixed(),
              collateralAmount.toString(),
              "Trades should decrease by desired amount"
            );
            totalCollateral = totalCollateral.plus(collateralAmount.toString());
            i++;
          }
          // console.log(`Total collateral after:`, totalCollateral);

          assert.equal(
            assetBalanceAfter.sub(assetBalanceBefore).toFixed(),
            expectedAssetsEarned.toFixed()
          );
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
        it("deposit should work upon receiving collateral value ", async () => {
          const depositAmount = await getAmount(USDC, "2");
          await USDC.approve(autoVault.target, depositAmount.toFixed());
          const choice = 0;

          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            depositAmount.toFixed(),
            choice,
            depositAmount.toFixed()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          await autoVault.startAction(
            userAddress,
            depositAmount.toFixed(),
            choice,
            depositAmount.toFixed()
          );
          const assetsInVault = await USDC.balanceOf(autoVault.target);
          const input = totalCollateral.toFixed();
          const totalAssets = totalCollateral.plus(assetsInVault.toString());
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          //Since collateral is equal to how much put in, shares should be 1 to 1

          const expectedShares = depositAmount
            .mul(totalSupply.plus(1))
            .dividedBy(totalAssets.plus(1))
            .floor();

          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          assert.equal(
            userBalanceAfter.sub(userBalanceBefore).toFixed(),
            expectedShares.toFixed()
          );
        });
        it("mint should work upon receiving collateral value ", async () => {
          const mintAmount = await getAmount(USDC, "2");
          //We need to convert from shares to assets
          const choice = 1;
          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssets = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          const expectedAssetsPaid = mintAmount
            .mul(totalAssets.plus(1))
            .dividedBy(totalSupply.plus(1))
            .ceil();
          await USDC.approve(autoVault.target, expectedAssetsPaid.toFixed());

          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            mintAmount.toFixed(),
            choice,
            expectedAssetsPaid.toFixed()
          );
          const assetBalanceBefore = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          await autoVault.startAction(
            userAddress,
            mintAmount.toFixed(),
            choice,
            expectedAssetsPaid.toFixed()
          );

          const input = totalCollateral.toFixed();
          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          //Since collateral is equal to how much put in, shares should be 1 to 1
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceAfter = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          assert.equal(
            userBalanceAfter.sub(userBalanceBefore).toFixed(),
            mintAmount.toFixed()
          );
          assert.equal(
            assetBalanceBefore.sub(assetBalanceAfter).toFixed(),
            expectedAssetsPaid.toFixed()
          );
        });
        it("withdraw should work upon receiving collateral value ", async () => {
          const withdrawAmount = await getAmount(USDC, "2");
          const choice = 2;

          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            withdrawAmount.toFixed(),
            choice,
            withdrawAmount.toFixed()
          );

          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceBefore = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          await autoVault.startAction(
            userAddress,
            withdrawAmount.toFixed(),
            choice,
            withdrawAmount.toFixed()
          );

          // console.log(`Total collateral before:`, totalCollateral);
          const input = totalCollateral.toFixed();
          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssetsInControl = new Decimal(
            totalAssetsExisting.toString()
          );
          const totalAssets = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          console.log("A", (await USDC.balanceOf(autoVault.target)).toString());
          console.log(collateralAmounts, withdrawAmount, totalAssets);
          console.log(
            collateralAmounts[0].mul(withdrawAmount).dividedBy(totalAssets)
          );
          collateralAmounts = collateralAmounts.map((x) =>
            x.sub(x.mul(withdrawAmount).dividedBy(totalAssets).floor())
          );
          console.log(collateralAmounts);
          //Since collateral is equal to how much put in, shares should be 1 to 1
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceAfter = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          const expectedSoldShares = withdrawAmount
            .mul(totalSupply.plus(1))
            .dividedBy(totalAssets.plus(1))
            .ceil();

          assert.equal(
            userBalanceBefore.sub(userBalanceAfter).toFixed(),
            expectedSoldShares.toFixed(),
            "User balance should decrease by correct amount"
          );
          let trades = await FakeGainsNetwork.getTrades(autoVault.target);
          totalCollateral = new Decimal("0");
          let i = 0;
          for (const trade of trades) {
            const collateralAmount = trade.collateralAmount;
            assert.equal(
              collateralAmounts[i].toFixed(),
              collateralAmount.toString(),
              "Trades should decrease by desired amount"
            );
            totalCollateral = totalCollateral.plus(collateralAmount.toString());
            i++;
          }
          // console.log(`Total collateral after:`, totalCollateral);

          assert.equal(
            assetBalanceAfter.sub(assetBalanceBefore).toFixed(),
            withdrawAmount.toFixed()
          );
        });
        it("redeeming should work upon receiving collateral value ", async () => {
          const redeemAmount = await getAmount(autoVault, "2");
          const choice = 3;
          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            redeemAmount.toFixed(),
            choice,
            redeemAmount.toFixed()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceBefore = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          const input = totalCollateral.toFixed();
          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssetsInControl = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const expectedAssetsEarned = redeemAmount
            .mul(totalAssetsInControl.plus(1))
            .dividedBy((await autoVault.totalSupply()).toString())
            .floor();

          await autoVault.startAction(
            userAddress,
            redeemAmount.toFixed(),
            choice,
            expectedAssetsEarned.toFixed()
          );

          // console.log(`Total collateral before:`, totalCollateral);

          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          collateralAmounts = collateralAmounts.map((x) =>
            x
              .mul(totalAssetsInControl.sub(expectedAssetsEarned))
              .dividedBy(totalAssetsInControl)
              .floor()
          );
          //Since collateral is equal to how much put in, shares should be 1 to 1
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceAfter = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          assert.equal(
            userBalanceBefore.sub(userBalanceAfter).toFixed(),
            redeemAmount.toFixed(),
            "User balance should decrease by correct amount"
          );
          let trades = await FakeGainsNetwork.getTrades(autoVault.target);
          totalCollateral = new Decimal("0");
          let i = 0;
          for (const trade of trades) {
            const collateralAmount = trade.collateralAmount;
            assert.equal(
              collateralAmounts[i].toFixed(),
              collateralAmount.toString(),
              "Trades should decrease by desired amount"
            );
            totalCollateral = totalCollateral.plus(collateralAmount.toString());
            i++;
          }
          // console.log(`Total collateral after:`, totalCollateral);

          assert.equal(
            assetBalanceAfter.sub(assetBalanceBefore).toFixed(),
            expectedAssetsEarned.toFixed()
          );
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
        it("deposit should work upon receiving collateral value ", async () => {
          const depositAmount = await getAmount(USDC, "2");
          await USDC.approve(autoVault.target, depositAmount.toFixed());
          const choice = 0;
          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssets = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          const expectedSharesEarned = depositAmount
            .mul(totalSupply.plus(1))
            .dividedBy(totalAssets.plus(1))
            .floor();
          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            depositAmount.toFixed(),
            choice,
            expectedSharesEarned.toFixed()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          await autoVault.startAction(
            userAddress,
            depositAmount.toFixed(),
            choice,
            expectedSharesEarned.toFixed()
          );
          const assetsInVault = await USDC.balanceOf(autoVault.target);
          const input = totalCollateral.toFixed();

          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          //Since collateral is equal to how much put in, shares should be 1 to 1

          const expectedShares = depositAmount
            .mul(totalSupply.plus(1))
            .dividedBy(totalAssets.plus(1))
            .floor();

          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          assert.equal(
            userBalanceAfter.sub(userBalanceBefore).toFixed(),
            expectedShares.toFixed()
          );
        });
        it("mint should work upon receiving collateral value ", async () => {
          const mintAmount = await getAmount(USDC, "2");
          //We need to convert from shares to assets
          const choice = 1;
          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssets = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          const expectedAssetsPaid = mintAmount
            .mul(totalAssets.plus(1))
            .dividedBy(totalSupply.plus(1))
            .ceil();
          await USDC.approve(autoVault.target, expectedAssetsPaid.toFixed());

          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            mintAmount.toFixed(),
            choice,
            expectedAssetsPaid.toFixed()
          );
          const assetBalanceBefore = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          await autoVault.startAction(
            userAddress,
            mintAmount.toFixed(),
            choice,
            expectedAssetsPaid.toFixed()
          );

          const input = totalCollateral.toFixed();
          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          //Since collateral is equal to how much put in, shares should be 1 to 1
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceAfter = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          assert.equal(
            userBalanceAfter.sub(userBalanceBefore).toFixed(),
            mintAmount.toFixed()
          );
          assert.equal(
            assetBalanceBefore.sub(assetBalanceAfter).toFixed(),
            expectedAssetsPaid.toFixed()
          );
        });
        it("withdraw should work upon receiving collateral value  ", async () => {
          const withdrawAmount = await getAmount(USDC, "2");
          const choice = 2;

          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssets = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          const expectedSharesSpent = withdrawAmount
            .mul(totalSupply.plus(1))
            .dividedBy(totalAssets.plus(1))
            .floor();
          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            withdrawAmount.toFixed(),
            choice,
            expectedSharesSpent.toFixed()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceBefore = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );

          await autoVault.startAction(
            userAddress,
            withdrawAmount.toFixed(),
            choice,
            expectedSharesSpent.toFixed()
          );

          // console.log(`Total collateral before:`, totalCollateral);
          const input = totalCollateral.toFixed();

          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          console.log("A", (await USDC.balanceOf(autoVault.target)).toString());
          console.log(collateralAmounts, withdrawAmount, totalAssets);
          console.log(
            collateralAmounts[0].mul(withdrawAmount).dividedBy(totalAssets)
          );
          collateralAmounts = collateralAmounts.map((x) =>
            x.sub(x.mul(withdrawAmount).dividedBy(totalAssets).floor())
          );
          console.log(collateralAmounts);
          //Since collateral is equal to how much put in, shares should be 1 to 1
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceAfter = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          const expectedSoldShares = withdrawAmount
            .mul(totalSupply.plus(1))
            .dividedBy(totalAssets.plus(1))
            .ceil();

          assert.equal(
            userBalanceBefore.sub(userBalanceAfter).toFixed(),
            expectedSoldShares.toFixed(),
            "User balance should decrease by correct amount"
          );
          let trades = await FakeGainsNetwork.getTrades(autoVault.target);
          totalCollateral = new Decimal("0");
          let i = 0;
          for (const trade of trades) {
            const collateralAmount = trade.collateralAmount;
            assert.equal(
              collateralAmounts[i].toFixed(),
              collateralAmount.toString(),
              "Trades should decrease by desired amount"
            );
            totalCollateral = totalCollateral.plus(collateralAmount.toString());
            i++;
          }
          // console.log(`Total collateral after:`, totalCollateral);

          assert.equal(
            assetBalanceAfter.sub(assetBalanceBefore).toFixed(),
            withdrawAmount.toFixed()
          );
        });
        it("redeeming should work upon receiving collateral value ", async () => {
          const redeemAmount = await getAmount(autoVault, "2");
          const choice = 3;
          const requestID = await autoVault.startAction.staticCall(
            userAddress,
            redeemAmount.toFixed(),
            choice,
            redeemAmount.toFixed()
          );
          const userBalanceBefore = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceBefore = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          const input = totalCollateral.toFixed();
          const totalAssetsExisting = await USDC.balanceOf(autoVault.target);
          const totalAssets = totalCollateral.plus(
            totalAssetsExisting.toString()
          );
          const totalSupply = new Decimal(
            (await autoVault.totalSupply()).toString()
          );
          const expectedAssetsEarned = redeemAmount
            .mul(totalAssets.plus(1))
            .dividedBy(totalSupply.plus(1))
            .floor();

          await autoVault.startAction(
            userAddress,
            redeemAmount.toFixed(),
            choice,
            expectedAssetsEarned.toFixed()
          );

          // console.log(`Total collateral before:`, totalCollateral);

          await impersonateOracleDoVaultAction(autoVault, requestID, input);
          console.log("ARG", totalAssets, expectedAssetsEarned, totalAssets);

          collateralAmounts = collateralAmounts.map((x) =>
            x.sub(x.mul(expectedAssetsEarned).dividedBy(totalAssets).floor())
          );
          //Since collateral is equal to how much put in, shares should be 1 to 1
          const userBalanceAfter = new Decimal(
            (await autoVault.balanceOf(userAddress)).toString()
          );
          const assetBalanceAfter = new Decimal(
            (await USDC.balanceOf(userAddress)).toString()
          );
          assert.equal(
            userBalanceBefore.sub(userBalanceAfter).toFixed(),
            redeemAmount.toFixed(),
            "User balance should decrease by correct amount"
          );
          let trades = await FakeGainsNetwork.getTrades(autoVault.target);
          totalCollateral = new Decimal("0");
          let i = 0;
          for (const trade of trades) {
            const collateralAmount = trade.collateralAmount;
            assert.equal(
              collateralAmounts[i].toFixed(),
              collateralAmount.toString(),
              "Trades should decrease by desired amount"
            );
            totalCollateral = totalCollateral.plus(collateralAmount.toString());
            i++;
          }
          // console.log(`Total collateral after:`, totalCollateral);

          assert.equal(
            assetBalanceAfter.sub(assetBalanceBefore).toFixed(),
            expectedAssetsEarned.toFixed()
          );
        });
      });
    });
  });
});

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
