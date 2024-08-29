import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { formatLongDate } from "~/util/format/formatDate";
import { i18n } from "i18next";

type Option = {
  label: string;
  value: string;
};
interface TableCellProps<TData> {
    getValue:Getter<any>
    row:Row<TData>,
    column: Column<TData, unknown>
    table:Table<TData>
    i18n:i18n
}

export default function TableCellDate<TData>({ getValue, row, column, table ,i18n}:TableCellProps<TData>) {
  const initialValue = getValue();
  return (
    <div>
        {typeof initialValue == "string" &&(
            formatLongDate(initialValue,i18n.language)
        )

        }
    </div>
  );
};