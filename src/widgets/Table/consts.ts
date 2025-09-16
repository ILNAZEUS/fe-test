import { ITab } from "@shared/ui/Tabs";
import { PriceChangeKey } from "./types";

export const tabList: ITab[] = [
  {
    key: "trending",
    label: "Trending tokens",
  },

  {
    key: "new",
    label: "New tokens",
  },
];

export const pricePeriods: { key: PriceChangeKey; label: string }[] = [
  { key: "5M", label: "5m" },
  { key: "1H", label: "1h" },
  { key: "6H", label: "6h" },
  { key: "24H", label: "24h" },
];
