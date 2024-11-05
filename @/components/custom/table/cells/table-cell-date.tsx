import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { formatLongDate, formatMediumDate } from "~/util/format/formatDate";
import { i18n } from "i18next";

type Option = {
  label: string;
  value: string;
};
interface TableCellProps<TData>  {
  getValue: Getter<any>;
  row: Row<TData>;
  column: Column<TData, unknown>;
  table: Table<TData>;
  i18n: i18n;
  formatDate?: "short" | "medium" | "long";
}

export default function TableCellDate<TData>({
  getValue,
  row,
  column,
  table,
  i18n,
  formatDate = "long",
}: TableCellProps<TData>) {
  const initialValue = getValue();
  return (
    <>
    {typeof initialValue == "string" && 
    <div className=" whitespace-nowrap">
        {formatDate == "long" && (
          formatLongDate(initialValue, i18n.language)
        )}
        {formatDate == "medium" && (
          formatMediumDate(initialValue, i18n.language)
        )}
        </div>
      }
      </>

  );
}
