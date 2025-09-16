import { TokenData } from "@entities/Token";
import { fetchScannerTokens } from "@shared/api/scanner";
import {
  NEW_TOKENS_FILTERS,
  TRENDING_TOKENS_FILTERS,
} from "@shared/types/test-task-types";
import { useEffect, useRef, useState } from "react";

export const useTokensData = () => {
  const [trendingTokens, setTrendingTokens] = useState<TokenData[]>([]);
  const [newTokens, setNewTokens] = useState<TokenData[]>([]);

  const [isLoading, setIsLoading] = useState({ trending: false, new: false });
  const [error, setError] = useState<{ trending?: string; new?: string }>({});

  const [page, setPage] = useState({ trending: 1, new: 1 });
  const [hasMore, setHasMore] = useState({ trending: true, new: true });

  const didFetch = useRef(false);

  const mergeTokens = (prev: TokenData[], next: TokenData[]) => {
    const map = new Map(prev.map((t) => [t.tokenAddress, t]));
    next.forEach((t) => map.set(t.tokenAddress, t));
    return Array.from(map.values());
  };

  const loadTrending = async (nextPage = 1) => {
    setIsLoading((prev) => ({ ...prev, trending: true }));
    try {
      const data = await fetchScannerTokens({
        ...TRENDING_TOKENS_FILTERS,
        page: nextPage,
      });
      if (data.length === 0) {
        setHasMore((prev) => ({ ...prev, trending: false }));
      } else {
        setTrendingTokens((prev) => mergeTokens(prev, data));
        setPage((prev) => ({ ...prev, trending: nextPage }));
      }
    } catch {
      setError((prev) => ({
        ...prev,
        trending: "Error while loading Trending Tokens",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, trending: false }));
    }
  };

  const loadNew = async (nextPage = 1) => {
    setIsLoading((prev) => ({ ...prev, new: true }));
    try {
      const data = await fetchScannerTokens({
        ...NEW_TOKENS_FILTERS,
        page: nextPage,
      });
      if (data.length === 0) {
        setHasMore((prev) => ({ ...prev, new: false }));
      } else {
        setNewTokens((prev) => mergeTokens(prev, data));
        setPage((prev) => ({ ...prev, new: nextPage }));
      }
    } catch {
      setError((prev) => ({ ...prev, new: "Error while loading New Tokens" }));
    } finally {
      setIsLoading((prev) => ({ ...prev, new: false }));
    }
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    loadTrending(1);
    loadNew(1);
  }, []);

  return {
    trendingTokens,
    newTokens,
    isLoading,
    error,
    hasMore,
    loadMoreTrending: () => loadTrending(page.trending + 1),
    loadMoreNew: () => loadNew(page.new + 1),
    setTrendingTokens,
    setNewTokens,
  };
};
