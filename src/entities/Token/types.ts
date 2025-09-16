import { SupportedChainName } from "@shared/types/test-task-types";

export interface TokenData {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  pairAddress: string;
  chain: SupportedChainName;
  exchange: string;
  priceUsd: number;
  volumeUsd: number;
  mcap: number;
  priceChangePcs: {
    "5M": number;
    "1H": number;
    "6H": number;
    "24H": number;
  };
  transactions: {
    buys: number;
    sells: number;
    txns: number;
  };
  audit: {
    mintable: boolean;
    freezable: boolean;
    honeypot: boolean;
    contractVerified: boolean;
  };
  tokenCreatedTimestamp: Date;
  liquidity: {
    current: number;
    changePc: number;
  };
  totalSupply?: number;
  migrationPc?: string;
}
