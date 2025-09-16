import { memo } from "react";
import s from "./style.module.css";

// PriceChangeCell.tsx
export const PriceChangeCell = memo(({ value }: { value: number }) => {
  return (
    <span
      className={`${s.cell} ${value > 0 ? s.green : value < 0 ? s.red : ""}`}
    >
      {isFinite(value) ? value.toFixed(2) : "0.00"}%
    </span>
  );
});
