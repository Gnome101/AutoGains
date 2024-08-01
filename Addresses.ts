export interface ChainLinkInfo {
  OracleAddress: string;
  ChainLinkToken: string;
  GainsNetwork: string;
}

export const contracts: { [chainID: number]: ChainLinkInfo } = {
  421614: {
    //Arbitrum Sepolia
    OracleAddress: "0xd36c6B1777c7f3Db1B3201bDD87081A9045B7b46",
    ChainLinkToken: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
    GainsNetwork: "0xd659a15812064c79e189fd950a189b15c75d3186", //The Diamond
  },
  31337: {
    //Arbitrum Sepolia
    OracleAddress: "0xd36c6B1777c7f3Db1B3201bDD87081A9045B7b46",
    ChainLinkToken: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
    GainsNetwork: "0xd659a15812064c79e189fd950a189b15c75d3186", //The Diamond
  },
};
