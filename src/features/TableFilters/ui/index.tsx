import { SetState } from "@shared/types/global";
import React from "react";
import s from "./style.module.css";

interface Props {
  chainFilter: string;
  setChainFilter: SetState<string>;
  minVolume: number;
  setMinVolume: SetState<number>;
  maxAge: number | "";
  setMaxAge: SetState<number | "">;
  minMcap: number;
  setMinMcap: SetState<number>;
  excludeHoneypots: boolean;
  setExcludeHoneypots: SetState<boolean>;
  resetFilters: () => void;
}

export const TableFilters: React.FC<Props> = ({
  chainFilter,
  setChainFilter,
  minVolume,
  setMinVolume,
  maxAge,
  setMaxAge,
  excludeHoneypots,
  minMcap,
  setExcludeHoneypots,
  setMinMcap,
  resetFilters,
}) => {
  return (
    <div className={s.filters}>
      <label>
        Chain:{" "}
        <select
          value={chainFilter}
          onChange={(e) => setChainFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="ETH">ETH</option>
          <option value="SOL">SOL</option>
          <option value="BASE">BASE</option>
          <option value="BSC">BSC</option>
        </select>
      </label>
      <label>
        Min Volume:{" "}
        <input
          type="number"
          min={0}
          value={minVolume}
          onChange={(e) => setMinVolume(Number(e.target.value))}
          style={{ width: 120 }}
        />
      </label>
      <label>
        Max Age (days):{" "}
        <input
          type="number"
          min={0}
          value={maxAge}
          onChange={(e) =>
            setMaxAge(e.target.value === "" ? "" : Number(e.target.value))
          }
          style={{ width: 120 }}
        />
      </label>
      <label>
        Min Market Cap:{" "}
        <input
          type="number"
          min={0}
          value={minMcap}
          onChange={(e) => setMinMcap(Number(e.target.value))}
          style={{ width: 140 }}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={excludeHoneypots}
          onChange={(e) => setExcludeHoneypots(e.target.checked)}
        />{" "}
        Exclude Honeypots
      </label>
      <button onClick={resetFilters}>Reset filters</button>
    </div>
  );
};
