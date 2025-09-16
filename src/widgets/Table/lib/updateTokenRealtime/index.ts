import { TokenData } from "@entities/Token";

export function updateTokenRealtime(
  prev: TokenData[],
  tokenId: string,
  changes: Partial<Omit<TokenData, "audit">> & {
    audit?: Partial<TokenData["audit"]>;
  }
): TokenData[] {
  return prev.map((t) =>
    t.id === tokenId
      ? {
          ...t,
          ...changes,
          audit: changes.audit ? { ...t.audit, ...changes.audit } : t.audit,
        }
      : t
  );
}
