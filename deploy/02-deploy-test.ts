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
  let args = [
    startInfo.ChainLinkToken,
    startInfo.OracleAddress,
    "a8356f48569c434eaa4ac5fcb4db5cc0", //jobID from //https://docs.linkwellnodes.io/services/direct-request-jobs/testnets/Arbitrum-Sepolia-Testnet-Jobs
  ] as any[];
  // Deploy the Test256 library
  const Test256 = await deploy("Test256", {
    from: deployer,
    args: args,
    log: true,
  });
  if (chainId != 31337) {
    log("Verifying...");
    await verify(Test256.address, args, "contracts/Test256:Test256.sol");
  }

  log(`Test256 deployed at ${Test256.address}`);
};

module.exports.tags = ["all", "Test256"];
