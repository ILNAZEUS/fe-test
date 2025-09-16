import { TokenData, mapScannerResultToTokenData } from "@entities/Token";
import {
  OutgoingWebSocketMessage,
  IncomingWebSocketMessage,
  PairStatsMsgData,
} from "../types/test-task-types";

const WS_URL = "wss://api-rs.dexcelerate.com/ws";

type onTick = (
  tokenId: string,
  price: number,
  volume: number,
  mcap: number
) => void;

type onPairStats = (
  tokenId: string,
  audit: TokenData["audit"],
  migrationProgress?: string
) => void;

export class ScannerWebSocket {
  ws: WebSocket;
  onUpdate: (tokens: TokenData[]) => void;
  onTick?: onTick;
  onPairStats?: onPairStats;

  private tokensMap = new Map<string, TokenData>();
  private subscribedPairs = new Set<string>();
  private subscribedPairStats = new Set<string>();

  constructor(
    onUpdate: (tokens: TokenData[]) => void,
    onTick?: onTick,
    onPairStats?: onPairStats
  ) {
    this.ws = new WebSocket(WS_URL);
    this.onUpdate = (tokens) => {
      tokens.forEach((t) => this.tokensMap.set(t.tokenAddress, t));
      onUpdate(tokens);
    };
    this.onTick = onTick;
    this.onPairStats = onPairStats;

    this.ws.onopen = () => console.log("WebSocket connected");

    this.ws.onmessage = (event) => {
      const message: IncomingWebSocketMessage = JSON.parse(event.data);

      switch (message.event) {
        case "scanner-pairs": {
          const updatedTokens = message.data.results.pairs.map(
            mapScannerResultToTokenData
          );

          // Defining deleted tokens
          const updatedAddresses = new Set(
            updatedTokens.map((t) => t.tokenAddress)
          );
          for (const addr of Array.from(this.tokensMap.keys())) {
            if (!updatedAddresses.has(addr)) {
              const oldToken = this.tokensMap.get(addr);
              if (oldToken) {
                this.unsubscribePair(
                  oldToken.pairAddress,
                  oldToken.tokenAddress,
                  oldToken.chain
                );
                this.unsubscribePairStats(
                  oldToken.pairAddress,
                  oldToken.tokenAddress,
                  oldToken.chain
                );
              }
              this.tokensMap.delete(addr);
            }
          }

          // Merge with save price/mcap
          updatedTokens.forEach((t) => {
            const existing = this.tokensMap.get(t.tokenAddress);
            if (existing) {
              this.tokensMap.set(t.tokenAddress, { ...existing, ...t });
            } else {
              this.tokensMap.set(t.tokenAddress, t);
            }
          });

          this.onUpdate(Array.from(this.tokensMap.values()));

          // Subscribe only on new pairs
          updatedTokens.forEach((token) => {
            if (token.pairAddress && token.tokenAddress && token.chain) {
              this.subscribePair(
                token.pairAddress,
                token.tokenAddress,
                token.chain
              );
              this.subscribePairStats(
                token.pairAddress,
                token.tokenAddress,
                token.chain
              );
            }
          });
          break;
        }

        case "tick": {
          if (this.onTick) {
            const swaps = message.data.swaps.filter((s) => !s.isOutlier);
            if (swaps.length > 0) {
              const latestSwap = swaps[swaps.length - 1];
              const price = parseFloat(latestSwap.priceToken1Usd);
              const volume = parseFloat(latestSwap.amountToken1);

              const token = this.tokensMap.get(latestSwap.tokenInAddress);
              let mcap = token?.mcap || 0;

              if (token && isFinite(price) && token.totalSupply) {
                mcap = price * token.totalSupply;
              }

              let isBuy = false;
              if (token) {
                isBuy = latestSwap.tokenInAddress !== token.tokenAddress;
              }

              const buys = (token?.transactions?.buys || 0) + (isBuy ? 1 : 0);
              const sells =
                (token?.transactions?.sells || 0) + (!isBuy ? 1 : 0);

              this.onTick(latestSwap.tokenInAddress, price, volume, mcap);

              if (token) {
                this.tokensMap.set(token.tokenAddress, {
                  ...token,
                  priceUsd: price,
                  volumeUsd: volume,
                  mcap,
                  transactions: {
                    buys,
                    sells,
                    txns: (token?.transactions?.txns || 0) + 1,
                  },
                });
              }
            }
          }
          break;
        }

        case "pair-stats": {
          if (this.onPairStats) {
            const data: PairStatsMsgData = message.data;
            const audit: TokenData["audit"] = {
              mintable: data.pair.mintAuthorityRenounced,
              freezable: data.pair.freezeAuthorityRenounced,
              honeypot: !data.pair.token1IsHoneypot,
              contractVerified: data.pair.isVerified,
            };

            this.onPairStats(
              data.pair.token1Address,
              audit,
              data.migrationProgress ?? undefined
            );
          }
          break;
        }
      }
    };
  }

  subscribeScanner(params: object) {
    this.sendWhenReady({ event: "scanner-filter", data: params });
  }
  unsubscribeScanner(params: object) {
    this.sendWhenReady({ event: "unsubscribe-scanner-filter", data: params });
  }

  subscribePair(pair: string, token: string, chain: string) {
    const key = `${pair}-${token}-${chain}`;
    if (this.subscribedPairs.has(key)) return;
    this.subscribedPairs.add(key);
    this.sendWhenReady({
      event: "subscribe-pair",
      data: { pair, token, chain },
    });
  }
  unsubscribePair(pair: string, token: string, chain: string) {
    const key = `${pair}-${token}-${chain}`;
    if (!this.subscribedPairs.has(key)) return;
    this.subscribedPairs.delete(key);
    this.sendWhenReady({
      event: "unsubscribe-pair",
      data: { pair, token, chain },
    });
  }

  subscribePairStats(pair: string, token: string, chain: string) {
    const key = `${pair}-${token}-${chain}`;
    if (this.subscribedPairStats.has(key)) return;
    this.subscribedPairStats.add(key);
    this.sendWhenReady({
      event: "subscribe-pair-stats",
      data: { pair, token, chain },
    });
  }
  unsubscribePairStats(pair: string, token: string, chain: string) {
    const key = `${pair}-${token}-${chain}`;
    if (!this.subscribedPairStats.has(key)) return;
    this.subscribedPairStats.delete(key);
    this.sendWhenReady({
      event: "unsubscribe-pair-stats",
      data: { pair, token, chain },
    });
  }

  private sendWhenReady(msg: OutgoingWebSocketMessage) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      this.ws.addEventListener(
        "open",
        () => this.ws.send(JSON.stringify(msg)),
        { once: true }
      );
    }
  }

  close() {
    this.tokensMap.clear();
    this.subscribedPairs.clear();
    this.subscribedPairStats.clear();
    this.ws.close();
  }
}
