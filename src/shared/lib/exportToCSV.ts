import { TokenData } from "@entities/Token";

export function exportToCSV(tokens: TokenData[], filename: string) {
  if (!tokens.length) return;

  const headers = [
    "Name",
    "Symbol",
    "Chain",
    "Exchange",
    "Price USD",
    "Market Cap",
    "Volume 24h",
    "Age",
    "Buys",
    "Sells",
    "Liquidity",
  ];

  const rows = tokens.map((t) => [
    t.tokenName,
    t.tokenSymbol,
    t.chain,
    t.exchange,
    t.priceUsd,
    t.mcap,
    t.volumeUsd,
    t.tokenCreatedTimestamp.toISOString(),
    t.transactions.buys,
    t.transactions.sells,
    t.liquidity.current,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map(String)
        .map((v) => `"${v.replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
