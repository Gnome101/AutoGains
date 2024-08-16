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
import { FEE_MULTIPLIER_SCALE } from "@gainsnetwork/sdk";
import { AddressLike, assertArgument, BigNumberish } from "ethers";
import { getAmountDec } from "./strategy-test";
import { AutoVaultHarness__factory } from "../typechain-types/factories/contracts/Harness/AutoVaultHarness.sol";
import { copyFileSync } from "fs";
dotenv.config();

describe("Operation Tests ", function () {
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

  const COOLDOWN_PERIOD = 60;
  const MAX_BLOCK_DIFFERENCE = 16;
  const SWAP_FEE = 2_000;
  const SWAP_FEE_SCALE = 10 ** 6;

  const USDCFEE = getAmountDec("0.85", 6);
  const publicAPI = "publicAPI";
  const PUBLIC_FEE = 1_500_000;

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
    await vaultFactory.connect(otherUser).togglePublicAPI(publicAPI);
  });

  describe("Vault Created ", function () {
    let autoVault: AutoVault;
    let otherAutoVault: AutoVault;
    const decimals = new Decimal(10).pow(18);
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
        {
          method: "",
          url: publicAPI,
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

      // if x1< 30 then longAction else nothing
      const longStrategy = [
        18,
        14,
        1,
        2,
        0,
        new Decimal(30).mul(decimals).toFixed(),
        0,
        longAciton,
        0,
        0,
      ];
      console.log(initalAmount.toFixed());
      //Two strategies are used, 0 has a custom api, 1 has a public one
      const vaultAddress = await vaultFactory.createVault.staticCall(
        USDC,
        initalAmount.toFixed(),
        APIInfos,
        [longStrategy, longStrategy] as number[][]
      );

      await vaultFactory.createVault(USDC, initalAmount.toFixed(), APIInfos, [
        longStrategy,
        longStrategy,
      ]);
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
    describe("Cooldowns ", function () {
      it("user can not purchase and redeem within the cooldown period ", async () => {
        const depositAmount = await getAmount(USDC, "10");
        await USDC.approve(autoVault.target, depositAmount.toFixed());
        await autoVault.deposit(depositAmount.toFixed(), vaultCreator.address);
        await expect(
          autoVault.withdraw(
            depositAmount.toFixed(),
            vaultCreator.address,
            vaultCreator.address
          )
        ).to.be.rejectedWith("CoolDownViolated()");
        await time.increase(60);
      });
      it("user can not purchase and transfer within cooldown period", async () => {
        const depositAmount = await getAmount(USDC, "10");
        await USDC.approve(autoVault.target, depositAmount.toFixed());
        await autoVault.deposit(depositAmount.toFixed(), vaultCreator.address);
        await expect(
          autoVault.transfer(otherUser.address, depositAmount.toFixed())
        ).to.be.rejectedWith("CoolDownViolated()");
      });
      it("user can purchase and redeem after the cooldown period ", async () => {
        const depositAmount = await getAmount(USDC, "10");
        await USDC.approve(autoVault.target, depositAmount.toFixed());
        await autoVault.deposit(depositAmount.toFixed(), vaultCreator.address);
        await time.increase(60);
        await autoVault.withdraw(
          depositAmount.toFixed(),
          vaultCreator.address,
          vaultCreator.address
        );
      });
    });
    describe("Strategy Block Expiry ", function () {
      //Show the stuff here
      it("strategy execution can expire ", async () => {
        const requestID = await autoVault.executeStrategy.staticCall(0);
        const tx4 = await autoVault.executeStrategy(0);
        await tx4.wait();
        //When its below 70, then its rejected
        const currentPrice = getAmountDec("60", 10);

        const input = [
          currentPrice.toFixed(),
          new Decimal(25).mul(decimals).toFixed(),
        ];
        const totalAssets = toDecimal(await USDC.balanceOf(autoVault.target));
        const percent = 200_000;
        const amount = totalAssets.mul(percent).dividedBy(1_000_000);
        const swapFee = amount
          .mul(SWAP_FEE)
          .dividedBy(SWAP_FEE_SCALE) as Decimal;
        const error = `BlockDifferenceTooLarge(21)`; // Its one larger
        //beause it mines a block

        await expect(
          impersonateOracleFulfill(vaultFactory, requestID, input, 20)
        ).to.be.rejectedWith(error);
      });
      it("vault action can expire trt", async () => {
        let requestID = await autoVault.executeStrategy.staticCall(0);
        const tx4 = await autoVault.executeStrategy(0);
        await tx4.wait();
        //When its below 70, then its rejected
        const currentPrice = getAmountDec("60", 18);

        let input = [
          currentPrice.toFixed(),
          new Decimal(25).mul(decimals).toFixed(),
        ];
        console.log("A");
        await impersonateOracleFulfill(vaultFactory, requestID, input, 0);
        console.log("A");

        const depositAmount = await getAmount(USDC, "1");
        const choice = 0;
        requestID = await otherAutoVault.startAction.staticCall(
          otherUser.address,
          depositAmount.toFixed(),
          choice,
          depositAmount.toFixed()
        );
        //Now there is an active trade
        await otherAutoVault.startAction(
          otherUser.address,
          depositAmount.toFixed(),
          choice,
          depositAmount.toFixed()
        );
        input = [getAmountDec("0", 18).toFixed()];
        const error = `BlockDifferenceTooLarge(21)`; // Its one larger
        await expect(
          impersonateOracleDoVaultAction(
            vaultFactory,
            requestID,
            input,
            Number(await USDC.decimals()),
            20
          )
        ).to.be.rejectedWith(error);
      });
    });
    describe("Execution Fees", function () {
      it("swap fee is taken ", async () => {
        const requestID = await autoVault.executeStrategy.staticCall(0);
        const tx4 = await autoVault.executeStrategy(0);
        await tx4.wait();
        //When its below 70, then its rejected
        const currentPrice = getAmountDec("60", 10);

        const input = [
          currentPrice.toFixed(),
          new Decimal(25).mul(decimals).toFixed(),
        ];
        const totalAssets = toDecimal(await USDC.balanceOf(autoVault.target));
        const percent = 200_000;
        const amount = totalAssets.mul(percent).dividedBy(1_000_000);
        const swapFee = amount
          .mul(SWAP_FEE)
          .dividedBy(SWAP_FEE_SCALE) as Decimal;
        expect(
          await impersonateOracleFulfill(vaultFactory, requestID, input, 0)
        ).to.emit(FakeGainsNetwork, "OpenTradeCalled");

        const trades = await FakeGainsNetwork.getTrades(autoVault.target);
        assert.equal(
          trades.length.toString(),
          "1",
          "There are more than 1 trades"
        );
        assert.equal(
          trades[0].collateralAmount.toString(),
          amount.sub(swapFee).toFixed(),
          "The swap fee is taken from the collateral amount"
        );
      });
      it("oracle and caller fee are accounted for ", async () => {
        const requestID = await autoVault.executeStrategy.staticCall(0);
        const tx4 = await autoVault.executeStrategy(0);
        await tx4.wait();
        //When its below 70, then its rejected
        const currentPrice = getAmountDec("60", 10);

        const input = [
          currentPrice.toFixed(),
          new Decimal(25).mul(decimals).toFixed(),
        ];
        const totalAssets = toDecimal(await USDC.balanceOf(autoVault.target));
        const percent = 200_000;
        const amount = totalAssets.mul(percent).dividedBy(1_000_000);
        const swapFee = amount
          .mul(SWAP_FEE)
          .dividedBy(SWAP_FEE_SCALE) as Decimal;

        const assetFactoryBalanceBefore = toDecimal(
          await USDC.balanceOf(vaultFactory.target)
        );
        const assetCallerBalanceBefore = toDecimal(
          await USDC.balanceOf(vaultCreator.address)
        );
        expect(
          await impersonateOracleFulfill(vaultFactory, requestID, input, 0)
        ).to.emit(FakeGainsNetwork, "OpenTradeCalled");

        const assetFactoryBalanceAfter = toDecimal(
          await USDC.balanceOf(vaultFactory.target)
        );
        const assetCallerBalanceAfter = toDecimal(
          await USDC.balanceOf(vaultCreator.address)
        );

        const trades = await FakeGainsNetwork.getTrades(autoVault.target);
        const totalFeeSize = USDCFEE.mul(2);
        const expectedCallerFee = USDCFEE.dividedBy("3").floor();
        const expectedFeeToFactory = totalFeeSize.sub(expectedCallerFee);
        assert.equal(
          assetFactoryBalanceAfter.sub(assetFactoryBalanceBefore).toFixed(),
          expectedFeeToFactory.plus(swapFee).toFixed()
        );
        assert.equal(
          assetCallerBalanceAfter.sub(assetCallerBalanceBefore).toFixed(),
          expectedCallerFee.toFixed()
        );
      });
      it("public oracle fee is accounted for ", async () => {
        const requestID = await autoVault.executeStrategy.staticCall(1);
        const tx4 = await autoVault.executeStrategy(1);
        await tx4.wait();
        //When its below 70, then its rejected
        const currentPrice = getAmountDec("60", 10);

        const input = [
          currentPrice.toFixed(),
          new Decimal(25).mul(decimals).toFixed(),
        ];
        const totalAssets = toDecimal(await USDC.balanceOf(autoVault.target));
        const percent = 200_000;
        const amount = totalAssets.mul(percent).dividedBy(SWAP_FEE_SCALE);
        let swapFee = amount.mul(SWAP_FEE).dividedBy(SWAP_FEE_SCALE) as Decimal;

        swapFee = swapFee.mul(PUBLIC_FEE).dividedBy(SWAP_FEE_SCALE).ceil();
        const assetFactoryBalanceBefore = toDecimal(
          await USDC.balanceOf(vaultFactory.target)
        );
        const assetCallerBalanceBefore = toDecimal(
          await USDC.balanceOf(vaultCreator.address)
        );
        expect(
          await impersonateOracleFulfill(vaultFactory, requestID, input, 0)
        ).to.emit(FakeGainsNetwork, "OpenTradeCalled");

        const assetFactoryBalanceAfter = toDecimal(
          await USDC.balanceOf(vaultFactory.target)
        );
        const assetCallerBalanceAfter = toDecimal(
          await USDC.balanceOf(vaultCreator.address)
        );

        const trades = await FakeGainsNetwork.getTrades(autoVault.target);
        const totalFeeSize = USDCFEE.mul(2).mul(1_500_000).dividedBy(1_000_000);
        const expectedCallerFee = USDCFEE.dividedBy("3").floor();
        const expectedFeeToFactory = totalFeeSize.sub(expectedCallerFee);
        assert.equal(
          assetFactoryBalanceAfter.sub(assetFactoryBalanceBefore).toFixed(),
          expectedFeeToFactory.plus(swapFee).toFixed()
        );
        assert.equal(
          assetCallerBalanceAfter.sub(assetCallerBalanceBefore).toFixed(),
          expectedCallerFee.toFixed()
        );
      });
    });
    describe("Vault Maker Roles ", function () {
      it("only vault maker can pause the contract", async () => {
        await expect(autoVault.connect(otherUser).pause()).to.be.rejectedWith(
          "vaultManagerOnly()"
        );
        await expect(autoVault.pause()).to.emit(autoVault, "Paused");
      });
      it("only vault maker can unpause contract", async () => {
        await autoVault.pause();
        await expect(autoVault.connect(otherUser).unpause()).to.be.rejectedWith(
          "vaultManagerOnly()"
        );
        await expect(autoVault.unpause()).to.emit(autoVault, "Unpaused");
      });
      it("only vault maker can change oracle fee", async () => {
        const amount = "1";
        await expect(
          autoVault.connect(otherUser).setOracleFee(amount)
        ).to.be.rejectedWith("vaultManagerOnly()");

        await expect(autoVault.setOracleFee(amount)).to.emit(
          autoVault,
          "OracleFeeSet"
        );
        const oracleFeeAfter = await autoVault.oracleFee();
        assert.equal(
          oracleFeeAfter.toString(),
          amount,
          "Oracle fee did not update like it should"
        );
      });
    });
    it("anyone can extend approval ", async () => {
      await expect(autoVault.extendApproval()).to.emit(
        autoVault,
        "ApprovalExtended"
      );
    });
  });
  describe("Factory Roles ", function () {
    it("only the factory owner can set starting fees ", async () => {
      const exampleToken = [USDC.target];
      const exampleAmounts = [[1, 0]] as [BigNumberish, BigNumberish][];
      const rejectedAddress = vaultCreator.address;
      await expect(
        vaultFactory.setStartingFees(exampleToken, exampleAmounts)
      ).to.be.rejectedWith("Only callable by owner");
      await expect(
        vaultFactory
          .connect(otherUser)
          .setStartingFees(exampleToken, exampleAmounts)
      ).to.emit(vaultFactory, "SetStartingFee");
      const newFee0 = await vaultFactory.tokenToOracleFee(USDC.target, 0);
      const newFee1 = await vaultFactory.tokenToOracleFee(USDC.target, 1);

      assert.equal(
        `${newFee0.toString()},${newFee1.toString()}`,
        exampleAmounts[0].toString(),
        "Starting Fee not set right"
      );
    });
    it("only the factory owner can set the oracle ", async () => {
      const exampleOracle = USDC.target;
      const rejectedAddress = vaultCreator.address;
      await expect(
        vaultFactory.setOracleAddress(exampleOracle)
      ).to.be.rejectedWith("Only callable by owner");
      await expect(
        vaultFactory.connect(otherUser).setOracleAddress(exampleOracle)
      ).to.emit(vaultFactory, "OracleAddressSet");
      const newOracle = await vaultFactory.oracleAddress();
      assert.equal(
        newOracle,
        exampleOracle,
        "Oracle address did not change correctly"
      );
    });
    it("only the factory owner can set the chainlink token ", async () => {
      const exampleToken = USDC.target;
      const rejectedAddress = vaultCreator.address;
      await expect(
        vaultFactory.setChainLinkToken(exampleToken)
      ).to.be.rejectedWith("Only callable by owner");
      await expect(
        vaultFactory.connect(otherUser).setChainLinkToken(exampleToken)
      ).to.emit(vaultFactory, "ChainLinkTokenSet");
      const newToken = await vaultFactory.chainLinkToken();
      assert.equal(
        newToken,
        exampleToken,
        "Chainlink token did not change correctly"
      );
    });
    it("only the factory owner can set the gains address ", async () => {
      const exampleGainsAddress = USDC.target;
      const rejectedAddress = vaultCreator.address;
      await expect(
        vaultFactory.setGainsAddress(exampleGainsAddress)
      ).to.be.rejectedWith("Only callable by owner");
      await expect(
        vaultFactory.connect(otherUser).setGainsAddress(exampleGainsAddress)
      ).to.emit(vaultFactory, "GainsAddressSet");
      const newGainsAddress = await vaultFactory.gainsAddress();
      expect(newGainsAddress).to.equal(exampleGainsAddress);
      assert.equal(
        newGainsAddress,
        exampleGainsAddress,
        "Gains Address did not change correctly"
      );
    });
    it("only the factory owner can claim funds ", async () => {
      const amount = await getAmount(USDC, "1");
      await USDC.transfer(vaultFactory.target, amount.toFixed());
      const initialFactoryBalance = toDecimal(
        await USDC.balanceOf(vaultFactory.target)
      );
      const initialOwnerBalance = toDecimal(
        await USDC.balanceOf(otherUser.address)
      );

      const rejectedAddress = vaultCreator.address;

      await expect(
        vaultFactory.claimFunds(USDC, amount.toFixed())
      ).to.be.rejectedWith("Only callable by owner");
      await expect(
        vaultFactory.connect(otherUser).claimFunds(USDC, amount.toFixed())
      ).to.emit(vaultFactory, "FundsClaimed");

      const finalFactoryBalance = toDecimal(
        await USDC.balanceOf(vaultFactory.target)
      );
      const finalOwnerBalance = toDecimal(
        await USDC.balanceOf(otherUser.address)
      );

      assert.equal(
        initialFactoryBalance.sub(finalFactoryBalance).toFixed(),
        amount.toFixed(),
        "Factory funds decreased incorrectly"
      );
      assert.equal(
        finalOwnerBalance.sub(initialOwnerBalance).toFixed(),
        amount.toFixed(),
        "Owner funds increased incorrectly"
      );
    });
  });
  describe("Other", function () {
    it("can not make fee with unknown token ", async () => {
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
        {
          method: "",
          url: publicAPI,
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

      // if x1< 30 then longAction else nothing
      const longStrategy = [
        18,
        14,
        1,
        2,
        0,
        new Decimal(30).mul(decimals).toFixed(),
        0,
        longAciton,
        0,
        0,
      ];
      console.log(initalAmount.toFixed());
      //Two strategies are used, 0 has a custom api, 1 has a public one

      await expect(
        vaultFactory.createVault(
          otherUser.address,
          initalAmount.toFixed(),
          APIInfos,
          [longStrategy, longStrategy]
        )
      ).to.rejectedWith("CollateralNotAdded()");
    });
  });
});
export interface StateInfo {
  userBalance: Decimal;
  assetBalance: Decimal;
  factoryBalance: Decimal;
  vaultCreatorBalance: Decimal;
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
