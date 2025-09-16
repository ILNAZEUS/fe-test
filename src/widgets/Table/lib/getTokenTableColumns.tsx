import {
  ExchangeCell,
  LiquidityCell,
  PriceChangeCell,
  RankNameCell,
} from "@entities/TableCells";
import { AuditCell } from "@entities/TableCells/ui/AuditCell";
import { PriceCell } from "@entities/TableCells/ui/PriceCell";
import { TokenData } from "@entities/Token";
import { ColumnDef, Row } from "@tanstack/react-table";

export const sortingFn = (a: Row<TokenData>, b: Row<TokenData>, id: string) =>
  (Number(a.getValue(id)) || 0) - (Number(b.getValue(id)) || 0);

export const getTokenTableColumns = (
  pricePeriods: { key: keyof TokenData["priceChangePcs"]; label: string }[]
): ColumnDef<TokenData>[] => [
  // Rank + Name/Symbol
  {
    id: "rankName",
    header: "Name",
    cell: ({ row }) => {
      const t = row.original;
      return (
        <RankNameCell
          index={row.index}
          name={t.tokenName}
          symbol={t.tokenSymbol}
        />
      );
    },
  },

  // Chain
  {
    accessorKey: "chain",
    header: "Chain",
    filterFn: (row, columnId, value) => {
      if (!value || value === "All") return true;
      return row.getValue<string>(columnId) === value;
    },
  },

  // Exchange
  {
    accessorKey: "exchange",
    header: "Exchange",
    cell: ({ getValue }) => <ExchangeCell value={String(getValue() || "")} />,
  },

  // Price
  {
    header: "Price (USD)",
    accessorKey: "priceUsd",
    cell: ({ getValue }) => <PriceCell value={getValue<number>()} />,
    sortingFn,
  },

  // Price Change 5m/1h/6h/24h
  ...pricePeriods.map(
    ({ key, label }): ColumnDef<TokenData> => ({
      id: `priceChange${label}`,
      header: `${label} %`,
      accessorFn: (row) => {
        const val = row.priceChangePcs?.[key];
        return isFinite(Number(val)) ? Number(val) : 0;
      },
      cell: ({ getValue }) => <PriceChangeCell value={Number(getValue())} />,
      sortingFn,
    })
  ),

  // Market Cap
  {
    accessorKey: "mcap",
    header: "Market Cap",
    cell: ({ getValue }) => {
      const val = Number(getValue());
      return `$${isFinite(val) ? val.toLocaleString() : "0"}`;
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const val = Number(row.getValue(columnId));
      return (isFinite(val) ? val : 0) >= Number(filterValue);
    },
    sortingFn,
  },

  // Volume
  {
    accessorKey: "volumeUsd",
    header: "Volume (24h)",
    cell: ({ getValue }) => {
      const val = Number(getValue());
      return `$${isFinite(val) ? val.toLocaleString() : "0"}`;
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const val = Number(row.getValue(columnId));
      return (isFinite(val) ? val : 0) >= Number(filterValue);
    },
    sortingFn,
  },

  // Liquidity
  {
    id: "liquidity",
    header: "Liquidity",
    accessorFn: (row) => Number(row.liquidity?.current) || 0,
    cell: ({ row }) => {
      const liquidity = row.original.liquidity;
      return (
        <LiquidityCell
          current={Number(liquidity?.current) || 0}
          change={Number(liquidity?.changePc) || 0}
        />
      );
    },
    sortingFn,
  },

  // Buys
  {
    id: "buys",
    header: "Buys",
    accessorFn: (row) => Number(row.transactions?.buys) || 0,
    cell: ({ getValue }) => Number(getValue()).toLocaleString(),
    sortingFn,
  },

  // Sells
  {
    id: "sells",
    header: "Sells",
    accessorFn: (row) => Number(row.transactions?.sells) || 0,
    cell: ({ getValue }) => Number(getValue()).toLocaleString(),
    sortingFn,
  },

  // Age
  {
    accessorKey: "tokenCreatedTimestamp",
    header: "Age (days)",
    accessorFn: (row) => {
      const ts = row.tokenCreatedTimestamp;
      return ts instanceof Date && !isNaN(ts.getTime())
        ? Math.floor((Date.now() - ts.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    },
    cell: ({ getValue }) => `${getValue()} days`,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue && filterValue !== 0) return true;
      const days = Number(row.getValue(columnId));
      return isFinite(days) && days > 0 && days <= Number(filterValue);
    },

    sortingFn: "basic",
  },

  // Audit
  {
    id: "auditIndicators",
    header: "Audit",
    accessorFn: (row) => row.audit?.honeypot ?? false,
    cell: ({ row }) => <AuditCell {...(row.original.audit || {})} />,
    filterFn: (row, _id, exclude: boolean) => {
      if (!exclude) return true;
      return !row.original.audit?.honeypot;
    },
  },
];
