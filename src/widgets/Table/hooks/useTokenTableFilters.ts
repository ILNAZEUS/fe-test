import { ColumnFiltersState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const useTokenTableFilters = () => {
  const [chainFilter, setChainFilter] = useState("All");
  const [minVolume, setMinVolume] = useState(0);
  const [maxAge, setMaxAge] = useState<number | "">("");
  const [minMcap, setMinMcap] = useState(0);
  const [excludeHoneypots, setExcludeHoneypots] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    const filters: ColumnFiltersState = [];
    if (chainFilter !== "All")
      filters.push({ id: "chain", value: chainFilter });
    if (minVolume > 0) filters.push({ id: "volumeUsd", value: minVolume });
    if (maxAge !== "" && maxAge !== undefined)
      filters.push({ id: "tokenCreatedTimestamp", value: maxAge });
    if (minMcap > 0) filters.push({ id: "mcap", value: minMcap });
    if (excludeHoneypots) filters.push({ id: "auditIndicators", value: true });
    setColumnFilters(filters);
  }, [chainFilter, minVolume, maxAge, minMcap, excludeHoneypots]);

  const resetFilters = () => {
    setChainFilter("All");
    setMinVolume(0);
    setMaxAge("");
    setMinMcap(0);
    setExcludeHoneypots(false);
  };

  return {
    chainFilter,
    setChainFilter,
    minVolume,
    setMinVolume,
    maxAge,
    setMaxAge,
    minMcap,
    setMinMcap,
    excludeHoneypots,
    setExcludeHoneypots,
    columnFilters,
    setColumnFilters,
    resetFilters,
  };
};
