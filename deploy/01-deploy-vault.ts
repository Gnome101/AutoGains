//@ts-ignore
import { network, deployments as hardhatDeployments, ethers } from "hardhat";
import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object
import { verify } from "../utils/verify";
import { Decimal } from "decimal.js";
import { BigNumberish } from "ethers";

interface NamedAccounts {
  deployer: string;
  user: string;
}

module.exports = async function ({
  getNamedAccounts,
  deployments,
}: {
  getNamedAccounts: () => Promise<NamedAccounts>;
  deployments: typeof hardhatDeployments;
}) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  if (chainId == undefined) throw "No Chain ID!";
  const startInfo = contracts[chainId];
  log("------------------------------------------------------------");
  console.log("Staring");
  const equation = await deploy("Equation", {
    from: deployer,
    log: true,
  });
  const AutoVaultMaster = await deploy("AutoVault", {
    from: deployer,
    args: [],
    log: true,
  });
  let args = [
    startInfo.OracleAddress,
    startInfo.ChainLinkToken,
    startInfo.GainsNetwork,
    AutoVaultMaster.address,
  ] as any[];
  // Deploy the Test contract and link the Equation library
  const VaultFactory = await deploy("VaultFactory", {
    from: deployer,
    args: args,
    log: true,
    libraries: {
      Equation: equation.address,
    },
  });
  const vaultFactory = await ethers.getContractAt(
    "VaultFactory",
    VaultFactory.address
  );
  const tokens = [startInfo.DAI, startInfo.USDC, startInfo.WETH];

  const amounts = [
    [getAmountDec("0.85", 18).toFixed(), getAmountDec("0.85", 18).toFixed()],
    [getAmountDec("0.85", 6).toFixed(), getAmountDec("0.85", 6).toFixed()],
    [
      getAmountDec("0.00040", 18).toFixed(),
      getAmountDec("0.00040", 18).toFixed(),
    ],
  ] as [BigNumberish, BigNumberish][];

  let tx = await vaultFactory.setStartingFees(tokens, amounts);
  await tx.wait();
  if (chainId == 31337) {
    tx = await vaultFactory.toggleCaller(
      "0x793448209ef713cae41437c7daa219b59bef1a4a"
    );
  }
  await tx.wait();
  if (chainId != 31337) {
    log("Verifying...");
    await verify(
      VaultFactory.address,
      args,
      "contracts/VaultFactory:VaultFactory.sol"
    );
  }
  const Helper = await deploy("Helper", {
    from: deployer,
    args: [],
    log: true,
  });
  if (chainId != 31337) {
    log("Verifying...");
    await verify(Helper.address, [], "contracts/Helper:Helper.sol");
  }
  log(`VaultFactory deployed at ${VaultFactory.address}`);
  log(`Helper deployed at ${Helper.address}`);
};

module.exports.tags = ["all", "Test", "Harness"];
export function getAmountDec(amount: string, decimals: number): Decimal {
  const x = new Decimal(10).pow(decimals);
  return new Decimal(amount).mul(x);
}
