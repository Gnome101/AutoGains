import { ethers } from "hardhat";
import axios, { AxiosRequestConfig, Method } from "axios";
import { VaultFactory } from "../typechain-types/contracts/VaultFactory";
import { Provider } from "ethers";
import Decimal from "decimal.js";

// Replace with your contract address and ABI
const CONTRACT_ADDRESS = "0x...";
const CONTRACT_ABI = [
  // Add the ABI for the VaultCreated event and other necessary functions
  "event VaultCreated(address indexed vaultCreator, address indexed vaultAddress, address indexed collateral, tuple(string,string,string[])[] apiinfo, uint256[][] strategy)",
];

// Array to store vault addresses
let vaultAddresses: string[] = [];

// Function to fetch VaultCreated events
async function fetchVaultCreatedEvents() {
  const provider = ethers.provider;
  const vaultFactory = await ethers.getContractAt(
    "VaultFactory",
    "0xb5cd1c54624533cB009a1a7244Fc75D46d8EBd02"
  );
  const filter = vaultFactory.filters.VaultCreated();
  const events = await vaultFactory.queryFilter(filter);

  vaultAddresses = events.map((event) => event.args.vaultAddress);
  console.log(`Fetched ${vaultAddresses.length} vault addresses`);
}

// Main function to run the bot
async function runBot() {
  console.log("Bot started");

  // Fetch initial vault addresses
  console.log(`Fetching created vaults...`);
  await fetchVaultCreatedEvents();
  const vaultFactory = await ethers.getContractAt(
    "VaultFactory",
    "0xb5cd1c54624533cB009a1a7244Fc75D46d8EBd02"
  );

  // Run indefinitely
  while (true) {
    for (let index = 0; index < vaultAddresses.length; index++) {
      let autoVault = await ethers.getContractAt(
        "AutoVault",
        vaultAddresses[index]
      );
      const vaultAddress = vaultAddresses[index];
      console.log(`Fetching strategies...`);
      const apiInfo = await getStrategyResults(
        vaultFactory,
        vaultAddress,
        ethers.provider
      );
      console.log(`Fetched ${apiInfo.length} strategies`);
      for (let i = 0; i < apiInfo.length; i++) {
        const action = await autoVault.processStrategy(i, apiInfo[i]);
        if (0 < action) {
          console.log(`Executing strategy ${i}`);
          console.log(action);
          const activePosition = await autoVault.strategyToActive(i);
          const strategyToIndex = await autoVault.strategyToIndex(i);
          console.log(activePosition, strategyToIndex, Number(action) >> 252);

          if (activePosition && Number(action) >> 252 != 0)
            await autoVault.executeStrategy(i);
        } else {
          console.log(`Not executing strategy ${i}`);
        }
      }
    }

    // Wait for 1 minute before next check
    console.log("Waiting 60s before next call...");
    await new Promise((resolve) => setTimeout(resolve, 60000));

    // Optionally, update the vault addrevsses list periodically
    await fetchVaultCreatedEvents();
  }
}

// Run the bot
runBot().catch((error) => {
  console.error("Bot error:", error);
  process.exit(1);
});

interface StrategyResult {
  result: Decimal[];
}
async function getStrategyResults(
  vaultFactory: VaultFactory,
  vaultAddress: string,
  provider: Provider
): Promise<string[][]> {
  // Create an interface with just this event
  const filter = vaultFactory.filters.VaultCreated(
    undefined,
    vaultAddress,
    undefined
  );

  const info = await vaultFactory.queryFilter(filter);

  let responses = [];
  for (let slot = 0; slot < info.length; slot++) {
    const apiInfo = info[slot].args.apiinfo[0] as ApiInfo;

    // const method = apiInfo.method;
    // const url = apiInfo.url;
    // const headers = apiInfo.headers;
    // const body = apiInfo.body;
    // const path = apiInfo.path;
    // const jobID = apiInfo.jobIDs;

    const res = await makeApiCall(apiInfo);

    const arr = parseJsonByPath(res, apiInfo.path);
    const decimal = new Decimal(10).pow(18);
    const finalArr = arr.map((x) =>
      new Decimal(x).mul(decimal).floor().toFixed()
    );
    console.log("Final", finalArr);
    responses.push(finalArr);
  }
  return responses;
}
interface ApiInfo {
  method: string;
  url: string;
  headers: string;
  body: string;
  path: string;
  jobIDs: string;
}
async function makeApiCall(apiInfo: ApiInfo): Promise<any> {
  const { method, url, headers, body, path } = apiInfo;

  // Parse headers
  const headerArray: string[] = JSON.parse(headers);
  const parsedHeaders: Record<string, string> = {};
  for (let i = 0; i < headerArray.length; i += 2) {
    if (headerArray[i].toLowerCase() === "accept") {
      parsedHeaders["Content-Type"] = headerArray[i + 1];
    } else {
      parsedHeaders[headerArray[i]] = headerArray[i + 1];
    }
  }

  // Prepare request config
  const config: AxiosRequestConfig = {
    method: method as Method,
    url: `${url}`,
    headers: parsedHeaders,
    data: body ? JSON.parse(body) : undefined,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function parseJsonByPath(json: JsonValue, path: string): any[] {
  const pathParts = path.split(";");

  return pathParts.map((part) => {
    const keys = part.split(",");
    return keys.reduce<JsonValue>((acc: JsonValue, key: string): JsonValue => {
      if (typeof acc === "object" && acc !== null) {
        if (Array.isArray(acc)) {
          return acc[parseInt(key)] ?? null;
        } else {
          return (acc as { [key: string]: JsonValue })[key] ?? null;
        }
      }
      return null;
    }, json);
  });
}
