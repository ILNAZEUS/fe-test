import React, { useEffect, useMemo, useRef, useState } from "react";
import s from "./style.module.css";
import { Tabs } from "@shared/ui/Tabs";
import { pricePeriods, tabList } from "../consts";
import { TokenData } from "@entities/Token";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TableFilters } from "@features/TableFilters";
import { VirtualizedTableBody } from "@features/VirtualizedTableBody";
import { getTokenTableColumns } from "../lib/getTokenTableColumns";
import {
  useScannerWebSocket,
  useTokenTableFilters,
  useTokensData,
} from "../hooks";
import { Loader } from "@shared/ui/Loader";
import { exportToCSV } from "@shared/lib/exportToCSV";
import { TableHead } from "@features/TableHead";

export const Wrapper: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabList[0].key);

  const {
    error,
    isLoading,
    newTokens,
    setNewTokens,
    setTrendingTokens,
    trendingTokens,
    hasMore,
    loadMoreNew,
    loadMoreTrending,
  } = useTokensData();

  useScannerWebSocket(setTrendingTokens, setNewTokens);

  return (
    <div className={s.wrapper}>
      <Tabs activeTab={activeTab} list={tabList} setActiveTab={setActiveTab} />
      {activeTab === "trending" && (
        <TokenTable
          hasMore={hasMore.trending}
          loadMore={loadMoreTrending}
          tokens={trendingTokens}
          isLoading={isLoading.trending}
          error={error.trending}
        />
      )}
      {activeTab === "new" && (
        <TokenTable
          hasMore={hasMore.new}
          loadMore={loadMoreNew}
          tokens={newTokens}
          isLoading={isLoading.new}
          error={error.new}
        />
      )}
    </div>
  );
};

interface TableProps {
  tokens: TokenData[];
  loadMore: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  error?: string;
}

export const TokenTable: React.FC<TableProps> = ({
  tokens,
  isLoading,
  error,
  hasMore,
  loadMore,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    chainFilter,
    columnFilters,
    excludeHoneypots,
    maxAge,
    minMcap,
    minVolume,
    resetFilters,
    setChainFilter,
    setColumnFilters,
    setExcludeHoneypots,
    setMaxAge,
    setMinMcap,
    setMinVolume,
  } = useTokenTableFilters();

  const columns = useMemo<ColumnDef<TokenData>[]>(
    () => getTokenTableColumns(pricePeriods),
    []
  );

  const table = useReactTable({
    data: tokens,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    estimateSize: () => 67,
    getScrollElement: () => parentRef.current,
  });

  useEffect(() => {
    const lastItem = rowVirtualizer.getVirtualItems().at(-1);
    if (!lastItem) return;
    if (hasMore && lastItem.index >= tokens.length - 5) {
      loadMore();
    }
  }, [rowVirtualizer.getVirtualItems(), tokens.length, hasMore]);

  if (isLoading) {
    return (
      <div className={s.block}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className={s.block}>{error}</div>;
  }

  if (!tokens.length) {
    return <div className={s.block}>No data to show</div>;
  }

  return (
    <div>
      <TableFilters
        chainFilter={chainFilter}
        excludeHoneypots={excludeHoneypots}
        maxAge={maxAge}
        minMcap={minMcap}
        minVolume={minVolume}
        resetFilters={resetFilters}
        setChainFilter={setChainFilter}
        setExcludeHoneypots={setExcludeHoneypots}
        setMaxAge={setMaxAge}
        setMinMcap={setMinMcap}
        setMinVolume={setMinVolume}
      />

      <button
        className={s.button}
        onClick={() => exportToCSV(tokens, "tokens")}
      >
        Export CSV
      </button>

      <div ref={parentRef} className={s.parent}>
        <table className={s.table}>
          <TableHead table={table} />

          <VirtualizedTableBody
            table={table}
            rowVirtualizer={rowVirtualizer}
            columns={columns}
          />
        </table>
      </div>
    </div>
  );
};
