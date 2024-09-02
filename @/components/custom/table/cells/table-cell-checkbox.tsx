import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";


interface TableCellProps<TData> {
    getValue:Getter<any>
    row:Row<TData>,
    column: Column<TData, unknown>
    table:Table<TData>
}

export default function TableCellCheckBox<TData>({ getValue, row, column, table }:TableCellProps<TData>) {
  const initialValue = getValue();
//   const selected = table.getFilteredSelectedRowModel().rows.map(item=>item.index)
  
  return (
    <div>
        {typeof initialValue == "boolean" &&(
            initialValue? <SquareCheckIcon/>: <SquareIcon/>
        )

        }
    </div>
  );
};