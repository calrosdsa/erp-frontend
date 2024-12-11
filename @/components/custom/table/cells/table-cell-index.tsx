import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { formatLongDate } from "~/util/format/formatDate";
import { i18n } from "i18next";
import { formatCurrency } from "~/util/format/formatCurrency";


interface TableCellProps<TData> {
    getValue:Getter<any>
    row:Row<TData>,
    column: Column<TData, unknown>
    table:Table<TData>
}

export default function TableCellIndex<TData>({ getValue, row, column, table}:TableCellProps<TData>) {
  
  return (
    <div className="w-full justify-center flex font-semibold">
        <span>{row.index +1}.-</span>
    </div>
  );
};