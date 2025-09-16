import { mergeTokens } from "./";
import { TokenData } from "@entities/Token";

const baseToken = (id: string, price = 1): TokenData => ({
  id,
  tokenName: `Token ${id}`,
  tokenSymbol: `T${id}`,
  tokenAddress: id,
  pairAddress: "",
  chain: "ETH",
  exchange: "Uniswap",
  priceUsd: price,
  volumeUsd: 0,
  mcap: 0,
  priceChangePcs: { "5M": 0, "1H": 0, "6H": 0, "24H": 0 },
  transactions: { buys: 0, sells: 0, txns: 0 },
  audit: {
    mintable: false,
    freezable: false,
    honeypot: false,
    contractVerified: false,
  },
  tokenCreatedTimestamp: new Date(),
  liquidity: { current: 0, changePc: 0 },
});

describe("mergeTokens", () => {
  it("adding new token to the list", () => {
    const prev = [baseToken("1")];
    const updated = [baseToken("2")];
    const result = mergeTokens(prev, updated);
    expect(result).toHaveLength(2);
    expect(result.find((t) => t.id === "2")).toBeDefined();
  });

  it("updates existing token", () => {
    const prev = [baseToken("1", 1)];
    const updated = [baseToken("1", 2)];
    const result = mergeTokens(prev, updated);
    expect(result).toHaveLength(1);
    expect(result[0].priceUsd).toBe(2);
  });
});
