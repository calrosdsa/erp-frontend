import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";

type Option = {
  label: string;
  value: string;
};
interface TableCellProps<TData> {
    getValue:Getter<any>
    row:Row<TData>,
    column: Column<TData, unknown>
    table:Table<TData>
}

export default function TableCellBoolean<TData>({ getValue, row, column, table }:TableCellProps<TData>) {
  const initialValue = getValue();
  return (
    <div>
        {typeof initialValue == "boolean" &&(
            initialValue? <SquareCheckIcon/>: <SquareIcon/>
        )

        }
    </div>
  );
};