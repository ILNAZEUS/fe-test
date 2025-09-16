import { TokenData } from "@entities/Token";
import { ScannerWebSocket } from "@shared/api/ws";
import { useEffect } from "react";
import { mergeTokens } from "../lib/mergeTokens";
import { updateTokenRealtime } from "../lib/updateTokenRealtime";

export const useScannerWebSocket = (
  setTrendingTokens: React.Dispatch<React.SetStateAction<TokenData[]>>,
  setNewTokens: React.Dispatch<React.SetStateAction<TokenData[]>>
) => {
  useEffect(() => {
    const ws = new ScannerWebSocket(
      // scanner-pairs update
      (updatedTokens) => {
        setTrendingTokens((prev) => mergeTokens(prev, updatedTokens));
        setNewTokens((prev) => mergeTokens(prev, updatedTokens));
      },
      // tick
      (tokenId: string, price: number, volume: number, mcap: number) => {
        setTrendingTokens((prev) =>
          updateTokenRealtime(prev, tokenId, {
            priceUsd: price,
            volumeUsd: volume,
            mcap,
          })
        );
        setNewTokens((prev) =>
          updateTokenRealtime(prev, tokenId, {
            priceUsd: price,
            volumeUsd: volume,
            mcap,
          })
        );
      },
      // pair-stats
      (
        tokenId: string,
        audit: TokenData["audit"],
        migrationProgress?: string
      ) => {
        setTrendingTokens((prev) =>
          updateTokenRealtime(prev, tokenId, {
            audit,
            migrationPc: migrationProgress,
          })
        );
        setNewTokens((prev) =>
          updateTokenRealtime(prev, tokenId, {
            audit,
            migrationPc: migrationProgress,
          })
        );
      }
    );

    ws.subscribeScanner({ rankBy: "volume", orderBy: "desc" });

    return () => ws.close();
  }, [setTrendingTokens, setNewTokens]);
};
