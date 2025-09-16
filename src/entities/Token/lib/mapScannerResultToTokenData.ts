import { chainIdToName, ScannerResult } from "@shared/types/test-task-types";
import { TokenData } from "../types";

export function mapScannerResultToTokenData(result: ScannerResult): TokenData {
  const mcap =
    parseFloat(result.currentMcap) > 0
      ? parseFloat(result.currentMcap)
      : parseFloat(result.initialMcap) > 0
      ? parseFloat(result.initialMcap)
      : parseFloat(result.pairMcapUsd) > 0
      ? parseFloat(result.pairMcapUsd)
      : parseFloat(result.pairMcapUsdInitial) > 0
      ? parseFloat(result.pairMcapUsdInitial)
      : 0;

  return {
    id: result.pairAddress,
    tokenName: result.token1Name,
    tokenSymbol: result.token1Symbol,
    tokenAddress: result.token1Address,
    pairAddress: result.pairAddress,
    chain: chainIdToName(result.chainId),
    exchange: result.routerAddress,
    priceUsd: parseFloat(result.price),
    volumeUsd: parseFloat(result.volume),
    mcap,
    priceChangePcs: {
      "5M": parseFloat(result.diff5M),
      "1H": parseFloat(result.diff1H),
      "6H": parseFloat(result.diff6H),
      "24H": parseFloat(result.diff24H),
    },
    transactions: {
      buys: result.buys ?? 0,
      sells: result.sells ?? 0,
      txns: result.txns ?? 0,
    },
    audit: {
      mintable: result.isMintAuthDisabled,
      freezable: result.isFreezeAuthDisabled,
      honeypot: result.honeyPot ?? false,
      contractVerified: result.contractVerified,
    },
    tokenCreatedTimestamp: new Date(result.age),
    liquidity: {
      current: parseFloat(result.liquidity),
      changePc: parseFloat(result.percentChangeInLiquidity),
    },
  };
}
