import { pack } from "@gainsnetwork/sdk";

export const transformOi = ({ long, short, max }) => ({
  long: parseFloat(long) / 1e10,
  short: parseFloat(short) / 1e10,
  max: parseFloat(max) / 1e10,
});

export const convertTradeInitialAccFees = (initialAccFees) => ({
  accPairFee: parseFloat(initialAccFees?.accPairFee || "0") / 1e10,
  accGroupFee: parseFloat(initialAccFees?.accGroupFee || "0") / 1e10,
  block: parseInt(initialAccFees?.block || "0"),
});

export const transformFrom1e10 = (value) => parseFloat(value) / 1e10;
