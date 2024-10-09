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
    i18n:i18n
    currency:string
    price?:number
}

export default function TableCellPrice<TData>({ getValue, row, column, table ,i18n,currency,price}:TableCellProps<TData>) {
  const initialValue = getValue();
  return (
    <div>
      {price != undefined ?
        formatCurrency(price,currency,i18n.language)
      :
        typeof initialValue == "number" &&(
          formatCurrency(initialValue,currency,i18n.language)
        )


        }
    </div>
  );
};