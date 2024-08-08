export interface Contracts {
  OracleAddress: string;
  ChainLinkToken: string;
  GainsNetwork: string;
  DAI: string;
  USDC: string;
  WETH: string;
}

export const contracts: { [chainID: number]: Contracts } = {
  421614: {
    //Arbitrum Sepolia
    OracleAddress: "0xd36c6B1777c7f3Db1B3201bDD87081A9045B7b46",
    ChainLinkToken: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
    GainsNetwork: "0xd659a15812064c79e189fd950a189b15c75d3186", //The Diamond
    DAI: "0xfBb7E7FEE1525958bf5a4F04ed8D7be547AB6d27",
    USDC: "0x4cC7EbEeD5EA3adf3978F19833d2E1f3e8980cD6",
    WETH: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
  },
  31337: {
    //Arbitrum Sepolia
    OracleAddress: "0xd36c6B1777c7f3Db1B3201bDD87081A9045B7b46",
    ChainLinkToken: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
    GainsNetwork: "0xd659a15812064c79e189fd950a189b15c75d3186", //The Diamond
    DAI: "0xfBb7E7FEE1525958bf5a4F04ed8D7be547AB6d27",
    USDC: "0x4cC7EbEeD5EA3adf3978F19833d2E1f3e8980cD6",
    WETH: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
  },
};
