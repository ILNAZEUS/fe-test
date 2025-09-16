import { TokenData } from "@entities/Token";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Virtualizer } from "@tanstack/react-virtual";
import React from "react";
import { Item } from "./Item";
import s from "./style.module.css";

interface Props {
  table: Table<TokenData>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  columns: ColumnDef<TokenData>[];
}

export const VirtualizedTableBody: React.FC<Props> = ({
  table,
  rowVirtualizer,
  columns,
}) => {
  return (
    <tbody>
      <tr>
        <td colSpan={columns.length}>
          <div
            className={s.wrapper}
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              if (!row) return null;
              return <Item key={row.id} virtualRow={virtualRow} row={row} />;
            })}
          </div>
        </td>
      </tr>
    </tbody>
  );
};
