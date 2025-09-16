import { TokenData } from "@entities/Token";
import { flexRender, Table } from "@tanstack/react-table";
import React from "react";
import s from "./style.module.css";

interface Props {
  table: Table<TokenData>;
}

export const TableHead: React.FC<Props> = ({ table }) => {
  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={s.tableHead}
              onClick={header.column.getToggleSortingHandler()}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {{ asc: " 🔼", desc: " 🔽" }[
                header.column.getIsSorted() as string
              ] ?? null}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};
