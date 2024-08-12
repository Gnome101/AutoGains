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
  const FakeGainsNetwork = await deploy("FakeGainsNetwork", {
    from: deployer,
    args: [],
    log: true,
  });
  let args = [
    startInfo.USDC,
    0,
    deployer,
    deployer,
    "aHarnessUSDC",
    "aHarness",
    [],
    startInfo.ChainLinkToken,
    startInfo.OracleAddress,
    FakeGainsNetwork.address,
  ] as any[];
  // Deploy the Test256 library
  const AutoVaultHarness = await deploy("AutoVaultHarness", {
    from: deployer,
    args: args,
    log: true,
  });

  if (chainId != 31337) {
    log("Verifying...");
    await verify(
      AutoVaultHarness.address,
      args,
      "contracts/Harness/AutoVaultHarness:AutoVaultHarness.sol"
    );
  }
};

module.exports.tags = ["Test"];
