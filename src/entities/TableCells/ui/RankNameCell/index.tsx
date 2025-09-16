import { memo } from "react";
import s from "./style.module.css";

interface Props {
  index: number;
  name: string;
  symbol: string;
}

export const RankNameCell: React.FC<Props> = memo(({ index, name, symbol }) => (
  <div className={s.cell}>
    <span className={s.index}>{index + 1}</span>

    <div className={s.info}>
      <div className={s.name}>{name}</div>
      <div className={s.symbol}>{symbol}</div>
    </div>
  </div>
));
