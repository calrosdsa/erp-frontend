import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { formatLongDate } from "~/util/format/formatDate";
import { i18n } from "i18next";
import { formatCurrency } from "~/util/format/formatCurrency";

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

export default function TableCellStatus<TData>({ getValue, row, column, table}:TableCellProps<TData>) {
  const initialValue = getValue();
  return (
    <div>
        {typeof initialValue == "string" &&(
            <span>{initialValue}</span>
        )
        }
    </div>
  );
};