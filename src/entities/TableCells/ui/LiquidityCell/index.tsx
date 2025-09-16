import { memo } from "react";
import s from "./style.module.css";

interface Props {
  current: number;
  change: number;
}

export const LiquidityCell: React.FC<Props> = memo(({ current, change }) => {
  return (
    <div className={s.cell}>
      ${current.toLocaleString()}
      <span
        className={`${s.text} ${
          change > 0 ? s.green : change < 0 ? s.red : ""
        }`}
      >
        ({Number(change.toFixed(2))}%)
      </span>
    </div>
  );
});
