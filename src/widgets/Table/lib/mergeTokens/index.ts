import { TokenData } from "@entities/Token";

export function mergeTokens(
  prev: TokenData[],
  updated: TokenData[]
): TokenData[] {
  const map = new Map(prev.map((t) => [t.id, t]));
  updated.forEach((token) => {
    const existing = map.get(token.id);
    if (existing) {
      map.set(token.id, { ...existing, ...token });
    } else {
      map.set(token.id, token);
    }
  });
  return Array.from(map.values());
}
