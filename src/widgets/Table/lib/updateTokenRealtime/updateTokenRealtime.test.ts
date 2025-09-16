import { updateTokenRealtime } from "./";
import { TokenData } from "@entities/Token";

const token = (id: string): TokenData => ({
  id,
  tokenName: `Token ${id}`,
  tokenSymbol: `T${id}`,
  tokenAddress: id,
  pairAddress: "",
  chain: "ETH",
  exchange: "Uniswap",
  priceUsd: 1,
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

describe("updateTokenRealtime", () => {
  it("updates only the required token", () => {
    const prev = [token("1"), token("2")];
    const result = updateTokenRealtime(prev, "1", { priceUsd: 5 });
    expect(result.find((t) => t.id === "1")?.priceUsd).toBe(5);
    expect(result.find((t) => t.id === "2")?.priceUsd).toBe(1);
  });

  it("merges audit correctly", () => {
    const prev = [token("1")];
    const result = updateTokenRealtime(prev, "1", {
      audit: { mintable: true },
    });
    expect(result[0].audit.mintable).toBe(true);
    expect(result[0].audit.freezable).toBe(false);
  });
});
