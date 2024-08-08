//@ts-ignore
import { network, deployments as hardhatDeployments, ethers } from "hardhat";
import { contracts } from "../Addresses"; // assuming Addresses.ts exports an object
import { verify } from "../utils/verify";

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
  const vaultFactory = await deploy("VaultFactory", {
    from: deployer,
    args: args,
    log: true,
    libraries: {
      Equation: equation.address,
    },
  });
  // if (chainId != 31337) {
  //   log("Verifying...");
  //   await verify(
  //     vaultFactory.address,
  //     args,
  //     "contracts/VaultFactory:VaultFactory.sol"
  //   );
  // }

  const Helper = await deploy("Helper", {
    from: deployer,
    args: [],
    log: true,
  });
  // if (chainId != 31337) {
  //   log("Verifying...");
  //   await verify(Helper.address, [], "contracts/Helper:Helper.sol");
  // }

  log(`VaultFactory deployed at ${vaultFactory.address}`);
  log(`Helper deployed at ${Helper.address}`);
};

module.exports.tags = ["all", "Test", "Harness"];
