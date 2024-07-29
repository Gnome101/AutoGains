//@ts-ignore
import { network, deployments as hardhatDeployments, ethers } from "hardhat";

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
  log("------------------------------------------------------------");

  // Deploy the Equation library
  const equation = await deploy("Equation", {
    from: deployer,
    log: true,
  });

  // Deploy the Test contract and link the Equation library
  const test = await deploy("Test", {
    from: deployer,
    args: [],
    log: true,
    libraries: {
      Equation: equation.address,
    },
  });

  log(`Equation deployed at ${equation.address}`);
  log(`Test deployed at ${test.address}`);
};

module.exports.tags = ["all", "Test"];
