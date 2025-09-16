import { TokenData } from "@entities/Token";
import { flexRender, Row } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";
import React, { memo } from "react";
import s from "./style.module.css";

interface Props {
  row: Row<TokenData>;
  virtualRow: VirtualItem;
}

export const Item: React.FC<Props> = memo(({ row, virtualRow }) => {
  const isEven = virtualRow.index % 2 === 0;

  return (
    <div
      className={`${s.item} ${isEven ? s.even : ""}`}
      style={{
        transform: `translateY(${virtualRow.start}px)`,
      }}
    >
      <div className={s.row}>
        {row.getVisibleCells().map((cell) => (
          <div key={cell.id} className={`${s.cell}`}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        ))}
      </div>
    </div>
  );
});
