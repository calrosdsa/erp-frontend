import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { formatLongDate } from "~/util/format/formatDate";
import { i18n, TFunction } from "i18next";
import { formatCurrency } from "~/util/format/formatCurrency";


interface TableCellProps<TData> {
    getValue:Getter<any>
    row:Row<TData>,
    column: Column<TData, unknown>
    table:Table<TData>
    t: TFunction<"common", undefined>
}

export default function TableCellTranslate<TData>({ getValue, row, column, table,t}:TableCellProps<TData>) {
    const initialValue = getValue();
  
  return (
    <div>
        {typeof initialValue != 'undefined' &&
        <span>{t(initialValue)}</span>
        }
    </div>
  );
};