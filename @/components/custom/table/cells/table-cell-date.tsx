import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { formatLongDate, formatMediumDate } from "~/util/format/formatDate";
import { i18n } from "i18next";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";

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
  formatDate = "medium",
}: TableCellProps<TData>) {
  const initialValue = getValue();
  return (
    <>
    {typeof initialValue == "string" && 
    <div className=" whitespace-nowrap truncate">
        {formatDate == "long" && (
          format(toZonedTime(initialValue, "UTC"), "yyyy-MM-dd")
          // formatLongDate(toZonedTime(initialValue, "UTC"), "yyyy-MM-dd"), i18n.language)
        )}
        {formatDate == "medium" && (
          format(toZonedTime(initialValue, "UTC"), "yyyy-MM-dd")

          // formatMediumDate(initialValue, i18n.language)
        )}
        </div>
      }
      </>

  );
}
