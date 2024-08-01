import { run } from "hardhat";

const verify = async (
  contractAddress: string,
  args: any[],
  contractLocation: string
): Promise<void> => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
      location: contractLocation,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
};

export { verify };
